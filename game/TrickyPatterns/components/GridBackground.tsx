// GridBackground.tsx
import React from 'react';
import Svg, { Circle, Line } from 'react-native-svg';

const GridBackground = () => {
    return (
        <Svg height="100%" width="100%" viewBox="0 0 250 250">
            {/* Đường tròn đồng tâm */}
            <Circle cx="125" cy="125" r="50" stroke="#322a4f" strokeWidth="12" fill="none" />
            <Circle cx="125" cy="125" r="100" stroke="#322a4f" strokeWidth="12" fill="none" />

            {/* Đường chia ngang và dọc */}
            <Line x1="125" y1="175" x2="125" y2="225" stroke="#322a4f" strokeWidth="12" />
            <Line x1="125" y1="75" x2="125" y2="25" stroke="#322a4f" strokeWidth="12" />

            <Line x1="75" y1="125" x2="25" y2="125" stroke="#322a4f" strokeWidth="12" />
            <Line x1="175" y1="125" x2="225" y2="125" stroke="#322a4f" strokeWidth="12" />
        </Svg>
    );
};

export default GridBackground;
