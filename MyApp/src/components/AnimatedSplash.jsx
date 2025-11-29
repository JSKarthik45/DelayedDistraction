import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { lightTheme } from '../theme';

// Simple chess-themed animation: a fading + scaling knight glyph and sliding board rows.
export default function AnimatedSplash({ onFinish, duration = 1800 }) {
  const scale = useRef(new Animated.Value(0.4)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const barTranslate = useRef(new Animated.Value(-60)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scale, { toValue: 1, duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 600, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(barTranslate, { toValue: 0, duration: 800, easing: Easing.out(Easing.cubic), useNativeDriver: true })
    ]).start(() => {
      // Hold briefly then fade out
      Animated.timing(opacity, { toValue: 0, duration: 500, delay: 400, useNativeDriver: true }).start(() => {
        onFinish?.();
      });
    });
  }, [onFinish, scale, opacity, barTranslate]);

  const bars = [0,1,2,3];
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoWrap, { transform: [{ scale }], opacity }]}>        
        <Text style={styles.knight}>♞</Text>
        <Text style={styles.title}>Delay Distractions</Text>
      </Animated.View>
      <View style={styles.board}>
        {bars.map(i => (
          <Animated.View
            key={i}
            style={[styles.boardRow, {
              transform: [{ translateX: barTranslate }],
              opacity: opacity.interpolate({ inputRange: [0,1], outputRange: [0,0.25] })
            }]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: lightTheme.colors.background, alignItems: 'center', justifyContent: 'center' },
  logoWrap: { alignItems: 'center', justifyContent: 'center' },
  knight: { fontSize: 72, color: lightTheme.colors.primary },
  title: { marginTop: 12, fontSize: 24, fontWeight: '600', color: lightTheme.colors.text },
  board: { position: 'absolute', bottom: 80, width: '70%' },
  boardRow: { height: 10, borderRadius: 5, backgroundColor: lightTheme.colors.primary, marginVertical: 6 },
});
