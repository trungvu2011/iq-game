import { View, StyleSheet, Text } from 'react-native'
import React from 'react'
import PatternGrid from './PatternGrid'

interface PatternComparisonProps {
    pattern1: string[][];
    pattern2: string[][];
    showResult: boolean;
    isCorrectAnswer: boolean;
    animationDuration?: number; // Thêm prop cho thời gian animation
    rotation?: number; // Thêm prop cho góc xoay
}

/**
 * Component PatternComparison - Hiển thị hai lưới mẫu để so sánh
 */
const PatternComparison = ({
    pattern1,
    pattern2,
    showResult,
    isCorrectAnswer,
    animationDuration = 500, // Mặc định là 500ms
    rotation = 90, // Góc xoay mặc định là 90 độ
}: PatternComparisonProps) => {
    return (
        <View style={styles.comparisonContainer}>
            {/* Result icon shown in the middle between the grids */}
            {showResult && (
                <View style={styles.resultIconContainer}>
                    <View style={[
                        styles.resultIconBackground,
                        { backgroundColor: isCorrectAnswer ? 'rgba(76, 175, 80, 0.8)' : 'rgba(244, 67, 54, 0.8)' }
                    ]}>
                        <Text style={[
                            styles.resultIcon,
                            { color: '#FFFFFF' }
                        ]}>
                            {isCorrectAnswer ? '✓' : '✗'}
                        </Text>
                    </View>
                </View>
            )}

            <View style={styles.gridsContainer}>
                <PatternGrid
                    pattern={pattern1}
                    showResult={showResult}
                    animationDuration={animationDuration}
                />

                <PatternGrid
                    pattern={pattern2}
                    showResult={showResult}
                    animationDuration={animationDuration}
                    rotation={rotation} // Truyền góc xoay cho pattern thứ hai
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    // Main container
    comparisonContainer: {
        width: '100%',
        position: 'relative',
        marginBottom: 20,
    },
    // Container for both grids
    gridsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 10,
    },
    // Result icon container positioned in the middle and above
    resultIconContainer: {
        position: 'absolute',
        top: -60, // Position above the grids
        left: 0,
        right: 0,
        zIndex: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Circular background for the icon
    resultIconBackground: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    // Result icon style
    resultIcon: {
        fontSize: 40,
        fontWeight: 'bold',
    },
});

export default PatternComparison;