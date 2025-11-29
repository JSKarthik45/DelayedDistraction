import React from 'react';
import { View, StyleSheet } from 'react-native';
import { darkTheme } from '../../theme';
import BoardPanel from '../../components/BoardPanel';

export default function HomeScreen({ mode = 'Trending' }) {
  const trendingFen = 'rn1qkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2';
  const practiceFen = 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w - - 0 3';
  return (
    <View style={styles.container}>
      {mode === 'Trending' ? (
      <BoardPanel fen={trendingFen} turnText="Black to play" borderRadius={10} heightFraction={1} />
      ) : (
      <BoardPanel fen={practiceFen} turnText="White to play" borderRadius={10} heightFraction={1} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'stretch', justifyContent: 'center', paddingHorizontal: 0, paddingVertical: 0, backgroundColor: darkTheme.colors.background },
  title: { fontSize: 24, fontWeight: '600' },
  subtitle: { marginTop: 8 },
  boardWrap: { },
  actionsRight: {},
  actionBtn: {},
  leftTextWrap: {},
  sideText: {},
});
