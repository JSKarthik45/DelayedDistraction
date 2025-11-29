import React, { useRef, useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import CircleButton from '../../components/CircleButton';
import { OnboardingContext } from '../../navigation/OnboardingContext';
import { lightTheme } from '../../theme';

const { width } = Dimensions.get('window');

const PAGES = [
  {
    key: 'welcome',
    title: 'Welcome',
    subtitle: 'Onboarding starts here.',
  },
  {
    key: 'features',
    title: 'Features',
    subtitle: 'Quick tour of what the app can do.',
  },
  {
    key: 'permissions',
    title: 'Permissions',
    subtitle: 'Explain required app permissions here.',
  },
];

export default function OnboardingPager() {
  const listRef = useRef(null);
  const [index, setIndex] = useState(0);
  const { completeOnboarding } = useContext(OnboardingContext);

  const goNext = async () => {
    const next = index + 1;
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
        renderItem={({ item }) => (
          <View style={[styles.page, { width, backgroundColor: lightTheme.colors.background }]}> 
            <Text style={[styles.title, { color: lightTheme.colors.text }]}>{item.title}</Text>
            <Text style={[styles.subtitle, { color: lightTheme.colors.muted }]}>{item.subtitle}</Text>
          </View>
        )}
      />

      <View style={styles.dots}>
        {PAGES.map((p, i) => (
          <View key={p.key} style={[styles.dot, { backgroundColor: i === index ? lightTheme.colors.primary : lightTheme.colors.border }]} />
        ))}
      </View>

      <CircleButton
        onPress={goNext}
        icon={index === PAGES.length - 1 ? 'checkmark' : 'arrow-forward'}
        backgroundColor={index === PAGES.length - 1 ? lightTheme.colors.secondary : lightTheme.colors.primary}
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
  title: { fontSize: 28, fontWeight: '700' },
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
