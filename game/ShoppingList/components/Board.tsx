import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PaperClip from '../icon/PaperClip';
import { FOOD_LIST } from '../constant/gameConstant';

interface BoardProps {
  items: number[];
}

const Board = ({ items }: BoardProps) => {
  return (
    <View
      style={[styles.container,
      {
        width: items.length > 4 ? 250 : 200,
        height: items.length > 4 ? 200 : 150,
      }]}
    >
      <PaperClip style={styles.paperclip} />
      <View style={styles.foodItemsContainer}>
        {items && items.map((item) => (
          <Text key={item} style={styles.foodItem}>
            {FOOD_LIST[item]}
          </Text>
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
