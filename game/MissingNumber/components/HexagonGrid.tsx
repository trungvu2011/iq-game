import React, { useMemo } from 'react';
import { View, Dimensions, Text } from 'react-native';
import Svg from 'react-native-svg';
import Hexagon from './Hexagon';

interface HexGridProps {
  cols: number;
  rows: number;
  correctAnswer: number;
}

const HexGrid = ({ cols, rows, correctAnswer }: HexGridProps) => {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  // Tỉ lệ co hexagon để tạo khoảng cách giữa các ô
  const paddingRatio = 0.9; // 0.9 = 10% khoảng cách giữa các ô

  const horizontalMargin = 20; // khoảng cách trái/phải
  const verticalMargin = 20;   // bạn cũng có thể thêm nếu cần trên/dưới

  const availableWidth = windowWidth - 2 * horizontalMargin;
  const availableHeight = windowHeight - 2 * verticalMargin;

  const maxHexWidth = availableWidth / ((cols - 1) * 1.5 + 2);
  const maxHexHeight = availableHeight / (rows + 0.5) / Math.sqrt(3);

  const size = Math.min(maxHexWidth, maxHexHeight);
  const actualSize = size * paddingRatio; // hexagon nhỏ hơn để tạo khoảng trống

  const hexWidth = size * 2;
  const hexHeight = Math.sqrt(3) * size;

  const gridWidth = cols * 1.5 * size + size / 2;
  const gridHeight = rows * hexHeight + hexHeight / 2;

  // Tính toán vị trí bắt đầu để căn giữa grid
  const startX = horizontalMargin + (availableWidth - gridWidth) / 2;

  // Tính toán vị trí bắt đầu theo chiều dọc để căn giữa grid
  // Điều chỉnh theo số hàng và cột để grid luôn được căn giữa
  // Sử dụng 40% của chiều cao để tạo không gian cho phần menu bên dưới
  const verticalOffset = windowHeight * 0.25;
  const startY = verticalMargin + (availableHeight - verticalOffset - gridHeight) / 2;

  // Animation delay per hexagon (milliseconds)
  const delayPerHexagon = 60;

  // Use useMemo to generate numbers only once when the component renders with specific props
  const { hexes, listNumber } = useMemo(() => {
    const hexElements = [];
    let placed = 0;
    const numbers = [];

    // Tạo danh sách số từ 1 đến rows * cols, bỏ qua correctAnswer
    let number = 1;
    for (let i = 0; i < rows * cols; i++) {
      if (number === correctAnswer) number++;
      numbers.push(number);
      number++;
    }

    // Shuffle the array using Fisher-Yates algorithm
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]]; // Swap elements
    }

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (placed >= rows * cols) break;

        const x = startX + col * (3 / 2) * size;
        // Tính toán lại vị trí y dựa trên số hàng và cột
        const y = startY + row * hexHeight + (col % 2 === 1 ? hexHeight / 2 : 0);

        // Calculate delay based on position (staggered effect)
        const animationDelay = placed * delayPerHexagon;

        hexElements.push(
          <Hexagon
            number={numbers[placed]}
            key={`${row}-${col}`}
            x={x + size}
            y={y + size}
            size={actualSize}
            fill="#ADD8E6"
            delay={animationDelay}
          />
        );
        placed++;
      }
    }

    return { hexes: hexElements, listNumber: numbers };
  }, [rows, cols, correctAnswer, startX, startY, size, hexHeight, actualSize]); // Dependencies that should trigger a recalculation

  return (
    <View style={{ flex: 1 }}>
      <View style={{
        position: 'absolute',
        top: startY - 80,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
        zIndex: 1,
        width: '80%',
        alignSelf: 'center',
        left: '10%',
        borderRadius: 8,
      }}>
        <Text style={{ color: '#fff', fontSize: 20, textAlign: 'center' }}>
          Find the missing number in the sequence
        </Text>
      </View>

      <Svg height={windowHeight} width={windowWidth}>
        {hexes}
      </Svg>
    </View>
  );
};

export default HexGrid;
