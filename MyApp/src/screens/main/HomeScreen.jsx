import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemeColors, useThemedStyles } from '../../theme/ThemeContext';
import TwoBoardPager from '../../components/TwoBoardPager';

const styleFactory = (colors) => StyleSheet.create({
  container: { flex: 1, alignItems: 'stretch', justifyContent: 'center', paddingHorizontal: 0, paddingVertical: 0, backgroundColor: colors.background },
});

export default function HomeScreen({ mode = 'Trending' }) {
  const colors = useThemeColors();
  const styles = useThemedStyles(styleFactory);
  const TRENDINGBOARDS = useMemo(() => ([
    { key: 'p1', fen: 'rnb1kbnr/pppp1ppp/8/4P3/6Pq/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1', turnText: 'White to play', text: "Can you solve this puzzle?", correctMove: 'Qh5#' },
    { key: 'p2', fen: 'r1bqkb1r/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 4', turnText: 'White to play', text: "Find the winning move!", correctMove: 'Bxf7#' },
    { key: 'p3', fen: 'rnbqkbnr/pppp1ppp/8/4p3/5PP1/8/PPPPP1PP/RNBQKBNR w KQkq - 0 3', turnText: 'White to play', text: "What's the best strategy here?", correctMove: 'Nf3' },
    { key: 'p4', fen: 'rnb1kbnr/pppp1ppp/8/1B2p3/4P3/8/PPPP1PPP/RNBQK1NR w KQkq - 2 4', turnText: 'White to play', text: "Can you checkmate in two?", correctMove: 'Bd3#' },
    { key: 'p5', fen: 'rnbqkbnr/pppp1pPp/8/4p3/6P1/8/PPPPP1PP/RNBQKBNR b KQkq f3 0 3', turnText: 'Black to play', text: "What's your next move?", correctMove: 'Qxf2#' },
    { key: 'p6', fen: 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPPQPPP/RNB1KBNR w KQkq - 3 4', turnText: 'White to play', text: "Find the tactical advantage!", correctMove: 'Qxf7#' },
    { key: 'p7', fen: 'rnbqk2r/pppp1ppp/5n2/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4', turnText: 'White to play', text: "Can you gain material here?", correctMove: 'Bxf7#' },
    { key: 'p8', fen: 'r1bqkb1r/ppppnppp/5n2/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 5 5', turnText: 'White to play', text: "What's the best continuation?", correctMove: 'Nxf7#' },
  ]));

  const PRACTICEBOARDS = useMemo(() => ([
    { key: 'p1', fen: 'rnbqkbnr/pppp1ppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', turnText: 'White to play', text: "Start from the beginning!", correctMove: 'e4' },
    { key: 'p2', fen: '8/8/8/3Q4/8/8/5PPP/4K3 b - - 0 1', turnText: 'Black to play', text: "Can you avoid checkmate?", correctMove: 'Qxf2#' },
    { key: 'p3', fen: 'rnbqkbnr/pppp1ppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 2', turnText: 'Black to play', text: "What's your response to e4?", correctMove: 'e5' },
    { key: 'p4', fen: 'r1bqk2r/ppp1n2p/2np4/3Pp3/3P4/2NB1N2/PPP2PPP/R2QKB1R w KQkq - 0 9', turnText: 'White to play', text: "Find the winning tactic!", correctMove: 'Nxe5' },
    { key: 'p5', fen: 'rnbqkb1r/ppp2ppp/3p1n2/3Pp3/2B1P3/2NP4/PPP2PPP/R1BQKBNR b KQkq d3 0 7', turnText: 'Black to play', text: "What's your best move?", correctMove: 'Nxd3+' },
    { key: 'p6', fen: 'r1bq1rk1/pppn1ppp/4pn2/3pP3/1PP1p3/P1NP1N2/2P2PPP/R1BQ1RK1 w - - 0 12', turnText: 'White to play', text: "Can you create a fork?", correctMove: 'Rxe7' },
    { key: 'p7', fen: 'r2q1rk1/ppp1nppp/2np4/1b1pP3/2B1P3/P1NP4/1PP2PPP/R2Q1RK1 w - - 0 11', turnText: 'White to play', text: "Find the checkmate sequence!", correctMove: 'Nxe5' },
    { key: 'p8', fen: 'r1bq1r1k/ppp2pbp/2np3n/3Pp3/2P1P3/P1N1BN2/1P3PPP/R2Q1RK1 w - - 0 13', turnText: 'White to play', text: "What's your next move?", correctMove: 'Bxh6' },
  ]));
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
