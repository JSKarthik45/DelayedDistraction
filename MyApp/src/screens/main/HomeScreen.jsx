import React, { useMemo, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemeColors, useThemedStyles } from '../../theme/ThemeContext';
import TwoBoardPager from '../../components/TwoBoardPager';
import { supabase } from '../../services/supabase';

const styleFactory = (colors) => StyleSheet.create({
  container: { flex: 1, alignItems: 'stretch', justifyContent: 'center', paddingHorizontal: 0, paddingVertical: 0, backgroundColor: colors.background },
});

export default function HomeScreen({ mode = 'Trending' }) {
  const colors = useThemeColors();
  const styles = useThemedStyles(styleFactory);
  const FALLBACK_TRENDING = useMemo(() => ([
    { key: 'p1', fen: 'rnb1kbnr/pppp1ppp/8/4P3/6Pq/8/PrPP1PPP/RNBQKBNR w KQkq - 0 1', turnText: 'White to play', text: 'Can you solve this puzzle?', correctMove: 'Qh5#' },
  ]), []);
  const FALLBACK_PRACTICE = useMemo(() => ([
    { key: 'p1', fen: 'rnbqkbnr/pppp1ppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', turnText: 'White to play', text: "Start from the beginning!", correctMove: 'e4' },
  ]), []);
  const [TRENDINGBOARDS, setTRENDINGBOARDS] = useState(FALLBACK_TRENDING);
  const [PRACTICEBOARDS, setPRACTICEBOARDS] = useState(FALLBACK_PRACTICE);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [trendingRes, practiceRes] = await Promise.all([
        supabase.from('TrendingPuzzles').select('*').limit(10),
        supabase.from('PracticePuzzles').select('*').limit(10),
      ]);

      const { data: trending, error: trendingError } = trendingRes || {};
      const { data: practice, error: practiceError } = practiceRes || {};

      if (!alive) return;

      const mapRows = (rows) => (rows || []).map((row) => ({
        key: String(row.id ?? row.key ?? Math.random()),
        fen: row.fen,
        turnText: row.turnText || row.turn || 'White to play',
        text: row.text || 'Can you solve this puzzle?',
        correctMove: row.correctMove ?? null,
      }));

      if (trendingError) {
        setTRENDINGBOARDS(FALLBACK_TRENDING);
      } else {
        const tMapped = mapRows(trending);
        setTRENDINGBOARDS(tMapped.length ? tMapped : FALLBACK_TRENDING);
      }

      if (practiceError) {
        setPRACTICEBOARDS(FALLBACK_PRACTICE);
      } else {
        const pMapped = mapRows(practice);
        setPRACTICEBOARDS(pMapped.length ? pMapped : FALLBACK_PRACTICE);
      }
    })();
    return () => { alive = false; };
  }, []);

  return (
    <View style={styles.container}>
      {mode === 'Trending' ? (
        <TwoBoardPager boards={TRENDINGBOARDS} />
      ) : (
        // Add other mode components here
        <TwoBoardPager boards={PRACTICEBOARDS} />
      )}
    </View>
  );
}

// styles generated via hook
