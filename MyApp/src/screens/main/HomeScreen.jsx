import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemeColors, useThemedStyles } from '../../theme/ThemeContext';
import BoardPager from '../../components/BoardPager';
import { trendingPuzzles, practicePuzzles } from '../../data/puzzles';
import { refreshPuzzles } from '../../data/puzzles';

const styleFactory = (colors) => StyleSheet.create({
  container: { flex: 1, alignItems: 'stretch', justifyContent: 'center', paddingHorizontal: 0, paddingVertical: 0, backgroundColor: colors.background },
});

export default function HomeScreen({ mode = 'Trending' }) {
  const colors = useThemeColors();
  const styles = useThemedStyles(styleFactory);
  const TRENDINGBOARDS = trendingPuzzles;
  const PRACTICEBOARDS = practicePuzzles;
  React.useEffect(() => {
    refreshPuzzles();
  }, []);

  return (
    <View style={styles.container}>
      {mode === 'Trending' ? (
        <BoardPager boards={TRENDINGBOARDS} transitionMode="preload" tableName="TrendingPuzzles" />
      ) : (
        // Add other mode components here
        <BoardPager boards={PRACTICEBOARDS} transitionMode="preload" tableName="PracticePuzzles" />
      )}
    </View>
  );
}

// styles generated via hook
