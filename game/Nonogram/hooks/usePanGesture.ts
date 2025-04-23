import { useMemo } from 'react';
import { PanResponder } from 'react-native';
import { CELL_STATES, GAME_STATUS } from '../constants/gameConstants';

/**
 * Hook xử lý các cử chỉ vuốt trên màn hình
 */
export const usePanGesture = (gameState: any) => {
    const {
        isComplete,
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
                if (isComplete || gameStatus === GAME_STATUS.FAILED) {
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
                if (isComplete || gameStatus === GAME_STATUS.FAILED) {
                    return;
                }

                const { pageX, pageY } = evt.nativeEvent;
                const cellTouched = findCellAtPosition(pageX, pageY);

                if (cellTouched && lastToggledCell) {
                    const { row, col } = cellTouched;

                    // Chỉ xử lý nếu đã chuyển sang ô mới
                    if (lastToggledCell.row !== row || lastToggledCell.col !== col) {
                        // Điền các ô bị bỏ qua khi vuốt nhanh
                        const newSolution = fillSkippedCells(lastToggledCell, cellTouched);

                        // Kiểm tra và tự động đánh dấu X cho các ô hoàn thành
                        if (newSolution) {
                            autoMarkCompletedLines(newSolution, row, col);
                        }

                        // Cập nhật ô cuối cùng được chạm
                        setLastToggledCell({ row, col });
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
            isComplete,
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