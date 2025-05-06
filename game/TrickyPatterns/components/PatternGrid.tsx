import { View, StyleSheet, Dimensions, Animated } from 'react-native'
import React, { useRef, useEffect } from 'react'
import GridBackground from './GridBackground';

// Lấy kích thước màn hình
const { width: screenWidth } = Dimensions.get('window');

interface PatternGridProps {
    pattern: string[][]; // Mảng 2 chiều chứa mã màu
    showResult?: boolean;
    animationDuration?: number;
    rotation?: number; // Góc quay, optional
}

/**
 * Component PatternGrid - Hiển thị lưới mẫu với các chấm màu
 */
const PatternGrid = ({
    pattern,
    showResult = false,
    animationDuration = 500, // Thời gian quay mặc định là 500ms
    rotation = 0, // Mặc định không quay
}: PatternGridProps) => {
    // Create a rotation animation value
    const rotateAnim = useRef(new Animated.Value(0)).current;

    // Animation function for smooth rotation
    const animateRotation = () => {
        // Reset animation value if we're starting from the beginning
        if (!showResult) {
            rotateAnim.setValue(0);
            return;
        }

        // Animate to the target rotation value
        Animated.timing(rotateAnim, {
            toValue: 1,
            duration: animationDuration,
            useNativeDriver: true,
        }).start();
    };

    // Run animation when showResult changes
    useEffect(() => {
        animateRotation();
    }, [showResult]);

    // Calculate the interpolated rotation value
    // This is fixed to correctly handle the rotation direction
    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', `${-rotation}deg`]
    });

    // Handle null or undefined pattern
    if (!pattern || pattern.length === 0) {
        return <View style={styles.gridWrapper} />;
    }

    return (
        <View style={styles.gridWrapper}>
            <Animated.View style={[
                styles.gridContainer,
                { transform: [{ rotate: spin }] }
            ]}>
                {/* Nền SVG */}
                <View style={StyleSheet.absoluteFill}>
                    <GridBackground />
                </View>

                {/* Các chấm màu */}
                {pattern.map((row, rowIndex) => (
                    <View key={`row-${rowIndex}`} style={styles.gridRow}>
                        {row.map((cellColor, colIndex) => (
                            <View key={`cell-${rowIndex}-${colIndex}`} style={styles.gridCell}>
                                {cellColor && cellColor !== 'transparent' && (
                                    <View style={[styles.dot, { backgroundColor: cellColor }]} />
                                )}
                            </View>
                        ))}
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
        borderRadius: 8,
        padding: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: '#282047'
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