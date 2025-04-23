import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
    View, Text, StyleSheet,
    TouchableOpacity, SafeAreaView, Dimensions,
    StatusBar, Switch,
    LayoutRectangle,
    PanResponder,
} from 'react-native';
import nonogramLevels from './nonogram_levels.json';

const { width, height } = Dimensions.get('window');

// Constants
const CELL_STATES = {
    EMPTY: 0,
    FILLED: 1,
    MARKED: 2,
    FILLED_WRONG: 3, // Tô hồng (khi ô đáng lẽ phải tô đen)
    MARKED_WRONG: 4, // Tô X nền hồng (khi ô đáng lẽ phải đánh X)
};

const MARK_MODES = {
    FILL: 0,    // Chế độ tô màu các ô
    MARK_X: 1,  // Chế độ đánh dấu X
};

const GAME_STATUS = {
    PLAYING: 0,  // Đang chơi
    COMPLETED: 1, // Đã hoàn thành
    FAILED: 2,   // Thua cuộc
};

/**
 * Tính toán kích thước ô phù hợp dựa trên kích thước màn hình và kích thước puzzle
 * @param puzzleWidth Chiều rộng của puzzle (số ô theo chiều ngang)
 * @param puzzleHeight Chiều cao của puzzle (số ô theo chiều dọc)
 * @returns Kích thước ô tính bằng điểm ảnh
 */
const calculateCellSize = (puzzleWidth: number, puzzleHeight: number): number => {
    // Khả dụng khoảng 85% chiều rộng màn hình cho lưới chơi và gợi ý
    const availableWidth = width * 0.85;
    // Khả dụng khoảng 60% chiều cao màn hình cho lưới chơi
    const availableHeight = height * 0.6;

    // Tính toán kích thước dựa trên chiều nhỏ hơn để đảm bảo lưới vừa màn hình
    const cellSizeByWidth = availableWidth / puzzleWidth;
    const cellSizeByHeight = availableHeight / puzzleHeight;

    // Lấy giá trị nhỏ hơn để đảm bảo toàn bộ lưới vừa màn hình
    let cellSize = Math.min(cellSizeByWidth, cellSizeByHeight);

    // Giới hạn kích thước ô trong khoảng hợp lý
    cellSize = Math.max(cellSize, 25); // Tối thiểu 25px
    cellSize = Math.min(cellSize, 50); // Tối đa 50px

    return Math.floor(cellSize);
};

// Interface CellPosition cần định nghĩa trước khi sử dụng
interface CellPosition {
    row: number;
    col: number;
    layout?: LayoutRectangle;
}

// Cấu trúc dữ liệu level từ file JSON
interface NonogramLevel {
    title: string;
    colorgrid: number[][][];  // RGB values for each cell
    nonogrid: number[][];     // Puzzle solution grid (1 for filled, 0 for empty)
    difficulty: number;
}

// Utility functions
/**
 * Tính toán các gợi ý cho hàng hoặc cột từ một mảng các số
 * @param line Mảng các số 0 và 1 trong hàng/cột
 * @returns Mảng các số biểu thị các ô liên tiếp cần tô
 */
const calculateHints = (line: number[]): number[] => {
    const hints: number[] = [];
    let consecutiveCount = 0;

    for (let i = 0; i < line.length; i++) {
        if (line[i] === 1) {
            consecutiveCount++;
        } else if (consecutiveCount > 0) {
            hints.push(consecutiveCount);
            consecutiveCount = 0;
        }
    }

    if (consecutiveCount > 0) {
        hints.push(consecutiveCount);
    }

    return hints.length > 0 ? hints : [0];
};

/**
 * Tự động tính toán tất cả các gợi ý hàng cho một puzzle
 * @param puzzle Ma trận các số 0 và 1 biểu thị puzzle
 * @returns Mảng 2D chứa các gợi ý cho mỗi hàng
 */
const calculateRowHints = (puzzle: number[][]): number[][] => {
    return puzzle.map(row => calculateHints(row));
};

/**
 * Tự động tính toán tất cả các gợi ý cột cho một puzzle
 * @param puzzle Ma trận các số 0 và 1 biểu thị puzzle
 * @returns Mảng 2D chứa các gợi ý cho mỗi cột
 */
const calculateColHints = (puzzle: number[][]): number[][] => {
    const colHints: number[][] = [];
    for (let col = 0; col < puzzle[0].length; col++) {
        const colValues = puzzle.map(row => row[col]);
        colHints.push(calculateHints(colValues));
    }
    return colHints;
};

// Component Nonogram sử dụng dữ liệu từ file JSON
const Nonogram = () => {
    // State để lưu level hiện tại
    const [level, setLevel] = useState(0); // Changed from 200 to start at first level

    // Tạo key để buộc component re-render khi chuyển level
    const [renderKey, setRenderKey] = useState(0);

    // Thêm state quản lý mạng sống và trạng thái game
    const [lives, setLives] = useState(3);
    const [gameStatus, setGameStatus] = useState(GAME_STATUS.PLAYING);
    console.log('AAAAAAAAAAAAAAA')

    // Lấy levels từ file JSON
    const levels: NonogramLevel[] = useMemo(() => nonogramLevels as NonogramLevel[], []);

    // Lấy mẫu puzzle dựa trên level hiện tại
    const puzzle = useMemo(() => levels[level]?.nonogrid || [], [level, levels]);

    // State for hints
    const [hintsRemaining, setHintsRemaining] = useState(3);

    // State để lưu solution của người chơi (khởi tạo dựa trên kích thước puzzle)
    const [solution, setSolution] = useState(
        Array(puzzle.length).fill(null).map(() => Array(puzzle[0].length).fill(CELL_STATES.EMPTY))
    );

    // State để lưu trữ vị trí và kích thước các ô
    const [lastToggledCell, setLastToggledCell] = useState<{ row: number; col: number } | null>(null);
    const [currentMarkValue, setCurrentMarkValue] = useState<number>(CELL_STATES.EMPTY);

    // Lấy mẫu màu sắc dựa trên level hiện tại
    const colorGrid = useMemo(() => levels[level]?.colorgrid || [], [level, levels]);

    // State để lưu trữ các ô đánh sai và trạng thái thực tế của chúng
    const [wrongCells, setWrongCells] = useState<{ row: number; col: number; correctValue: number; actualState: number }[]>([]);

    // Hẹn giờ ẩn các ô sai sau một khoảng thời gian
    const wrongCellsTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Hàm xử lý khi người chơi chọn sai ô
    const handleWrongCell = useCallback((row: number, col: number) => {
        // Giảm mạng sống
        const newLives = lives - 1;
        setLives(newLives);

        // Lưu trạng thái thực tế mà người chơi đã đánh
        const actualState = solution[row][col];

        // Thêm ô sai vào danh sách để hiển thị đáp án đúng với nền màu hồng
        setWrongCells(prev => [...prev, {
            row,
            col,
            correctValue: puzzle[row][col] === 1 ? CELL_STATES.FILLED : CELL_STATES.MARKED,
            actualState: actualState // Lưu trạng thái thực tế để khôi phục sau khi hiệu ứng kết thúc
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

        // Kiểm tra nếu hết mạng thì game over ngay lập tức
        if (newLives <= 0) {
            setGameStatus(GAME_STATUS.FAILED);
        }
    }, [lives, puzzle, solution, wrongCells]);

    // Tính toán kích thước ô dựa trên kích thước puzzle
    const CELL_SIZE = useMemo(() => {
        if (puzzle.length > 0 && puzzle[0].length > 0) {
            return calculateCellSize(puzzle[0].length, puzzle.length);
        }
        return Math.floor(width / 8); // Giá trị mặc định
    }, [puzzle]);

    // Tính toán font size cho gợi ý dựa trên kích thước ô
    const HINT_FONT_SIZE = Math.floor(CELL_SIZE * 0.5);

    // Tham chiếu để lưu trữ thông tin vị trí và kích thước các ô
    const cellPositionsRef = useRef<{ [key: string]: CellPosition }>({});

    // Tham chiếu để lưu trữ thông tin về vùng lưới
    const gridRef = useRef<{ x: number, y: number, width: number, height: number } | null>(null);


    // Game state
    const [isComplete, setIsComplete] = useState(false);
    const [markMode, setMarkMode] = useState(MARK_MODES.FILL); // Using constants

    // Tự động tính toán gợi ý hàng và cột từ puzzle
    const rowHints = calculateRowHints(puzzle);
    const colHints = calculateColHints(puzzle);

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

    // Hàm kiểm tra và tự động đánh dấu X cho các hàng và cột đã hoàn thành
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
    }, [puzzle, rowHints, colHints, setSolution]);

    // Hàm để điền các ô bị bỏ qua khi vuốt nhanh
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

        // Thuật toán Bresenham để vẽ đường thẳng, ứng dụng trực tiếp lên newSolution
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

            // Kiểm tra xem ô có hợp lệ không và cập nhật trực tiếp
            if (currentRow >= 0 && currentRow < puzzle.length &&
                currentCol >= 0 && currentCol < puzzle[0].length) {

                // Xử lý cho từng ô riêng biệt, mỗi ô sai sẽ trừ 1 mạng
                let isWrongMove = false;

                // Trường hợp 1: Chế độ tô đen
                if (markMode === MARK_MODES.FILL) {
                    if (puzzle[currentRow][currentCol] === 1) {
                        // Đúng: Ô này nên tô đen
                        newSolution[currentRow][currentCol] = CELL_STATES.FILLED;
                    } else {
                        // Sai: Ô này không nên tô đen - chuyển sang MARKED_WRONG (X nền hồng)
                        newSolution[currentRow][currentCol] = CELL_STATES.MARKED_WRONG;
                        isWrongMove = true;
                        wrongCellCount++; // Tăng số đếm ô sai
                    }
                }
                // Trường hợp 2: Chế độ đánh X
                else {
                    if (puzzle[currentRow][currentCol] === 0) {
                        // Đúng: Ô này nên đánh X
                        newSolution[currentRow][currentCol] = CELL_STATES.MARKED;
                    } else {
                        // Sai: Ô này không nên đánh X - chuyển sang FILLED_WRONG (tô hồng)
                        newSolution[currentRow][currentCol] = CELL_STATES.FILLED_WRONG;
                        isWrongMove = true;
                        wrongCellCount++; // Tăng số đếm ô sai
                    }
                }
            }
        }

        // Cập nhật solution một lần duy nhất khi đã hoàn tất
        setSolution(newSolution);

        // Trừ mạng dựa vào số ô sai - CHỈ THỰC HIỆN MỘT LẦN sau khi xử lý tất cả các ô
        if (wrongCellCount > 0) {
            // Tính toán số mạng còn lại
            const newLives = Math.max(0, lives - wrongCellCount);
            setLives(newLives);

            // Kiểm tra nếu hết mạng thì game over
            if (newLives <= 0) {
                setGameStatus(GAME_STATUS.FAILED);
            }
        }

        return newSolution;
    }, [puzzle, solution, lives, setSolution, markMode, setLives, setGameStatus]);

    // Toggle cell state based on current mark mode
    const toggleCell = (row: number, col: number) => {
        const newSolution = [...solution];

        // Trường hợp 1: Chế độ tô đen
        if (markMode === MARK_MODES.FILL) {
            if (puzzle[row][col] === 1) {
                // Đúng: Ô này nên tô đen - chuyển đổi giữa empty và filled
                newSolution[row][col] = newSolution[row][col] === CELL_STATES.FILLED
                    ? CELL_STATES.EMPTY
                    : CELL_STATES.FILLED;
            } else {
                // Sai: Ô này không nên tô đen - trừ mạng và chuyển sang MARKED_WRONG (X nền hồng)
                newSolution[row][col] = CELL_STATES.MARKED_WRONG;
                // Giảm mạng sống
                const newLives = lives - 1;
                setLives(newLives);

                // Kiểm tra nếu hết mạng thì game over ngay lập tức
                if (newLives <= 0) {
                    setGameStatus(GAME_STATUS.FAILED);
                }
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
                // Sai: Ô này không nên đánh X - trừ mạng và chuyển sang FILLED_WRONG (tô hồng)
                newSolution[row][col] = CELL_STATES.FILLED_WRONG;
                // Giảm mạng sống
                const newLives = lives - 1;
                setLives(newLives);

                // Kiểm tra nếu hết mạng thì game over ngay lập tức
                if (newLives <= 0) {
                    setGameStatus(GAME_STATUS.FAILED);
                }
            }
        }

        // Cập nhật solution với trạng thái mới
        setSolution(newSolution);

        // Kiểm tra và tự động đánh dấu X sau khi cập nhật ô
        autoMarkCompletedLines(newSolution, row, col);
    };

    // Function to provide a hint - fill a random empty cell
    const giveHint = useCallback(() => {
        if (hintsRemaining <= 0 || isComplete || gameStatus === GAME_STATUS.FAILED) {
            return;
        }

        // Find all empty cells
        const emptyCells: { row: number, col: number }[] = [];
        for (let row = 0; row < puzzle.length; row++) {
            for (let col = 0; col < puzzle[0].length; col++) {
                if (solution[row][col] === CELL_STATES.EMPTY) {
                    emptyCells.push({ row, col });
                }
            }
        }

        // If there are no empty cells, do nothing
        if (emptyCells.length === 0) {
            return;
        }

        // Choose a random empty cell
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const { row, col } = emptyCells[randomIndex];

        // Fill the cell with the correct value
        const newSolution = [...solution];
        if (puzzle[row][col] === 1) {
            newSolution[row][col] = CELL_STATES.FILLED;
        } else {
            newSolution[row][col] = CELL_STATES.MARKED;
        }

        setSolution(newSolution);
        setHintsRemaining(prev => prev - 1);

        // Check and auto-mark completed lines for the specific row and column that was modified
        autoMarkCompletedLines(newSolution, row, col);
    }, [puzzle, solution, hintsRemaining, isComplete, gameStatus, autoMarkCompletedLines]);

    // PanResponder definition - moved down after all its dependencies are defined
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
                    const { row, col } = cellTouched;
                    let newValue;

                    // Trường hợp 1: Chế độ tô đen
                    if (markMode === MARK_MODES.FILL) {
                        if (puzzle[row][col] === 1) {
                            // Đúng: Ô này nên tô đen - chuyển đổi giữa empty và filled
                            newValue = solution[row][col] === CELL_STATES.FILLED
                                ? CELL_STATES.EMPTY
                                : CELL_STATES.FILLED;
                        } else {
                            // Sai: Ô này không nên tô đen - chuyển sang MARKED_WRONG (X nền hồng)
                            newValue = CELL_STATES.MARKED_WRONG;
                            // Giảm mạng sống
                            const newLives = lives - 1;
                            setLives(newLives);

                            // Kiểm tra nếu hết mạng thì game over ngay lập tức
                            if (newLives <= 0) {
                                setGameStatus(GAME_STATUS.FAILED);
                            }
                        }
                    }
                    // Trường hợp 2: Chế độ đánh X
                    else {
                        if (puzzle[row][col] === 0) {
                            // Đúng: Ô này nên đánh X - chuyển đổi giữa empty và marked
                            newValue = solution[row][col] === CELL_STATES.MARKED
                                ? CELL_STATES.EMPTY
                                : CELL_STATES.MARKED;
                        } else {
                            // Sai: Ô này không nên đánh X - chuyển sang FILLED_WRONG (tô hồng)
                            newValue = CELL_STATES.FILLED_WRONG;
                            // Giảm mạng sống
                            const newLives = lives - 1;
                            setLives(newLives);

                            // Kiểm tra nếu hết mạng thì game over ngay lập tức
                            if (newLives <= 0) {
                                setGameStatus(GAME_STATUS.FAILED);
                            }
                        }
                    }

                    // Đặt giá trị đánh dấu hiện tại để sử dụng cho các ô tiếp theo khi vuốt
                    setCurrentMarkValue(newValue);

                    // Cập nhật trạng thái ô
                    const newSolution = [...solution];
                    newSolution[row][col] = newValue;
                    setSolution(newSolution);

                    // Kiểm tra và tự động đánh dấu X cho hàng và cột vừa cập nhật
                    autoMarkCompletedLines(newSolution, row, col);

                    // Lưu ô cuối cùng được xử lý để theo dõi vuốt
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

                    if (lastToggledCell.row !== row || lastToggledCell.col !== col) {
                        const newSolution = fillSkippedCells(lastToggledCell, cellTouched);

                        // Kiểm tra và tự động đánh dấu X cho hàng và cột vừa cập nhật
                        if (newSolution) {
                            autoMarkCompletedLines(newSolution, row, col);
                        }

                        setLastToggledCell({ row, col });
                    }
                }
            },

            onPanResponderRelease: (_evt, _gestureState) => {
                if (lastToggledCell) {
                    setLastToggledCell(null);
                    // Don't call autoMarkCompletedLines with solution directly here
                    // as it creates a TypeScript error due to solution being used before declaration
                }
            },

            onPanResponderTerminate: (_evt, _gestureState) => {
                if (lastToggledCell) {
                    setLastToggledCell(null);
                }
            },
        }),
        [solution, markMode, isComplete, gameStatus, currentMarkValue, lastToggledCell, autoMarkCompletedLines, findCellAtPosition, fillSkippedCells]
    );

    // Check if the puzzle is solved
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
        setHintsRemaining(3); // Reset the number of hints for the new level
        setGameStatus(GAME_STATUS.PLAYING);
        setRenderKey(prev => prev + 1);
        cellPositionsRef.current = {};
    }, [level, levels]);

    // Reset vào cùng một level
    const resetLevel = useCallback(() => {
        setSolution(Array(puzzle.length).fill(null).map(() =>
            Array(puzzle[0].length).fill(CELL_STATES.EMPTY)
        ));
        setIsComplete(false);
        setLives(3);
        setHintsRemaining(3); // Reset hints when resetting the level
        setGameStatus(GAME_STATUS.PLAYING);
    }, [puzzle]);

    // Update solution khi puzzle thay đổi
    useEffect(() => {
        setSolution(Array(puzzle.length).fill(null).map(() => Array(puzzle[0].length).fill(CELL_STATES.EMPTY)));
    }, [puzzle]);

    // Render a cell với hỗ trợ layout để lưu vị trí
    const renderCell = (row: number, col: number) => {
        let backgroundColor = '#F8F8F8';
        let borderColor = '#CCCCCC';
        let content = null;

        if (isComplete) {
            // Hiển thị màu hoàn thành
            const rgbColor = colorGrid[row][col];
            if (rgbColor && rgbColor.length === 3) {
                backgroundColor = `rgb(${Math.round(rgbColor[0])}, ${Math.round(rgbColor[1])}, ${Math.round(rgbColor[2])})`;
            } else {
                backgroundColor = '#333333';
            }
        } else {
            // Hiển thị trạng thái ô dựa vào 4 trạng thái có thể có
            switch (solution[row][col]) {
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

        // Lưu vị trí ô vào ref
        const cellKey = `${row}-${col}`;
        if (!cellPositionsRef.current[cellKey]) {
            cellPositionsRef.current[cellKey] = { row, col };
        }

        return (
            <View
                key={`cell-${row}-${col}`}
                style={[
                    styles.cell,
                    {
                        backgroundColor,
                        borderColor,
                        width: CELL_SIZE,
                        height: CELL_SIZE,
                    },
                ]}
                onLayout={(event) => {
                    // Lưu thông tin layout của ô với các tọa độ tuyệt đối
                    event.target.measure((_, __, cellWidth, cellHeight, pageX, pageY) => {
                        cellPositionsRef.current[cellKey] = {
                            ...cellPositionsRef.current[cellKey],
                            layout: {
                                x: pageX,
                                y: pageY,
                                width: cellWidth,
                                height: cellHeight,
                            }
                        };
                    });
                }}
            >
                {content}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} key={renderKey}>
            <StatusBar backgroundColor="#4A6572" barStyle="light-content" />

            <View style={styles.header}>
                <Text style={styles.headerText}>Nonogram</Text>
                <Text style={styles.levelText}>Level: {level + 1} / {levels.length}</Text>
                <Text style={styles.livesText}>Lives: {lives}</Text>
            </View>

            {gameStatus === GAME_STATUS.FAILED && (
                <View style={[styles.completeBanner, { backgroundColor: '#F44336' }]}>
                    <Text style={styles.completeText}>Game Over</Text>
                    <Text style={styles.completeSub}>Bạn đã hết mạng!</Text>
                    <TouchableOpacity
                        style={[styles.nextLevelButton, { backgroundColor: '#D32F2F' }]}
                        onPress={resetLevel}
                    >
                        <Text style={styles.nextLevelButtonText}>Chơi lại</Text>
                    </TouchableOpacity>
                </View>
            )}

            {isComplete && (
                <View style={styles.completeBanner}>
                    <Text style={styles.completeText}>{levels[level].title}</Text>
                    <TouchableOpacity
                        style={styles.nextLevelButton}
                        onPress={goToNextLevel}
                    >
                        <Text style={styles.nextLevelButtonText}>Next Level</Text>
                    </TouchableOpacity>
                </View>
            )}

            <View style={styles.puzzleContainer}>
                <View
                    style={[
                        styles.cornerSpace,
                        { width: CELL_SIZE * 1.5, height: CELL_SIZE * 2 },
                    ]}
                />

                <View style={[styles.colHintsContainer, { marginLeft: CELL_SIZE * 1.5 }]}>
                    {colHints.map((hints, colIndex) => (
                        <View
                            key={`col-hint-${colIndex}`}
                            style={[
                                styles.colHint,
                                {
                                    width: CELL_SIZE,
                                    height: CELL_SIZE * 2,
                                },
                            ]}
                        >
                            <View style={styles.colHintInner}>
                                {hints.map((hint, i) => (
                                    <Text
                                        key={`col-hint-${colIndex}-${i}`}
                                        style={[styles.hintText, { fontSize: HINT_FONT_SIZE }]}
                                    >
                                        {hint}
                                    </Text>
                                ))}
                            </View>
                        </View>
                    ))}
                </View>

                <View
                    style={styles.gridAndRowHints}
                    {...panResponder.panHandlers}
                    onLayout={(event) => {
                        const layout = event.nativeEvent.layout;
                        gridRef.current = {
                            x: layout.x,
                            y: layout.y,
                            width: layout.width,
                            height: layout.height,
                        };
                    }}
                >
                    {rowHints.map((hints, rowIndex) => (
                        <View key={`row-${rowIndex}`} style={styles.row}>
                            <View
                                style={[
                                    styles.rowHint,
                                    { width: CELL_SIZE * 1.5, height: CELL_SIZE },
                                ]}
                            >
                                {hints.map((hint, i) => (
                                    <Text
                                        key={`row-hint-${rowIndex}-${i}`}
                                        style={[styles.hintText, { fontSize: HINT_FONT_SIZE }]}
                                    >
                                        {hint}
                                    </Text>
                                ))}
                            </View>

                            {Array.from({ length: puzzle[0]?.length || 0 }).map((_, colIndex) => (
                                <TouchableOpacity
                                    key={`cell-container-${rowIndex}-${colIndex}`}
                                    style={styles.cellContainer}
                                    onPress={() => {
                                        if (!isComplete && gameStatus !== GAME_STATUS.FAILED) {
                                            toggleCell(rowIndex, colIndex);
                                        }
                                    }}
                                    activeOpacity={0.7}
                                >
                                    {renderCell(rowIndex, colIndex)}
                                </TouchableOpacity>
                            ))}
                        </View>
                    ))}
                </View>
            </View>

            <View style={styles.modeSelector}>
                <Text style={[styles.modeText, markMode === 0 ? styles.activeMode : null]}>Tô đen</Text>
                <Switch
                    trackColor={{ false: '#4A6572', true: '#E57373' }}
                    thumbColor={markMode === 0 ? '#333333' : '#FF5252'}
                    onValueChange={() => setMarkMode(markMode === 0 ? 1 : 0)}
                    value={markMode === 1}
                    style={styles.modeSwitch}
                />
                <Text style={[styles.modeText, markMode === 1 ? styles.activeMode : null]}>Đánh X</Text>
            </View>

            <View style={styles.controls}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={resetLevel}
                >
                    <Text style={styles.buttonText}>Reset</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.button,
                        { backgroundColor: hintsRemaining > 0 ? '#4A6572' : '#9E9E9E' }
                    ]}
                    onPress={giveHint}
                    disabled={hintsRemaining <= 0 || isComplete || gameStatus === GAME_STATUS.FAILED}
                >
                    <Text style={styles.buttonText}>Gợi ý ({hintsRemaining})</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    header: {
        width: '100%',
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
    },
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000000',
    },
    levelText: {
        fontSize: 16,
        color: '#757575',
        marginTop: 5,
    },
    livesText: {
        fontSize: 16,
        color: '#E57373',
        marginTop: 5,
    },
    puzzleContainer: {
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        paddingTop: -50,
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
    colHint: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: '#E0F7FA',
        borderRadius: 0,
        margin: 0,
    },
    colHintInner: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: '100%',
    },
    gridAndRowHints: {
        flexDirection: 'column',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowHint: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: 5,
        backgroundColor: '#E0F7FA',
        borderRadius: 0,
        margin: 0,
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
    hintText: {
        fontWeight: 'bold',
        color: '#37474F',
        marginHorizontal: 2,
    },
    completeBanner: {
        backgroundColor: '#66BB6A',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginBottom: 15,
        alignItems: 'center',
    },
    completeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 5,
    },
    completeSub: {
        fontSize: 16,
        color: '#FFFFFF',
    },
    nextLevelButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#FFFFFF',
        marginTop: 8,
    },
    nextLevelButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    controls: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'center',
    },
    button: {
        backgroundColor: '#4A6572',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        margin: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    tooltip: {
        backgroundColor: '#FFF9C4',
        padding: 10,
        borderRadius: 8,
        marginTop: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    tooltipText: {
        color: '#5D4037',
        fontSize: 14,
        fontWeight: '500',
    },
    footer: {
        width: '100%',
        padding: 15,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 14,
        color: '#757575',
    },
    modeSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        paddingVertical: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    modeText: {
        fontSize: 14,
        color: '#757575',
        marginHorizontal: 8,
        fontWeight: '500',
    },
    activeMode: {
        color: '#4A6572',
        fontWeight: 'bold',
    },
    modeSwitch: {
        transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
    },
    cellContainer: {
        marginHorizontal: 0,
    },
});

export default Nonogram;
