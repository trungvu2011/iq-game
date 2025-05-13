import { View, Text, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SCORE_CONFIG } from '../constant/index';
import CorrectIcon from '../../../assets/icons/CorrectIcon';
import WrongIcon from '../../../assets/icons/WrongIcon';
import Shelf from './Shelf';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';

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
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  // Animation cho việc biến mất khi hết lượt
  useEffect(() => {
    if (remainingAttempts <= 0) {
      const delay = 1000;
      opacity.value = withDelay(delay, withTiming(0, { duration: 300 }));
    }
  }, [remainingAttempts]);

  const dissappearStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  // Animation cho Icon kết quả xuất hiện từ từ
  const resultOpacity = useSharedValue(0);
  const resultScale = useSharedValue(0.5);

  useEffect(() => {
    if (remainingAttempts === 0) {
      resultOpacity.value = withTiming(1, { duration: 500 });
      resultScale.value = withTiming(1, { duration: 400 });
    }
  }, [remainingAttempts]);

  const appearStyle = useAnimatedStyle(() => ({
    opacity: resultOpacity.value,
    transform: [{ scale: resultScale.value }],
  }));

  return (
    <Animated.View style={[styles.container, dissappearStyle]}>
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
        <Animated.View style={[styles.resultContainer, appearStyle]}>
          {allCorrect && <CorrectIcon width={65} height={65} />}
          {hasIncorrect && <WrongIcon width={65} height={65} />}
        </Animated.View>
      )}
    </Animated.View>
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
  resultContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
});

export default Shelves;
