import { View, StyleSheet } from 'react-native'
import React from 'react'
import PatternGrid from './PatternGrid'

interface PatternComparisonProps {
    gridA: number[][];
    colorMapA: Record<string, string>;
    gridB: number[][];
    colorMapB: Record<string, string>;
    rotation: number;
    showResult: boolean;
    isCorrectAnswer: boolean;
    gridSize: number;
}

/**
 * Component PatternComparison - Hiển thị hai lưới mẫu để so sánh
 */
const PatternComparison = ({
    gridA,
    colorMapA,
    gridB,
    colorMapB,
    rotation,
    showResult,
    isCorrectAnswer,
    gridSize
}: PatternComparisonProps) => {
    // Khi hiển thị kết quả, xoay gridB theo góc rotation để so sánh
    const gridBRotation = showResult ? rotation : 0;

    return (
        <View style={styles.comparisonContainer}>
            <PatternGrid
                grid={gridA}
                colorMap={colorMapA}
                rotation={0}
                size={gridSize}
                showResult={showResult}
                isCorrect={isCorrectAnswer}
            />

            <PatternGrid
                grid={gridB}
                colorMap={colorMapB}
                rotation={gridBRotation}
                size={gridSize}
                showResult={showResult}
                isCorrect={isCorrectAnswer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    // Comparison container - contains both grids
    comparisonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 10,
        marginBottom: 20,
    },
});

export default PatternComparison;