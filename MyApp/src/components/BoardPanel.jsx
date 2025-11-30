import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, Animated, Easing } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useHeaderHeight } from '@react-navigation/elements';
import ChessBoard from './ChessBoard';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../theme/ThemeContext';

/**
 * BoardPanel
 * Combines a ChessBoard with overlay action buttons (like/share) and turn text.
 * Props:
 *  - fen: FEN string ("start" or custom)
 *  - turnText: string displayed bottom-left (default: 'White to play')
 *  - borderRadius: number for board rounding
 *  - initialLiked / initialShared: booleans
 *  - onLikeChange / onShareChange: callbacks receiving new state
 */
const styleFactory = (colors) => StyleSheet.create({
  root: { flex: 1 },
  boardCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  actionsRight: { position: 'absolute', right: 16, alignItems: 'center' },
  actionBtn: {},
  leftTextWrap: { position: 'absolute', left: 16, alignItems: 'flex-start' },
  sideText: { fontSize: 25, fontWeight: '700', color: colors.text },
  iconOnlyBtn: { alignItems: 'center', justifyContent: 'center' },
  filledIcon: {},
  bigHeartOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerOverlay: {
    position: 'absolute',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  bannerText: { fontSize: 18, fontWeight: '600', color: colors.text, textAlign: 'center' },
});

export default function BoardPanel({
  fen = 'start',
  turnText = 'White to play',
  borderRadius = 10,
  initialLiked = false,
  initialShared = false,
  onLikeChange,
  onShareChange,
  heightFraction = 1,
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [shared, setShared] = useState(initialShared);
  const lastLikeTap = useRef(0);
  const tabBarHeight = useBottomTabBarHeight();
  const overlayBottom = tabBarHeight / 4; // minimal gap just above bottom navbar
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const headerHeight = useHeaderHeight();
  const availableHeight = windowHeight - headerHeight - tabBarHeight; // space between navbars
  const targetHeight = Math.max(0, (availableHeight - 16) * heightFraction);
  const boardSize = Math.min(windowWidth, targetHeight);
  const boardTop = (availableHeight - boardSize) / 2; // centered board top within root
  const bannerWidth = boardSize - 24;
  const bannerEstimatedHeight = 40; // approx banner height
  const bannerTop = Math.max(boardTop - bannerEstimatedHeight - 6, 0);

  // Big heart animation overlay
  const bigHeartScale = useRef(new Animated.Value(0)).current;
  const bigHeartOpacity = useRef(new Animated.Value(0)).current;
  const [showBigHeart, setShowBigHeart] = useState(false);

  const triggerBigHeart = () => {
    setShowBigHeart(true);
    bigHeartScale.setValue(0.3);
    bigHeartOpacity.setValue(0.9);
    Animated.sequence([
      Animated.timing(bigHeartScale, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(bigHeartOpacity, {
        toValue: 0,
        duration: 800,
        delay: 800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => setShowBigHeart(false));
  };

  const handleLikePress = () => {
    const now = Date.now();
    if (now - lastLikeTap.current < 300) {
      setLiked(true);
      onLikeChange && onLikeChange(true);
      triggerBigHeart();
    } else {
      setLiked(prev => {
        const next = !prev;
        onLikeChange && onLikeChange(next);
        if (next) triggerBigHeart();
        return next;
      });
    }
    lastLikeTap.current = now;
  };

  const handleSharePress = () => {
    setShared(prev => {
      const next = !prev;
      onShareChange && onShareChange(next);
      return next;
    });
  };

  const colors = useThemeColors();
  const styles = useThemedStyles(styleFactory);

  return (
    <View style={styles.root}>
      <View style={styles.boardCenter}>
        <ChessBoard
          fen={fen}
          size={boardSize}
          borderRadius={borderRadius}
        />
      </View>
      <View style={[styles.bannerOverlay, { top: bannerTop, width: bannerWidth, left: (windowWidth - bannerWidth) / 2 }]}>
        <Text style={styles.bannerText}>Can you solve this puzzle?</Text>
      </View>
      <View style={[styles.actionsRight, { bottom: overlayBottom }]} pointerEvents="box-none">
        <Pressable onPress={handleLikePress} style={styles.iconOnlyBtn} hitSlop={12}>
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={35}
            color={colors.text}
            style={liked ? styles.filledIcon : null}
          />
        </Pressable>
        <Pressable onPress={handleSharePress} style={[styles.iconOnlyBtn, { marginTop: 16 }]} hitSlop={12}>
          <Ionicons
            name={shared ? 'share' : 'share-outline'}
            size={35}
            color={colors.text}
          />
        </Pressable>
      </View>
      <View style={[styles.leftTextWrap, { bottom: overlayBottom }]} pointerEvents="none">
        <Text style={styles.sideText}>{turnText}</Text>
      </View>
      {showBigHeart && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.bigHeartOverlay,
            {
              opacity: bigHeartOpacity,
              transform: [{ scale: bigHeartScale }],
            },
          ]}
        >
          <Ionicons name="heart" size={120} color={colors.error} />
        </Animated.View>
      )}
    </View>
  );
}
