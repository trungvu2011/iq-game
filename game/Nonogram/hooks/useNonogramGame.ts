import { useState, useEffect, useRef, useCallback } from 'react';
import { CELL_STATES, GAME_STATUS, MARK_MODES } from '../constants/gameConstants';
import { NonogramLevel, CellPosition, WrongCell, GridLayout } from '../types';

export const useNonogramGame = (levels: NonogramLevel[]) => {
    // State variables
    const [level, setLevel] = useState(151);
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
    const gridLayoutRef = useRef<GridLayout | null>(null);

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

        // Nếu đã hoàn thành, cập nhật trạng thái game
        if (correct) {
            setGameStatus(GAME_STATUS.COMPLETED);
        }
    }, [solution, puzzle]);

    // Tìm ô tại vị trí
    const findCellAtPosition = useCallback((pageX: number, pageY: number): CellPosition | null => {
        const grid = gridLayoutRef.current;
        if (!grid || !grid.layout) return null;

        const { layout, cellSize, topOffset, leftOffset } = grid;

        // Kiểm tra xem vị trí có nằm trong lưới không
        if (pageX < layout.x || pageX > layout.x + layout.width ||
            pageY < layout.y || pageY > layout.y + layout.height) {
            return null;
        }

        // Tính toán hàng và cột dựa trên vị trí
        const relativeX = pageX - layout.x - leftOffset;
        const relativeY = pageY - layout.y - topOffset;

        const col = Math.floor(relativeX / cellSize);
        const row = Math.floor(relativeY / cellSize);

        // Kiểm tra xem hàng và cột có hợp lệ không
        if (row >= 0 && row < puzzle.length && col >= 0 && col < puzzle[0].length) {
            return { row, col };
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
    const fillSkippedCells = useCallback(
        (start: { row: number; col: number }, end: { row: number; col: number }, toggleCell: (row: number, col: number) => void) => {
            const dRow = end.row - start.row;
            const dCol = end.col - start.col;

            const steps = Math.max(Math.abs(dRow), Math.abs(dCol));
            const stepRow = dRow / steps;
            const stepCol = dCol / steps;

            for (let i = 1; i <= steps; i++) {
                const row = Math.round(start.row + stepRow * i);
                const col = Math.round(start.col + stepCol * i);

                if (
                    row >= 0 && row < puzzle.length &&
                    col >= 0 && col < puzzle[0].length
                ) {
                    toggleCell(row, col);
                }
            }
        }, [puzzle]
    );


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
    const toggleCell = useCallback((row: number, col: number, mode: any) => {
        if (isComplete || gameStatus === GAME_STATUS.FAILED) {
            return;
        }

        // Kiểm tra nếu ô đã được đánh dấu rồi thì không thay đổi nữa
        const currentState = solution[row][col];
        if (currentState === CELL_STATES.FILLED || currentState === CELL_STATES.MARKED) {
            return; // Không thay đổi ô đã đánh dấu
        }

        const newSolution = [...solution];

        // Trường hợp 1: Chế độ tô đen
        if (markMode === MARK_MODES.FILL) {
            if (puzzle[row][col] === 1) {
                // Đúng: Ô này nên tô đen - chuyển đổi giữa empty và filled
                newSolution[row][col] = CELL_STATES.FILLED;
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
                newSolution[row][col] = CELL_STATES.MARKED;
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
    }, [solution, puzzle, markMode, gameStatus, handleWrongCell, autoMarkCompletedLines]);

    // Hàm để cung cấp gợi ý
    const giveHint = useCallback(() => {
        if (hintsRemaining <= 0 || gameStatus === GAME_STATUS.FAILED) {
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
        gridLayoutRef.current = {
            layout: { x: 0, y: 0, width: 0, height: 0 },
            cellSize: 0,
            topOffset: 0,
            leftOffset: 0
        }
    }, [level, levels]);

    // Reset level
    const resetLevel = useCallback(() => {
        // Clear wrong cells timer if it exists
        if (wrongCellsTimerRef.current) {
            clearTimeout(wrongCellsTimerRef.current);
            wrongCellsTimerRef.current = null;
        }

        // Clear wrong cells list
        setWrongCells([]);

        const rows = puzzle.length;
        const cols = puzzle[0]?.length || 0;

        const emptySolution = Array.from({ length: rows }, () =>
            Array(cols).fill(CELL_STATES.EMPTY)
        );

        setSolution(emptySolution);
        setIsComplete(false);
        setLives(3);
        setHintsRemaining(3);
        setGameStatus(GAME_STATUS.PLAYING);
        setRenderKey(prev => prev + 1);
    }, [puzzle]);


    // Lưu vị trí grid
    const saveGridLayout = useCallback((layout: GridLayout) => {
        gridLayoutRef.current = layout;
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
        gridLayoutRef,
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
        saveGridLayout
    };
};