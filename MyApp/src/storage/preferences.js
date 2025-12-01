import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  blockedApps: 'dd_blocked_apps',
  problemTarget: 'dd_problem_target',
  themePrimary: 'dd_theme_primary',
  themeSecondary: 'dd_theme_secondary',
  themeKey: 'dd_theme_key',
};

// Daily puzzle counts used for streak (date string -> number)
export const PUZZLE_COUNTS_KEY = 'dd_puzzle_counts';

// Lightweight event emitter for puzzle count changes
const listeners = new Set();
export function onPuzzleCountChanged(handler) {
  listeners.add(handler);
  return () => listeners.delete(handler);
}
function emitPuzzleCountChanged(payload) {
  listeners.forEach((fn) => {
    try { fn(payload); } catch {}
  });
}

export async function incrementTodayPuzzleCount() {
  const today = new Date().toISOString().substring(0, 10);
  let counts = {};
  try {
    const raw = await AsyncStorage.getItem(PUZZLE_COUNTS_KEY);
    counts = raw ? JSON.parse(raw) : {};
  } catch {}
  const next = { ...counts, [today]: (counts[today] || 0) + 1 };
  try { await AsyncStorage.setItem(PUZZLE_COUNTS_KEY, JSON.stringify(next)); } catch {}
  // Notify listeners
  emitPuzzleCountChanged({ date: today, count: next[today] });
  return next[today];
}

export async function getPuzzleCounts() {
  try {
    const raw = await AsyncStorage.getItem(PUZZLE_COUNTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export async function loadPreferences() {
  try {
    const [blockedStr, targetStr, primary, secondary, themeKey] = await Promise.all([
      AsyncStorage.getItem(KEYS.blockedApps),
      AsyncStorage.getItem(KEYS.problemTarget),
      AsyncStorage.getItem(KEYS.themePrimary),
      AsyncStorage.getItem(KEYS.themeSecondary),
      AsyncStorage.getItem(KEYS.themeKey),
    ]);
    const blocked = blockedStr ? JSON.parse(blockedStr) : {};
    const problemTarget = targetStr ? Number(targetStr) : 5;
    const theme = (primary && secondary) ? { key: themeKey || 'classic', primary, secondary } : null;
    return { blocked, problemTarget, theme };
  } catch (e) {
    return { blocked: {}, problemTarget: 5, theme: null };
  }
}

export async function savePreferences({ blocked, problemTarget, theme }) {
  try {
    const tasks = [
      AsyncStorage.setItem(KEYS.blockedApps, JSON.stringify(blocked || {})),
      AsyncStorage.setItem(KEYS.problemTarget, String(problemTarget ?? 5)),
    ];
    if (theme && theme.primary && theme.secondary) {
      tasks.push(AsyncStorage.setItem(KEYS.themePrimary, theme.primary));
      tasks.push(AsyncStorage.setItem(KEYS.themeSecondary, theme.secondary));
      tasks.push(AsyncStorage.setItem(KEYS.themeKey, theme.key || 'custom'));
    }
    await Promise.all(tasks);
  } catch (e) {
    // ignore
  }
}

export async function setBlocked(blocked) {
  try {
    await AsyncStorage.setItem(KEYS.blockedApps, JSON.stringify(blocked || {}));
  } catch {}
}

export async function setProblemTarget(value) {
  try {
    await AsyncStorage.setItem(KEYS.problemTarget, String(value ?? 5));
  } catch {}
}

export async function setTheme(theme) {
  try {
    if (theme && theme.primary && theme.secondary) {
      await Promise.all([
        AsyncStorage.setItem(KEYS.themePrimary, theme.primary),
        AsyncStorage.setItem(KEYS.themeSecondary, theme.secondary),
        AsyncStorage.setItem(KEYS.themeKey, theme.key || 'custom'),
      ]);
    }
  } catch {}
}
