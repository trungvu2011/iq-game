import { View, StyleSheet, Dimensions, Animated, Text } from 'react-native'
import React, { useRef, useEffect } from 'react'

// Lấy kích thước màn hình
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface PatternGridProps {
    grid: number[][];
    colorMap: Record<string, string>;
    rotation: number;
    size: number;
    showResult?: boolean;
    isCorrect?: boolean;
}

/**
 * Component PatternGrid - Hiển thị lưới mẫu với các chấm màu
 */
const PatternGrid = ({
    grid,
    colorMap,
    rotation,
    size,
    showResult = false,
    isCorrect
}: PatternGridProps) => {
    // Create a rotation animation value
    const rotateAnim = useRef(new Animated.Value(0)).current;

    // Update rotation animation when rotation prop changes
    useEffect(() => {
        Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();

        return () => {
            rotateAnim.setValue(0);
        };
    }, [rotation]);

    // Map rotation degrees to animated rotation
    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', `${-rotation}deg`],
    });

    return (
        <View style={styles.gridWrapper}>
            <Animated.View style={[
                styles.gridContainer,
                { transform: [{ rotate: spin }] }
            ]}>
                {grid.map((row, rowIndex) => (
                    <View key={`row-${rowIndex}`} style={styles.gridRow}>
                        {row.map((cell, colIndex) => {
                            const key = `${rowIndex},${colIndex}`;
                            const color = colorMap[key] || '#FFFFFF'; // Mặc định là trắng nếu không có màu tương ứng

                            return (
                                <View key={`cell-${rowIndex}-${colIndex}`} style={styles.gridCell}>
                                    {cell === 1 && (
                                        <View style={[styles.dot, { backgroundColor: color }]} />
                                    )}
                                </View>
                            );
                        })}
                    </View>
                ))}
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    // Wrapper cho grid để có thể đặt overlay lên trên
    gridWrapper: {
        position: 'relative',
        width: screenWidth * 0.4,
        aspectRatio: 1,
    },
    // Grid container
    gridContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Grid row
    gridRow: {
        flexDirection: 'row',
        width: '100%',
        flex: 1,
    },
    // Grid cell
    gridCell: {
        flex: 1,
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: '#E0E0E0',
        padding: 2,
    },
    // Dot inside cell
    dot: {
        width: '80%',
        height: '80%',
        borderRadius: 50,
    },
    // Overlay cho kết quả
    resultOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 8,
    },
    // Icon kết quả
    resultIcon: {
        width: '50%',
        height: '50%',
    },
    resultText: {
        color: '#FFFFFF',
        fontSize: 16,
        textAlign: 'center',
    }
});

export default PatternGrid;