import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CELL_STATES } from '../constants/gameConstants';

interface CellProps {
    row: number;
    col: number;
    cellState: number;
    cellSize: number;
    isComplete: boolean;
    colorValue?: number[];
    onPress?: () => void;
    onCellLayout: (row: number, col: number, pageX: number, pageY: number, width: number, height: number) => void;
}

const Cell = ({
    row,
    col,
    cellState,
    cellSize,
    isComplete,
    colorValue,
    onPress,
    onCellLayout
}: CellProps) => {
    let backgroundColor = '#F8F8F8';
    let borderColor = '#CCCCCC';
    let content = null;

    if (isComplete && colorValue) {
        // Hiển thị màu hoàn thành
        if (colorValue.length === 3) {
            backgroundColor = `rgb(${Math.round(colorValue[0])}, ${Math.round(colorValue[1])}, ${Math.round(colorValue[2])})`;
        } else {
            backgroundColor = '#333333';
        }
    } else {
        // Hiển thị trạng thái ô dựa vào các trạng thái có thể có
        switch (cellState) {
            case CELL_STATES.FILLED:
                // Tô đen bình thường
                backgroundColor = '#333333';
                break;

            case CELL_STATES.MARKED:
                // Đánh X bình thường
                content = <Text style={styles.cellX}>X</Text>;
                // Giữ nền kẻ ca-rô
                const isEvenRowMarked = row % 2 === 0;
                const isEvenColMarked = col % 2 === 0;
                const isEvenCellMarked = (isEvenRowMarked && isEvenColMarked) || (!isEvenRowMarked && !isEvenColMarked);
                backgroundColor = isEvenCellMarked ? '#F8F8F8' : '#F0F0F0';
                break;

            case CELL_STATES.FILLED_WRONG:
                // Tô hồng (khi ô cần tô đen nhưng bị đánh X sai)
                backgroundColor = '#F48FB1'; // Màu hồng đậm hơn
                break;

            case CELL_STATES.MARKED_WRONG:
                // Tô X nền hồng (khi ô cần đánh X nhưng bị tô đen sai)
                backgroundColor = '#FFCDD2';  // Màu hồng nhạt
                content = <Text style={[styles.cellX, { color: '#D32F2F' }]}>X</Text>;
                break;

            default:
                // Ô trống, giữ nền kẻ ca-rô
                const isEvenRow = row % 2 === 0;
                const isEvenCol = col % 2 === 0;
                const isEvenCell = (isEvenRow && isEvenCol) || (!isEvenRow && !isEvenCol);
                backgroundColor = isEvenCell ? '#F8F8F8' : '#F0F0F0';
                break;
        }
    }

    return (
        <TouchableOpacity
            style={styles.cellContainer}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View
                style={[
                    styles.cell,
                    {
                        backgroundColor,
                        borderColor,
                        width: cellSize,
                        height: cellSize,
                    },
                ]}
                onLayout={(event) => {
                    event.target.measure((_, __, cellWidth, cellHeight, pageX, pageY) => {
                        onCellLayout(row, col, pageX, pageY, cellWidth, cellHeight);
                    });
                }}
            >
                {content}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cellContainer: {
        marginHorizontal: 0,
    },
    cell: {
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 0,
        padding: 0,
        borderRadius: 0,
        width: '100%',
        height: '100%',
    },
    cellX: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#E57373',
    },
});

export default Cell;