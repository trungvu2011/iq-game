import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import React, { useEffect } from 'react';
import { FOOD_LIST } from '../constant/index';
import Svg, { Polygon, Rect } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';

interface ShelfProps {
  shelfIndex: number;
  items: number[];
  correctItems: number[];
  onItemPress?: (item: number, isCorrect: boolean) => void;
  remainingAttempts: number;
  setRemainingAttempts: (value: number) => void;
  selectedItems: { [key: string]: boolean };
  setSelectedItems: (newState: { [key: string]: boolean }) => void;
}

const Shelf = ({
  shelfIndex,
  items,
  correctItems,
  onItemPress,
  remainingAttempts,
  setRemainingAttempts,
  selectedItems,
  setSelectedItems
}: ShelfProps) => {
  const isCorrectItem = (item: number) => correctItems.includes(item);

  const handlePress = (index: number) => () => {
    if (remainingAttempts <= 0) return;

    const itemKey = `${shelfIndex}-${index}`;
    if (selectedItems[itemKey]) return;

    const item = items[index];
    const isCorrect = isCorrectItem(item);

    setRemainingAttempts(remainingAttempts - 1);

    setSelectedItems({
      ...selectedItems,
      [itemKey]: true,
    });

    onItemPress?.(item, isCorrect);
  };
  const getItemColor = (index: number) => {
    const itemKey = `${shelfIndex}-${index}`;
    const item = items[index];

    // Nếu item chưa được chọn
    if (!selectedItems[itemKey]) {
      // Nếu hết lượt và item là đáp án đúng, hiển thị màu xanh dương nhạt
      if (remainingAttempts <= 0 && isCorrectItem(item)) {
        return { polygon: '#53c3d7', rect: '#77dbeb' };
      }
      return 'transparent';
    }

    // Nếu item đã được chọn, hiển thị màu xanh lá (đúng) hoặc đỏ (sai)
    return isCorrectItem(item)
      ? { polygon: '#49c73f', rect: '#67e559' }
      : { polygon: '#f45152', rect: '#fc6766' };
  };

  // Reanimated scale for press feedback
  const scaleText = items.map(() => useSharedValue(1));
  const textScaleStyles = scaleText.map(scale =>
    useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }))
  );

  const handlePressIn = (index: number) => () => {
    scaleText[index].value = withTiming(0.7, { duration: 100 });
  };

  const handlePressOut = (index: number) => () => {
    scaleText[index].value = withTiming(1, { duration: 100 });
  };

  // Appear animations
  const appearStyles = items.map((_, index) => {
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.7);

    useEffect(() => {
      const delay = 150 * index * shelfIndex;
      opacity.value = withDelay(delay, withTiming(1, { duration: 300 }));
      scale.value = withDelay(delay, withTiming(1, { duration: 300 }));
    }, []);

    return useAnimatedStyle(() => ({
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    }));
  });

  return (
    <View style={styles.shelfWrapper}>
      <View style={styles.itemContainer}>
        {items.map((item, index) => {
          const itemKey = `${shelfIndex}-${index}`;
          const itemColor = getItemColor(index);
          const isWide = items.length === 2;

          return (
            <TouchableOpacity
              key={index}
              activeOpacity={1}
              onPressIn={handlePressIn(index)}
              onPressOut={handlePressOut(index)}
              onPress={handlePress(index)}
              disabled={selectedItems[itemKey] || remainingAttempts <= 0}
              style={[
                styles.itemWrapper,
                isWide ? { width: 120 } : { width: 80 },
              ]}
            >
              <Svg height="100" width="120" style={styles.itemPolygon}>
                {isWide ? (
                  <>
                    <Polygon
                      points="20,25 95,25 115,75 5,75"
                      fill={typeof itemColor === 'string' ? itemColor : itemColor.polygon}
                    />
                    <Rect
                      x="5"
                      y="75"
                      width="110"
                      height="10"
                      fill={typeof itemColor === 'string' ? itemColor : itemColor.rect}
                    />
                  </>
                ) : (
                  <>
                    <Polygon
                      points="15,35 65,35 80,65 0,65"
                      fill={typeof itemColor === 'string' ? itemColor : itemColor.polygon}
                    />
                    <Rect
                      x="0"
                      y="65"
                      width="80"
                      height="8"
                      fill={typeof itemColor === 'string' ? itemColor : itemColor.rect}
                    />
                  </>
                )}
              </Svg>
              <Animated.Text
                style={[
                  isWide ? styles.foodItem2 : styles.foodItem,
                  textScaleStyles[index],
                  appearStyles[index],
                ]}
              >
                {FOOD_LIST[item]}
              </Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Shelf Board */}
      {items.length > 2 ? (
        <Svg height="50" width="400" style={styles.shelf}>
          <Polygon points="60,0 340,0 360,30 40,30" fill="#4e8991" />
          <Rect x="40" y="30" width="320" height="8" fill="#67a2aa" />
        </Svg>
      ) : (
        <Svg height="60" width="400" style={styles.shelf}>
          <Polygon points="60,0 340,0 360,50 40,50" fill="#4e8991" />
          <Rect x="40" y="50" width="320" height="10" fill="#67a2aa" />
        </Svg>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  shelfWrapper: {
    width: '100%',
    height: 50,
    alignItems: 'center',
    marginVertical: 30,
    position: 'relative',
  },
  shelf: {
    position: 'absolute',
    bottom: 0,
  },
  itemContainer: {
    position: 'absolute',
    bottom: 25,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  itemWrapper: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    position: 'relative',
  },
  itemPolygon: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  foodItem: {
    fontSize: 40,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    zIndex: 2,
  },
  foodItem2: {
    height: 90,
    fontSize: 60,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    zIndex: 2,
  },
});

export default Shelf;
