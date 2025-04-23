import { useState, useEffect, useRef, useCallback } from 'react';
import { CELL_STATES, GAME_STATUS, MARK_MODES } from '../constants/gameConstants';
import { NonogramLevel, CellPosition, WrongCell } from '../types';

export const useNonogramGame = (levels: NonogramLevel[]) => {
    // State variables
    const [level, setLevel] = useState(0);
    const [renderKey, setRenderKey] = useState(0);
    const [lives, setLives] = useState(3);
    const [gameStatus, setGameStatus] = useState(GAME_STATUS.PLAYING);
    const [hintsRemaining, setHintsRemaining] = useState(3);
    const [isComplete, setIsComplete] = useState(false);
    const [markMode, setMarkMode] = useState(MARK_MODES.FILL);
    const [lastToggledCell, setLastToggledCell] = useState<{ row: number; col: number } | null>(null);
    const [currentMarkValue, setCurrentMarkValue] = useState<number>(CELL_STATES.EMPTY);
    const [wrongCells, setWrongCells] = useState<WrongCell[]>([]);

    // Refs
    const wrongCellsTimerRef = useRef<NodeJS.Timeout | null>(null);
    const cellPositionsRef = useRef<{ [key: string]: CellPosition }>({});

    // Get current puzzle
    const puzzle = levels[level]?.nonogrid || [];
    const colorGrid = levels[level]?.colorgrid || [];

    // Initialize solution
    const [solution, setSolution] = useState(
        Array(puzzle.length).fill(null).map(() => Array(puzzle[0].length).fill(CELL_STATES.EMPTY))
    );

    // Calculate hints
    const rowHints = levels[level]?.row_hints || [];
    const colHints = levels[level]?.col_hints || [];

    // Cập nhật solution khi puzzle thay đổi
    useEffect(() => {
        setSolution(Array(puzzle.length).fill(null).map(() =>
            Array(puzzle[0].length).fill(CELL_STATES.EMPTY)
        ));
    }, [puzzle]);

    // Kiểm tra xem puzzle đã giải xong chưa
    useEffect(() => {
        let correct = true;

        for (let row = 0; row < puzzle.length; row++) {
            for (let col = 0; col < puzzle[0].length; col++) {
                if (
                    (puzzle[row][col] === 1 && solution[row][col] !== CELL_STATES.FILLED) ||
                    (puzzle[row][col] === 0 && solution[row][col] === CELL_STATES.FILLED)
                ) {
                    correct = false;
                    break;
                }
            }
            if (!correct) {
                break;
            }
        }

        setIsComplete(correct);
    }, [solution, puzzle]);

    // Tìm ô tại vị trí
    const findCellAtPosition = useCallback((pageX: number, pageY: number): CellPosition | null => {
        for (const key in cellPositionsRef.current) {
            const cell = cellPositionsRef.current[key];
            const layout = cell.layout;

            if (layout) {
                if (
                    pageX >= layout.x &&
                    pageX <= layout.x + layout.width &&
                    pageY >= layout.y &&
                    pageY <= layout.y + layout.height
                ) {
                    return cell;
                }
            }
        }
        return null;
    }, []);

    // Tự động đánh dấu các dòng đã hoàn thành
    const autoMarkCompletedLines = useCallback((currentSolution: number[][], affectedRow?: number, affectedCol?: number) => {
        const newSolution = [...currentSolution];
        let hasChanges = false;

        // Nếu có affectedRow, chỉ kiểm tra hàng đó
        if (affectedRow !== undefined) {
            const requiredFilledCells = rowHints[affectedRow].reduce((sum, hint) => sum + hint, 0);

            // Đếm số ô đã tô đen trong hàng
            const filledCells = newSolution[affectedRow].filter(cell =>
                cell === CELL_STATES.FILLED || cell === CELL_STATES.FILLED_WRONG
            ).length;

            // Chỉ khi số ô tô đen đã đủ theo gợi ý, mới đánh X các ô còn trống
            if (filledCells === requiredFilledCells) {
                for (let colIndex = 0; colIndex < newSolution[affectedRow].length; colIndex++) {
                    if (newSolution[affectedRow][colIndex] === CELL_STATES.EMPTY) {
                        newSolution[affectedRow][colIndex] = CELL_STATES.MARKED;
                        hasChanges = true;
                    }
                }
            }
        }

        // Nếu có affectedCol, chỉ kiểm tra cột đó
        if (affectedCol !== undefined) {
            const requiredFilledCells = colHints[affectedCol].reduce((sum, hint) => sum + hint, 0);

            // Đếm số ô đã tô đen trong cột
            let filledCells = 0;
            for (let rowIndex = 0; rowIndex < puzzle.length; rowIndex++) {
                if (newSolution[rowIndex][affectedCol] === CELL_STATES.FILLED ||
                    newSolution[rowIndex][affectedCol] === CELL_STATES.FILLED_WRONG) {
                    filledCells++;
                }
            }

            // Chỉ khi số ô tô đen đã đủ theo gợi ý, mới đánh X các ô còn trống
            if (filledCells === requiredFilledCells) {
                for (let rowIndex = 0; rowIndex < puzzle.length; rowIndex++) {
                    if (newSolution[rowIndex][affectedCol] === CELL_STATES.EMPTY) {
                        newSolution[rowIndex][affectedCol] = CELL_STATES.MARKED;
                        hasChanges = true;
                    }
                }
            }
        }

        if (hasChanges) {
            setSolution(newSolution);
        }

        return newSolution;
    }, [puzzle, rowHints, colHints]);

    // Điền các ô bị bỏ qua khi vuốt nhanh
    const fillSkippedCells = useCallback((startCell: CellPosition, endCell: CellPosition) => {
        if (!startCell || !endCell) return;

        const { row: startRow, col: startCol } = startCell;
        const { row: endRow, col: endCol } = endCell;

        if (Math.abs(startRow - endRow) <= 1 && Math.abs(startCol - endCol) <= 1) {
            return;
        }

        const deltaRow = Math.abs(endRow - startRow);
        const deltaCol = Math.abs(endCol - startCol);
        const signRow = startRow < endRow ? 1 : -1;
        const signCol = startCol < endCol ? 1 : -1;

        const newSolution = [...solution];
        // Biến đếm số ô sai để trừ mạng chính xác
        let wrongCellCount = 0;

        let error = deltaCol - deltaRow;
        let currentRow = startRow;
        let currentCol = startCol;

        // Thuật toán Bresenham để vẽ đường thẳng
        while (currentRow !== endRow || currentCol !== endCol) {
            const doubleError = error * 2;

            if (doubleError > -deltaRow) {
                error -= deltaRow;
                currentCol += signCol;
            }

            if (doubleError < deltaCol) {
                error += deltaCol;
                currentRow += signRow;
            }

            // Kiểm tra xem ô có hợp lệ không và cập nhật
            if (currentRow >= 0 && currentRow < puzzle.length &&
                currentCol >= 0 && currentCol < puzzle[0].length) {

                // Xử lý cho từng ô riêng biệt
                let isWrongMove = false;

                // Trường hợp 1: Chế độ tô đen
                if (markMode === MARK_MODES.FILL) {
                    if (puzzle[currentRow][currentCol] === 1) {
                        // Đúng: Ô này nên tô đen
                        newSolution[currentRow][currentCol] = CELL_STATES.FILLED;
                    } else {
                        // Sai: Ô này không nên tô đen
                        newSolution[currentRow][currentCol] = CELL_STATES.MARKED_WRONG;
                        isWrongMove = true;
                        wrongCellCount++;
                    }
                }
                // Trường hợp 2: Chế độ đánh X
                else {
                    if (puzzle[currentRow][currentCol] === 0) {
                        // Đúng: Ô này nên đánh X
                        newSolution[currentRow][currentCol] = CELL_STATES.MARKED;
                    } else {
                        // Sai: Ô này không nên đánh X
                        newSolution[currentRow][currentCol] = CELL_STATES.FILLED_WRONG;
                        isWrongMove = true;
                        wrongCellCount++;
                    }
                }
            }
        }

        // Cập nhật solution
        setSolution(newSolution);

        // Trừ mạng dựa vào số ô sai
        if (wrongCellCount > 0) {
            const newLives = Math.max(0, lives - wrongCellCount);
            setLives(newLives);

            // Kiểm tra nếu hết mạng thì game over
            if (newLives <= 0) {
                setGameStatus(GAME_STATUS.FAILED);
            }
        }

        return newSolution;
    }, [puzzle, solution, lives, markMode]);

    // Xử lý khi người chơi chọn sai ô
    const handleWrongCell = useCallback((row: number, col: number) => {
        // Giảm mạng sống
        const newLives = lives - 1;
        setLives(newLives);

        // Lưu trạng thái thực tế mà người chơi đã đánh
        const actualState = solution[row][col];

        // Thêm ô sai vào danh sách để hiển thị
        setWrongCells(prev => [...prev, {
            row,
            col,
            correctValue: puzzle[row][col] === 1 ? CELL_STATES.FILLED : CELL_STATES.MARKED,
            actualState
        }]);

        // Hẹn giờ để xóa danh sách ô sai sau 1.5 giây
        if (wrongCellsTimerRef.current) {
            clearTimeout(wrongCellsTimerRef.current);
        }

        wrongCellsTimerRef.current = setTimeout(() => {
            // Khôi phục trạng thái thực tế cho các ô đã đánh sai
            const newSolution = [...solution];
            wrongCells.forEach(cell => {
                newSolution[cell.row][cell.col] = cell.actualState;
            });
            setSolution(newSolution);

            // Xóa danh sách ô sai
            setWrongCells([]);
        }, 1500);

        // Kiểm tra nếu hết mạng thì game over
        if (newLives <= 0) {
            setGameStatus(GAME_STATUS.FAILED);
        }
    }, [lives, puzzle, solution, wrongCells]);

    // Toggle cell state based on current mark mode
    const toggleCell = useCallback((row: number, col: number) => {
        if (isComplete || gameStatus === GAME_STATUS.FAILED) {
            return;
        }

        const newSolution = [...solution];

        // Trường hợp 1: Chế độ tô đen
        if (markMode === MARK_MODES.FILL) {
            if (puzzle[row][col] === 1) {
                // Đúng: Ô này nên tô đen - chuyển đổi giữa empty và filled
                newSolution[row][col] = newSolution[row][col] === CELL_STATES.FILLED
                    ? CELL_STATES.EMPTY
                    : CELL_STATES.FILLED;
            } else {
                // Sai: Ô này không nên tô đen
                newSolution[row][col] = CELL_STATES.MARKED_WRONG;
                handleWrongCell(row, col);
                return;
            }
        }
        // Trường hợp 2: Chế độ đánh X
        else {
            if (puzzle[row][col] === 0) {
                // Đúng: Ô này nên đánh X - chuyển đổi giữa empty và marked
                newSolution[row][col] = newSolution[row][col] === CELL_STATES.MARKED
                    ? CELL_STATES.EMPTY
                    : CELL_STATES.MARKED;
            } else {
                // Sai: Ô này không nên đánh X
                newSolution[row][col] = CELL_STATES.FILLED_WRONG;
                handleWrongCell(row, col);
                return;
            }
        }

        // Cập nhật solution với trạng thái mới
        setSolution(newSolution);

        // Kiểm tra và tự động đánh dấu X sau khi cập nhật ô
        autoMarkCompletedLines(newSolution, row, col);
    }, [solution, puzzle, markMode, isComplete, gameStatus, handleWrongCell, autoMarkCompletedLines]);

    // Hàm để cung cấp gợi ý
    const giveHint = useCallback(() => {
        if (hintsRemaining <= 0 || isComplete || gameStatus === GAME_STATUS.FAILED) {
            return;
        }

        // Tìm tất cả các ô trống
        const emptyCells: { row: number, col: number }[] = [];
        for (let row = 0; row < puzzle.length; row++) {
            for (let col = 0; col < puzzle[0].length; col++) {
                if (solution[row][col] === CELL_STATES.EMPTY) {
                    emptyCells.push({ row, col });
                }
            }
        }

        // Nếu không có ô trống, không làm gì
        if (emptyCells.length === 0) {
            return;
        }

        // Chọn một ô trống ngẫu nhiên
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const { row, col } = emptyCells[randomIndex];

        // Điền ô với giá trị đúng
        const newSolution = [...solution];
        if (puzzle[row][col] === 1) {
            newSolution[row][col] = CELL_STATES.FILLED;
        } else {
            newSolution[row][col] = CELL_STATES.MARKED;
        }

        setSolution(newSolution);
        setHintsRemaining(prev => prev - 1);

        // Kiểm tra và tự động đánh dấu các dòng đã hoàn thành
        autoMarkCompletedLines(newSolution, row, col);
    }, [puzzle, solution, hintsRemaining, isComplete, gameStatus, autoMarkCompletedLines]);

    // Đi đến level tiếp theo
    const goToNextLevel = useCallback(() => {
        const nextLevel = (level + 1) % levels.length;
        setLevel(nextLevel);
        setSolution(
            Array(levels[nextLevel].nonogrid.length).fill(null)
                .map(() => Array(levels[nextLevel].nonogrid[0].length).fill(CELL_STATES.EMPTY))
        );
        setIsComplete(false);
        setLives(3);
        setHintsRemaining(3);
        setGameStatus(GAME_STATUS.PLAYING);
        setRenderKey(prev => prev + 1);
        cellPositionsRef.current = {};
    }, [level, levels]);

    // Reset level
    const resetLevel = useCallback(() => {
        setSolution(Array(puzzle.length).fill(null).map(() =>
            Array(puzzle[0].length).fill(CELL_STATES.EMPTY)
        ));
        setIsComplete(false);
        setLives(3);
        setHintsRemaining(3);
        setGameStatus(GAME_STATUS.PLAYING);
    }, [puzzle]);

    // Lưu vị trí ô
    const saveCellPosition = useCallback((row: number, col: number, layout: { x: number, y: number, width: number, height: number }) => {
        const cellKey = `${row}-${col}`;
        cellPositionsRef.current[cellKey] = {
            row,
            col,
            layout: {
                x: layout.x,
                y: layout.y,
                width: layout.width,
                height: layout.height,
            }
        };
    }, []);

    return {
        level,
        renderKey,
        lives,
        gameStatus,
        hintsRemaining,
        solution,
        isComplete,
        markMode,
        puzzle,
        colorGrid,
        rowHints,
        colHints,
        lastToggledCell,
        currentMarkValue,
        wrongCells,
        cellPositionsRef,
        setLastToggledCell,
        setCurrentMarkValue,
        findCellAtPosition,
        fillSkippedCells,
        toggleCell,
        autoMarkCompletedLines,
        giveHint,
        goToNextLevel,
        resetLevel,
        setMarkMode,
        saveCellPosition
    };
};