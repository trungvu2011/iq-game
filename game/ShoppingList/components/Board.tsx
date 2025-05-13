import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import PaperClip from '../icon/PaperClip';
import { FOOD_LIST } from '../constant';

interface BoardProps {
  items: number[];
}

interface AnimatedItemProps {
  item: number;
  index: number;
}

const AnimatedItem = ({ item, index }: AnimatedItemProps) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withDelay(index * 150, withTiming(1, { duration: 200 }));
    scale.value = withDelay(index * 150, withTiming(1, { duration: 200 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[animatedStyle]}>
      <Text style={styles.foodItem}>{FOOD_LIST[item]}</Text>
    </Animated.View>
  );
};

const Board = ({ items }: BoardProps) => {
  return (
    <View
      style={[
        styles.container,
        {
          width: items.length > 4 ? 250 : 200,
          height: items.length > 4 ? 200 : 150,
        },
      ]}
    >
      <PaperClip style={styles.paperclip} />
      <View style={styles.foodItemsContainer}>
        {items.map((item, index) => (
          <AnimatedItem key={`${item}-${index}`} item={item} index={index} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 250,
    height: 200,
    backgroundColor: '#f6f1e7',
    borderRadius: 12,
    padding: 16,
    position: 'relative',
    margin: 30,
  },
  paperclip: {
    position: 'absolute',
    width: 30,
    height: 30,
    top: -10,
    left: 10,
    fontSize: 24,
  },
  foodItemsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  foodItem: {
    fontSize: 40,
    color: '#000',
    padding: 6,
    borderRadius: 8,
    margin: 4,
    textAlign: 'center',
    flexShrink: 1,
  },
});

export default Board;
