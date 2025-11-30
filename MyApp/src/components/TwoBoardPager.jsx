import React, { useMemo, useRef, useCallback, useState, memo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, FlatList, Dimensions } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useHeaderHeight } from '@react-navigation/elements';
import BoardPanel from './BoardPanel';

export default function TwoBoardPager({ boards }) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight() / 4;
  const headerHeight = useHeaderHeight() / 4;
  const { height: windowHeight } = Dimensions.get('window');
  const pageHeight = Math.max(1, windowHeight - insets.top - insets.bottom - tabBarHeight - headerHeight);
  const listRef = useRef(null);

  const data = useMemo(() => boards?.slice(0, 10) || [], [boards]);
  const [index, setIndex] = useState(0);

  const advance = useCallback(() => {
    const next = index + 1;
    if (next < data.length) {
      setIndex(next);
      listRef.current?.scrollToOffset({ offset: pageHeight * next, animated: true });
    }
  }, [index, data.length, pageHeight]);

  const PageItem = memo(function PageItem({ item, height, onAdvance }) {
    return (
      <View style={{ height, overflow: 'hidden' }}>
        <BoardPanel
          fen={item.fen}
          turnText={item.turnText}
          borderRadius={10}
          heightFraction={1}
          text={item.text}
          correctMove={item.correctMove}
          onAdvance={onAdvance}
        />
      </View>
    );
  });

  const keyExtractor = useCallback((item) => item.key, []);
  const renderItem = useCallback(({ item }) => (
    <PageItem item={item} height={pageHeight} onAdvance={advance} />
  ), [pageHeight, advance]);
  const getItemLayout = useCallback((_, index) => ({ length: pageHeight, offset: pageHeight * index, index }), [pageHeight]);

  const onScrollEnd = useCallback((e) => {
    const y = e.nativeEvent.contentOffset.y;
    const newIndex = Math.round(y / pageHeight);
    if (newIndex !== index) setIndex(newIndex);
  }, [index, pageHeight]);

  return (
    <FlatList
      ref={listRef}
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      pagingEnabled
      decelerationRate="fast"
      snapToInterval={pageHeight}
      snapToAlignment="start"
      disableIntervalMomentum
      removeClippedSubviews
      initialNumToRender={2}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={16}
      windowSize={2}
      showsVerticalScrollIndicator={false}
      bounces={false}
      onMomentumScrollEnd={onScrollEnd}
    />
  );
}
