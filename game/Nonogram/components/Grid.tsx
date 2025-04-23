import React from 'react';
import { View, StyleSheet, GestureResponderHandlers } from 'react-native';
import Cell from './Cell';
import RowHints from './RowHints';
import ColumnHints from './ColumnHints';
import { CellPosition } from '../types';

interface GridProps {
    puzzle: number[][];
    colorGrid: number[][][];
    rowHints: number[][];
    colHints: number[][];
    cellSize: number;
    gameState: {
        solution: number[][];
        isComplete: boolean;
        toggleCell: (row: number, col: number) => void;
        saveCellPosition: (row: number, col: number, layout: { x: number, y: number, width: number, height: number }) => void;
    };
    panResponderHandlers: GestureResponderHandlers;
}

const Grid = ({
    puzzle,
    colorGrid,
    rowHints,
    colHints,
    cellSize,
    gameState,
    panResponderHandlers
}: GridProps) => {
    // Tính toán font size cho gợi ý dựa trên kích thước ô
    const hintFontSize = Math.floor(cellSize * 0.5);

    const handleCellLayout = (row: number, col: number, pageX: number, pageY: number, width: number, height: number) => {
        gameState.saveCellPosition(row, col, { x: pageX, y: pageY, width, height });
    };

    return (
        <View style={styles.puzzleContainer}>
            {/* Góc trống phía trên bên trái */}
            <View
                style={[
                    styles.cornerSpace,
                    { width: cellSize * 1.5, height: cellSize * 2 },
                ]}
            />

            {/* Gợi ý cột */}
            <View style={[styles.colHintsContainer, { marginLeft: cellSize * 1.5 }]}>
                <ColumnHints
                    hints={colHints}
                    cellSize={cellSize}
                    hintFontSize={hintFontSize}
                />
            </View>

            {/* Vùng chứa lưới và gợi ý hàng */}
            <View
                style={styles.gridAndRowHints}
                {...panResponderHandlers}
            >
                {rowHints.map((_, rowIndex) => (
                    <View key={`row-${rowIndex}`} style={styles.row}>
                        {/* Gợi ý hàng */}
                        <RowHints
                            hints={[rowHints[rowIndex]]}
                            cellSize={cellSize}
                            hintFontSize={hintFontSize}
                        />

                        {/* Các ô trong hàng */}
                        {Array.from({ length: puzzle[0]?.length || 0 }).map((_, colIndex) => (
                            <Cell
                                key={`cell-${rowIndex}-${colIndex}`}
                                row={rowIndex}
                                col={colIndex}
                                cellState={gameState.solution[rowIndex][colIndex]}
                                cellSize={cellSize}
                                isComplete={gameState.isComplete}
                                colorValue={colorGrid[rowIndex][colIndex]}
                                onPress={() => {
                                    if (!gameState.isComplete) {
                                        gameState.toggleCell(rowIndex, colIndex);
                                    }
                                }}
                                onCellLayout={handleCellLayout}
                            />
                        ))}
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    puzzleContainer: {
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    cornerSpace: {
        backgroundColor: '#FFFFFF',
    },
    colHintsContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    gridAndRowHints: {
        flexDirection: 'column',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default Grid;