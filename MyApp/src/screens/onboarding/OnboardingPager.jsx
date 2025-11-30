import React, { useRef, useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CircleButton from '../../components/CircleButton';
import { OnboardingContext } from '../../navigation/OnboardingContext';
import { useThemeColors, useThemedStyles } from '../../theme/ThemeContext';
import SettingsQuickSetup from '../../components/SettingsQuickSetup';
import { loadPreferences, savePreferences } from '../../storage/preferences';

const { width } = Dimensions.get('window');

const PAGES = [
  { key: 'problem' },
  { key: 'solution' },
  { key: 'setup' },
  { key: 'motivation' },
];

const styleFactory = (colors) => StyleSheet.create({
  container: { flex: 1 },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 90,
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
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
  },
});

export default function OnboardingPager() {
  const colors = useThemeColors();
  const styles = useThemedStyles(styleFactory);
  const insets = useSafeAreaInsets();
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
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]} edges={['top','left','right']}> 
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
              <View style={[styles.page, { width, backgroundColor: colors.background }]}> 
                  <Text style={[styles.title, { color: colors.secondary }]}>Distracted by endless scrolling?</Text>
                  <Text style={[styles.subtitle, { color: colors.muted }]}>Social apps grab your attention and drain hours every day, breaking your focus and delaying your goals.</Text>
              </View>
            );
          }
          if (item.key === 'solution') {
            return (
              <View style={[styles.page, { width, backgroundColor: colors.background }]}> 
                  <Text style={[styles.title, { color: colors.secondary }]}>Turn distractions into progress</Text>
                  <Text style={[styles.subtitle, { color: colors.muted }]}>Block selected apps until you complete a set of chess puzzles. Build focus, sharpen thinking, and earn back your time.</Text>
              </View>
            );
          }
          if (item.key === 'setup') {
            return (
              <ScrollView style={{ width }} contentContainerStyle={[styles.page, { alignItems: 'stretch', backgroundColor: colors.background }]}> 
                  <Text style={[styles.title, { color: colors.secondary }]}>Quick setup</Text>
                  {/* <Text style={[styles.subtitle, { color: colors.muted }]}>Choose which apps to block and how many puzzles to solve.</Text> */}
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
            <View style={[styles.page, { width, backgroundColor: colors.background }]}> 
                <Text style={[styles.title, { color: colors.secondary }]}>Rewire your brain and habits</Text>
                <Text style={[styles.subtitle, { color: colors.muted }]}>Crush puzzles. Unblock apps. Repeat. Watch your discipline grow, your habits change, and your time return to you.</Text>
            </View>
          );
        }}
      />

      <View style={[styles.dots, { bottom: insets.bottom + 96 }]}>
        {PAGES.map((p, i) => (
          <View key={p.key} style={[styles.dot, { backgroundColor: i === index ? colors.primary : colors.border }]} />
        ))}
      </View>

      <CircleButton
        onPress={goNext}
        icon={index === PAGES.length - 1 ? 'checkmark' : 'arrow-forward'}
        backgroundColor={colors.primary}
        style={[styles.fab, { bottom: insets.bottom + 24 }]}
      />
    </SafeAreaView>
  );
}
