import React, { useState, useEffect } from 'react';
import Svg, { G, Text, Path } from 'react-native-svg';


interface HexagonBackgroundProps {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  [key: string]: any; // Để hỗ trợ props khác được truyền vào
}

function HexagonBackground({ width = 60, height = 60, x = 0, y = 0, ...props }: HexagonBackgroundProps) {
  return (
    <G x={x} y={y}>
      <Path
        fill="#537983"
        d="M1268 1600H439c-8 0-14-4-18-10L3 865c-4-6-4-14 0-20l420-728c4-7 10-10 18-10h825c7 0 14 3 17 10l421 728c3 6 3 14 0 20l-419 725c-3 6-10 10-17 10z"
        scale={width / 1707}
        data-original="#537983"
      />
      <Path
        fill="#6bb7ed"
        d="M1189 1462H518c-7 0-14-4-18-11L162 865c-4-6-4-14 0-21l340-589c3-6 10-10 18-10h667c7 0 14 4 18 10l340 589c4 7 4 15 0 21l-338 586c-4 7-11 11-18 11z"
        scale={width / 1707}
        data-original="#6bb7ed"
      />
      <Path
        fill="#a3d9ff"
        d="M540 1403h627l317-548-318-552H541L223 855z"
        scale={width / 1707}
        data-original="#a3d9ff"
      />
    </G>
  )
}
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
    <Svg opacity={opacity}>
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
    </Svg>
  );
};

export default Hexagon;