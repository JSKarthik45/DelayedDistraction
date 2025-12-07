import React, { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { ensureNotificationSetup, sendReminderNotification } from '../services/notifications';
import { loadPreferences, getPuzzleCounts, onPuzzleCountChanged } from '../storage/preferences';

// Helper: determine if current time falls within [fromTime, toTime] 24h HH:mm, supports overnight windows
function isWithinWindow(now, fromTime, toTime) {
  if (!fromTime || !toTime) return false;
  const [fh, fm] = fromTime.split(':').map(Number);
  const [th, tm] = toTime.split(':').map(Number);
  const from = new Date(now);
  from.setHours(fh, fm, 0, 0);
  const to = new Date(now);
  to.setHours(th, tm, 0, 0);

  if (to <= from) {
    // overnight window: e.g., 22:00 -> 06:00
    const toNext = new Date(from);
    toNext.setDate(toNext.getDate() + 1);
    toNext.setHours(th, tm, 0, 0);
    // if now before 'from', consider now as next-day segment
    const nowAdj = new Date(now);
    if (now < from) {
      // shift 'from' to previous day
      const fromPrev = new Date(from);
      fromPrev.setDate(fromPrev.getDate() - 1);
      return now >= fromPrev && now <= to;
    }
    return now >= from && now <= toNext;
  }
  return now >= from && now <= to;
}

// Reads current state needed for decision
async function getStatus() {
  const pref = await loadPreferences();
  const problemTarget = pref.problemTarget ?? 5;
  const fromTime = pref.fromTime || '';
  const toTime = pref.toTime || '';
  const counts = await getPuzzleCounts();
  const todayKey = new Date().toISOString().substring(0, 10);
  const completedToday = counts?.[todayKey] ?? 0;
  return { problemTarget, fromTime, toTime, completedToday };
}

export default function NoScrollNotifier() {
  const intervalRef = useRef(null);
  const appStateRef = useRef(AppState.currentState);

  useEffect(() => {
    let mounted = true;

    const startInterval = async () => {
      const granted = await ensureNotificationSetup();
      if (!granted || intervalRef.current) return;
      intervalRef.current = setInterval(async () => {
        try {
          const now = new Date();
          const { problemTarget, fromTime, toTime, completedToday } = await getStatus();
          if (isWithinWindow(now, fromTime, toTime) && completedToday < problemTarget) {
            const remaining = problemTarget - completedToday;
            await sendReminderNotification({
              title: 'Finish your puzzles first',
              body: `${remaining} to go before scrolling. Keep the streak alive!`,
            });
          }
        } catch {}
      }, 10 * 60 * 1000); // every 10 minutes
    };

    const clearIntervalIfAny = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    // Start immediately on mount
    startInterval();

    // Also react to puzzle count changes for immediate feedback
    const unsubscribeCount = onPuzzleCountChanged(async () => {
      try {
        const now = new Date();
        const { problemTarget, fromTime, toTime, completedToday } = await getStatus();
        if (isWithinWindow(now, fromTime, toTime) && completedToday < problemTarget) {
          const remaining = problemTarget - completedToday;
          await sendReminderNotification({
            title: 'One more puzzle',
            body: `${remaining} left to hit your goal. You’ve got this!`,
          });
        }
      } catch {}
    });

    // Pause/resume with app state to avoid redundant work
    const sub = AppState.addEventListener('change', async (nextState) => {
      appStateRef.current = nextState;
      if (nextState === 'active') {
        await startInterval();
      } else {
        clearIntervalIfAny();
      }
    });

    return () => {
      mounted = false;
      clearIntervalIfAny();
      sub.remove();
      unsubscribeCount && unsubscribeCount();
    };
  }, []);

  return null;
}
