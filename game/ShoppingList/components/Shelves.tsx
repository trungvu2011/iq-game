import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, use } from 'react';
import { FOOD_LIST, SCORE_CONFIG } from '../constant/gameConstant';
import Svg, { Polygon, Rect } from 'react-native-svg';
import CorrectIcon from '../../../assets/icons/CorrectIcon';
import WrongIcon from '../../../assets/icons/WrongIcon';

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

interface ShelvesfProps {
  items: number[];
  correctItems?: number[];
  score?: number;
  setScore?: React.Dispatch<React.SetStateAction<number>>;
  indexQuestionRef?: React.MutableRefObject<number>;
  onItemPress?: (item: number, isCorrect: boolean) => void;
  onAnswer?: (isCorrect: boolean) => void;
  onHasSelectedRef?: React.MutableRefObject<() => boolean>;
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
  // Xác định xem một item có phải là item đúng hay không
  const isCorrectItem = (item: number) => correctItems.includes(item);

  const handlePress = (index: number) => () => {
    // Kiểm tra xem còn lượt ấn hay không
    if (remainingAttempts <= 0) {
      return;
    }

    // Tạo key duy nhất cho item này
    const itemKey = `${shelfIndex}-${index}`;

    // Kiểm tra xem item đã được chọn chưa
    if (selectedItems[itemKey]) {
      return;
    }

    const item = items[index];
    const isCorrect = isCorrectItem(item);

    // Giảm số lần ấn còn lại
    setRemainingAttempts(remainingAttempts - 1);

    // Cập nhật state
    setSelectedItems({
      ...selectedItems,
      [itemKey]: true
    });

    // Thông báo cho component cha biết item đã được chọn
    if (onItemPress) {
      onItemPress(item, isCorrect);
    }

    console.log(`Item ${FOOD_LIST[item]} pressed (${isCorrect ? 'correct' : 'incorrect'}), Attempts left: ${remainingAttempts - 1}`);
  };

  // Xác định màu sắc cho item dựa vào trạng thái và tính chính xác
  const getItemColor = (index: number) => {
    const itemKey = `${shelfIndex}-${index}`;

    if (!selectedItems[itemKey]) {
      return 'transparent'; // Nền trong suốt khi chưa được chọn
    }

    const item = items[index];
    return isCorrectItem(item)
      ? { polygon: '#49c73f', rect: '#67e559' }  // Màu xanh cho đáp án đúng
      : { polygon: '#f45152', rect: '#fc6766' };  // Màu đỏ cho đáp án sai
  };

  return (
    <View style={styles.shelfWrapper}>
      {/* Các item nằm trên kệ */}
      <View style={styles.itemContainer}>
        {items.map((item, index) => {
          const itemKey = `${shelfIndex}-${index}`;
          const itemColor = getItemColor(index);
          return (
            <TouchableOpacity
              key={index}
              style={styles.itemWrapper}
              onPress={handlePress(index)}
              disabled={selectedItems[itemKey] || remainingAttempts <= 0} // Vô hiệu hóa khi đã chọn hoặc hết lượt
            >
              {/* Polygon làm nền cho item */}
              <Svg height="80" width="120" style={styles.itemPolygon}>
                <Polygon
                  points="15,35 65,35 80,65 0,65"
                  fill={typeof itemColor === 'string' ? itemColor : itemColor.polygon}
                />
                <Rect
                  x="0" y="65" width="80" height="8"
                  fill={typeof itemColor === 'string' ? itemColor : itemColor.rect}
                />
              </Svg>
              <Text style={styles.foodItem}>{FOOD_LIST[item]}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Kệ 2.5D */}
      <Svg height="50" width="400" style={styles.shelf}>
        <Polygon points="60,0 340,0 360,30 40,30" fill="#4e8991" />
        <Rect x="40" y="30" width="320" height="8" fill="#67a2aa" />
      </Svg>
    </View>
  );
};

const Shelves = ({ items, correctItems = [], score, setScore, indexQuestionRef, onItemPress, onAnswer, onHasSelectedRef }: ShelvesfProps) => {
  // State để lưu số lần ấn còn lại
  const [remainingAttempts, setRemainingAttempts] = useState(correctItems.length);

  // State để lưu trạng thái đã chọn của tất cả các item, được chuyển từ component con lên
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: boolean }>({});

  // State để lưu trữ các lựa chọn đúng/sai của người chơi
  const [chosenItems, setChosenItems] = useState<{ item: number, isCorrect: boolean }[]>([]);

  // Cung cấp hàm kiểm tra cho component cha qua ref
  React.useEffect(() => {
    if (onHasSelectedRef) {
      onHasSelectedRef.current = () => Object.keys(selectedItems).length > 0;
    }
  }, [selectedItems, onHasSelectedRef]);

  // Xử lý sự kiện khi người dùng chọn một item
  const handleItemPress = (item: number, isCorrect: boolean) => {
    // Thêm vào danh sách các item đã chọn
    setChosenItems(prev => [...prev, { item, isCorrect }]);

    if (isCorrect) {
      // Nếu item đúng, tăng điểm số
      if (setScore && indexQuestionRef) {
        setScore(prevScore => prevScore + SCORE_CONFIG[indexQuestionRef.current]);
      }
    }

    // Gọi callback từ parent nếu có
    if (onItemPress) {
      onItemPress(item, isCorrect);
    }
  };

  // Kiểm tra xem người chơi đã trả lời đúng hết chưa
  const allCorrect = chosenItems.length > 0 && remainingAttempts === 0 && chosenItems.every(item => item.isCorrect);

  // Kiểm tra xem người chơi đã trả lời sai ít nhất một câu chưa
  const hasIncorrect = chosenItems.length > 0 && remainingAttempts === 0 && chosenItems.some(item => !item.isCorrect);

  // Xác định số items trên mỗi kệ dựa vào tổng số items
  const itemsPerShelf = items.length <= 6 ? 2 : 3;

  // Tạo shelves từ items với số lượng items trên mỗi kệ được xác định động
  const shelves = items.reduce((acc, item, index) => {
    const shelfIndex = Math.floor(index / itemsPerShelf);
    if (!acc[shelfIndex]) {
      acc[shelfIndex] = [];
    }
    acc[shelfIndex].push(item);
    return acc;
  }, [] as number[][]);

  useEffect(() => {
    // Khi component được mount, nếu có items thì setRemainingAttempts
    if (remainingAttempts === 0 && onAnswer) {
      // Add a delay before calling onAnswer so user can see the results
      setTimeout(() => {
        onAnswer(allCorrect);
      }, 1500);
    }
  }, [remainingAttempts, allCorrect, onAnswer]);

  return (
    <View style={styles.container}>
      {Object.keys(selectedItems).length === 0
        ? <Text style={styles.listText}>Tap the items you remember</Text>
        : remainingAttempts > 0
          ? <Text style={styles.listText}>{remainingAttempts} items left</Text>
          : <Text style={[styles.listText, { backgroundColor: 'transparent' }]}></Text>
      }

      {shelves.map((shelfItems, index) => (
        <Shelf
          key={index}
          shelfIndex={index}
          items={shelfItems}
          correctItems={correctItems}
          onItemPress={handleItemPress}
          remainingAttempts={remainingAttempts}
          setRemainingAttempts={setRemainingAttempts}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
        />
      ))}

      {/* Hiển thị icon kết quả khi đã hết lượt chọn */}
      {remainingAttempts === 0 && (
        <View style={styles.resultContainer}>
          {allCorrect && <CorrectIcon width={65} height={65} />}
          {hasIncorrect && <WrongIcon width={65} height={65} />}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listText: {
    fontSize: 16,
    color: '#fff',
    backgroundColor: '#00000050',
    width: '80%',
    textAlign: 'center',
    marginBottom: 30,
    borderRadius: 5,
    paddingVertical: 2,
    paddingHorizontal: 10,
  },
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
    width: 80,
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
  resultContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
});

export default Shelves;
