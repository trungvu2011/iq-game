import { useMemo } from 'react';
import { PanResponder } from 'react-native';
import { CELL_STATES, GAME_STATUS } from '../constants/gameConstants';

/**
 * Hook xử lý các cử chỉ vuốt trên màn hình
 */
export const usePanGesture = (gameState: any) => {
    const {
        gameStatus,
        markMode,
        puzzle,
        solution,
        lives,
        findCellAtPosition,
        fillSkippedCells,
        autoMarkCompletedLines,
        setLastToggledCell,
        lastToggledCell,
        setCurrentMarkValue,
        toggleCell
    } = gameState;

    // PanResponder definition
    const panResponder = useMemo(() =>
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,

            onPanResponderGrant: (evt, _gestureState) => {
                if (gameStatus === GAME_STATUS.FAILED) {
                    return;
                }

                const { pageX, pageY } = evt.nativeEvent;
                const cellTouched = findCellAtPosition(pageX, pageY);

                if (cellTouched) {
                    // Xử lý ô đầu tiên được chạm vào
                    const { row, col } = cellTouched;
                    toggleCell(row, col);
                    setLastToggledCell({ row, col });
                }
            },

            onPanResponderMove: (evt, _gestureState) => {
                if (gameStatus === GAME_STATUS.FAILED) return;

                const { pageX, pageY } = evt.nativeEvent;
                const cellTouched = findCellAtPosition(pageX, pageY);

                if (cellTouched && lastToggledCell) {
                    const { row, col } = cellTouched;

                    // // Cập nhật các ô đã bỏ qua
                    fillSkippedCells(lastToggledCell, { row, col }, toggleCell);

                    // Chỉ xử lý nếu đang vuốt sang ô khác
                    if (lastToggledCell.row !== row || lastToggledCell.col !== col) {
                        toggleCell(row, col);

                        // Cập nhật lại ô cuối cùng đã xử lý
                        setLastToggledCell({ row, col });

                        // Tự động đánh dấu dòng hoàn thành
                        if (solution) {
                            autoMarkCompletedLines(solution, row, col);
                        }
                    }
                }
            },


            onPanResponderRelease: (_evt, _gestureState) => {
                if (lastToggledCell) {
                    setLastToggledCell(null);
                }
            },

            onPanResponderTerminate: (_evt, _gestureState) => {
                if (lastToggledCell) {
                    setLastToggledCell(null);
                }
            },
        }),
        [
            gameStatus,
            markMode,
            puzzle,
            solution,
            lives,
            findCellAtPosition,
            fillSkippedCells,
            autoMarkCompletedLines,
            setLastToggledCell,
            lastToggledCell,
            setCurrentMarkValue,
            toggleCell
        ]
    );

    return panResponder;
};