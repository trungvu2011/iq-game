import React, { useState, useEffect } from 'react';
import { G, Text } from 'react-native-svg';
import HexagonBackground from './HexagonBackground';

interface HexagonProps {
  x: number;
  y: number;
  size: number;
  fill: string;
  number: number;
  delay?: number;
}

const Hexagon = ({ x, y, size, number, delay = 0 }: HexagonProps) => {
  // Sử dụng state để quản lý opacity thay vì Animated API
  const [opacity, setOpacity] = useState(0);

  // Sử dụng setTimeout để tạo hiệu ứng xuất hiện
  useEffect(() => {
    const timer = setTimeout(() => {
      setOpacity(1);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  // Kích thước cho hexagon background (điều chỉnh để phù hợp)
  const hexSize = size * 2;

  return (
    <G opacity={opacity}>
      <HexagonBackground
        width={hexSize}
        height={hexSize}
        x={x - hexSize / 2}
        y={y - hexSize / 2}
      />
      <Text
        x={x}
        y={y + size * 0.1}
        fontSize={size * 0.6}
        fontWeight="bold"
        fill="black"
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        {number}
      </Text>
    </G>
  );
};

export default Hexagon;