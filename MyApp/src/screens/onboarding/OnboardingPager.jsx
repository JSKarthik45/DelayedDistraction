import React, { useRef, useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, ScrollView } from 'react-native';
import CircleButton from '../../components/CircleButton';
import { OnboardingContext } from '../../navigation/OnboardingContext';
import { lightTheme } from '../../theme';
import SettingsQuickSetup from '../../components/SettingsQuickSetup';
import { loadPreferences, savePreferences } from '../../storage/preferences';

const { width } = Dimensions.get('window');

const PAGES = [
  { key: 'problem' },
  { key: 'solution' },
  { key: 'setup' },
  { key: 'motivation' },
];

export default function OnboardingPager() {
  const listRef = useRef(null);
  const [index, setIndex] = useState(0);
  const { completeOnboarding } = useContext(OnboardingContext);
  const [blocked, setBlocked] = useState({});
  const [problemTarget, setProblemTarget] = useState(5);

  useEffect(() => {
    (async () => {
      const pref = await loadPreferences();
      setBlocked(pref.blocked || {});
      setProblemTarget(pref.problemTarget ?? 5);
    })();
  }, []);

  const goNext = async () => {
    const next = index + 1;
    if (PAGES[index]?.key === 'setup') {
      await savePreferences({ blocked, problemTarget });
    }
    if (next < PAGES.length) {
      setIndex(next);
      listRef.current?.scrollToIndex({ index: next, animated: true });
    } else {
      await completeOnboarding();
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={PAGES}
        keyExtractor={(item) => item.key}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
          setIndex(newIndex);
        }}
        renderItem={({ item }) => {
          if (item.key === 'problem') {
            return (
              <View style={[styles.page, { width, backgroundColor: lightTheme.colors.background }]}> 
                <Text style={[styles.title, { color: lightTheme.colors.text }]}>Distracted by endless scrolling?</Text>
                <Text style={[styles.subtitle, { color: lightTheme.colors.muted }]}>Social apps grab your attention and drain hours every day, breaking your focus and delaying your goals.</Text>
              </View>
            );
          }
          if (item.key === 'solution') {
            return (
              <View style={[styles.page, { width, backgroundColor: lightTheme.colors.background }]}> 
                <Text style={[styles.title, { color: lightTheme.colors.text }]}>Turn distractions into progress</Text>
                <Text style={[styles.subtitle, { color: lightTheme.colors.muted }]}>Block selected apps until you complete a set of chess puzzles. Build focus, sharpen thinking, and earn back your time.</Text>
              </View>
            );
          }
          if (item.key === 'setup') {
            return (
              <ScrollView style={{ width }} contentContainerStyle={[styles.page, { alignItems: 'stretch' }]}> 
                <Text style={[styles.title, { color: lightTheme.colors.text, textAlign: 'center' }]}>Quick setup</Text>
                <Text style={[styles.subtitle, { color: lightTheme.colors.muted, textAlign: 'center', marginBottom: 16 }]}>Choose which apps to block and how many puzzles to solve.</Text>
                <SettingsQuickSetup
                  blocked={blocked}
                  setBlocked={setBlocked}
                  problemTarget={problemTarget}
                  setProblemTarget={setProblemTarget}
                />
              </ScrollView>
            );
          }
          // motivation
          return (
            <View style={[styles.page, { width, backgroundColor: lightTheme.colors.background }]}> 
              <Text style={[styles.title, { color: lightTheme.colors.text }]}>Rewire your brain and habits</Text>
              <Text style={[styles.subtitle, { color: lightTheme.colors.muted }]}>Crush puzzles. Unblock apps. Repeat. Watch your discipline grow, your habits change, and your time return to you.</Text>
            </View>
          );
        }}
      />

      <View style={styles.dots}>
        {PAGES.map((p, i) => (
          <View key={p.key} style={[styles.dot, { backgroundColor: i === index ? lightTheme.colors.primary : lightTheme.colors.border }]} />
        ))}
      </View>

      <CircleButton
        onPress={goNext}
        icon={index === PAGES.length - 1 ? 'checkmark' : 'arrow-forward'}
        backgroundColor={index === PAGES.length - 1 ? lightTheme.colors.primary : lightTheme.colors.primary}
        style={styles.fab}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: { fontSize: 28, fontWeight: '700', textAlign: 'center' },
  subtitle: { marginTop: 10, textAlign: 'center' },
  dots: {
    position: 'absolute',
    bottom: 96,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
  },
});
