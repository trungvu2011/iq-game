import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
    View, Text, StyleSheet,
    TouchableOpacity, SafeAreaView, Dimensions,
    StatusBar, Switch,
    LayoutRectangle,
} from 'react-native';
import nonogramLevels from './nonogram_levels.json';

const { width, height } = Dimensions.get('window');

// Tính toán kích thước ô dựa trên kích thước màn hình và kích thước puzzle
const calculateCellSize = (puzzleWidth: number, puzzleHeight: number): number => {
    // Lấy kích thước màn hình khả dụng, trừ đi padding và không gian cho các gợi ý
    const availableWidth = width * 0.85; // Để lại không gian cho các gợi ý bên trái
    const availableHeight = height * 0.6; // Để lại không gian cho header, footer, controls

    // Tính toán kích thước ô dựa trên kích thước nhỏ hơn để đảm bảo toàn bộ bảng vừa màn hình
    const cellSizeByWidth = availableWidth / puzzleWidth;
    const cellSizeByHeight = availableHeight / puzzleHeight;

    // Lấy giá trị nhỏ hơn để đảm bảo toàn bộ bảng vừa màn hình
    let cellSize = Math.min(cellSizeByWidth, cellSizeByHeight);

    // Giới hạn kích thước ô trong một khoảng hợp lý
    cellSize = Math.max(cellSize, 25); // Tối thiểu 25
    cellSize = Math.min(cellSize, 50); // Tối đa 50

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

/**
 * Tính toán các gợi ý cho hàng hoặc cột từ một mảng các số
 * @param line Mảng các số 0 và 1 trong hàng/cột
 * @returns Mảng các số biểu thị các ô liên tiếp cần tô
 */
const calculateHints = (line: number[]): number[] => {
    // Mảng lưu trữ kết quả gợi ý
    const hints: number[] = [];

    // Biến đếm số ô liên tiếp
    let consecutiveCount = 0;

    // Duyệt qua từng ô trong hàng/cột
    for (let i = 0; i < line.length; i++) {
        // Nếu ô có giá trị 1, tăng biến đếm
        if (line[i] === 1) {
            consecutiveCount++;
        }
        // Nếu ô có giá trị 0 và đã có đếm ô liên tiếp trước đó
        else if (consecutiveCount > 0) {
            // Thêm số ô liên tiếp vào mảng gợi ý
            hints.push(consecutiveCount);
            // Reset biến đếm
            consecutiveCount = 0;
        }
    }

    // Kiểm tra nếu còn ô liên tiếp ở cuối hàng/cột
    if (consecutiveCount > 0) {
        hints.push(consecutiveCount);
    }

    // Trả về [0] nếu không có ô nào cần tô
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
    const [level, setLevel] = useState(0);

    // Tạo key để buộc component re-render khi chuyển level
    const [renderKey, setRenderKey] = useState(0);

    // Lấy levels từ file JSON
    const levels: NonogramLevel[] = useMemo(() => nonogramLevels as NonogramLevel[], []);

    // Lấy mẫu puzzle dựa trên level hiện tại
    const puzzle = useMemo(() => levels[level]?.nonogrid || [], [level, levels]);

    // Console.log nonogrid
    useEffect(() => {
        if (levels[level]?.nonogrid) {
            console.log('Current nonogrid:', levels[level].nonogrid);
        }
    }, [level, levels]);

    // Lấy mẫu màu sắc dựa trên level hiện tại
    const colorGrid = useMemo(() => levels[level]?.colorgrid || [], [level, levels]);

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

    // State để lưu solution của người chơi (khởi tạo dựa trên kích thước puzzle)
    const [solution, setSolution] = useState(
        Array(puzzle.length).fill(null).map(() => Array(puzzle[0].length).fill(0))
    );

    // Game state
    const [isComplete, setIsComplete] = useState(false);
    const [markMode, setMarkMode] = useState(0); // 0: Tô đen, 1: Đánh dấu X

    // Tự động tính toán gợi ý hàng và cột từ puzzle
    const rowHints = calculateRowHints(puzzle);
    const colHints = calculateColHints(puzzle);

    // Check if the puzzle is solved
    useEffect(() => {
        let correct = true;

        for (let row = 0; row < puzzle.length; row++) {
            for (let col = 0; col < puzzle[0].length; col++) {
                // If the cell should be filled but isn't, or shouldn't be filled but is
                if (
                    (puzzle[row][col] === 1 && solution[row][col] !== 1) ||
                    (puzzle[row][col] === 0 && solution[row][col] === 1)
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
    }, [solution, puzzle, isComplete]);

    // Đi đến level tiếp theo
    const goToNextLevel = useCallback(() => {
        const nextLevel = (level + 1) % levels.length;

        // Cập nhật level
        setLevel(nextLevel);

        // Reset solution với kích thước của puzzle mới
        setSolution(
            Array(levels[nextLevel].nonogrid.length).fill(null)
                .map(() => Array(levels[nextLevel].nonogrid[0].length).fill(0))
        );

        // Reset các state khác
        setIsComplete(false);

        // Force re-render toàn bộ component
        setRenderKey(prev => prev + 1);

        // Reset các tham chiếu
        cellPositionsRef.current = {};
    }, [level, levels]);

    // Reset vào cùng một level
    const resetLevel = () => {
        setSolution(Array(puzzle.length).fill(null).map(() => Array(puzzle[0].length).fill(0)));
        setIsComplete(false);
    };

    // Update solution khi puzzle thay đổi
    useEffect(() => {
        // Reset solution khi puzzle thay đổi
        setSolution(Array(puzzle.length).fill(null).map(() => Array(puzzle[0].length).fill(0)));
    }, [puzzle]);

    // Handle cell press với chế độ đánh dấu
    const toggleCell = (row: number, col: number) => {
        const newSolution = [...solution];
        // Dựa vào chế độ đánh dấu hiện tại
        if (markMode === 0) {
            // Chế độ tô đen: chuyển đổi giữa 0 (trống) và 1 (đen)
            newSolution[row][col] = newSolution[row][col] === 1 ? 0 : 1;
        } else {
            // Chế độ đánh dấu X: chuyển đổi giữa 0 (trống) và 2 (X)
            newSolution[row][col] = newSolution[row][col] === 2 ? 0 : 2;
        }

        setSolution(newSolution);

        // Kiểm tra và tự động đánh dấu X sau khi cập nhật ô
        autoMarkCompletedLines(newSolution);
    };

    // Hàm kiểm tra và tự động đánh dấu X cho các hàng và cột đã hoàn thành
    const autoMarkCompletedLines = (currentSolution: number[][]) => {
        const newSolution = [...currentSolution];
        let hasChanges = false;

        // Kiểm tra từng hàng
        for (let rowIndex = 0; rowIndex < puzzle.length; rowIndex++) {
            // Tính số ô cần tô đen trong hàng này từ gợi ý
            const requiredFilledCells = rowHints[rowIndex].reduce((sum, hint) => sum + hint, 0);

            // Đếm số ô đã tô đen trong hàng
            const filledCells = newSolution[rowIndex].filter(cell => cell === 1).length;

            // Nếu đã tô đủ số ô đen cần thiết
            if (filledCells === requiredFilledCells) {
                // Đánh dấu X vào các ô còn trống (chưa tô đen hoặc chưa đánh X)
                for (let colIndex = 0; colIndex < newSolution[rowIndex].length; colIndex++) {
                    if (newSolution[rowIndex][colIndex] === 0) {
                        newSolution[rowIndex][colIndex] = 2; // Đánh dấu X
                        hasChanges = true;
                    }
                }
            }
        }

        // Kiểm tra từng cột
        for (let colIndex = 0; colIndex < puzzle[0].length; colIndex++) {
            // Tính số ô cần tô đen trong cột này từ gợi ý
            const requiredFilledCells = colHints[colIndex].reduce((sum, hint) => sum + hint, 0);

            // Đếm số ô đã tô đen trong cột
            let filledCells = 0;
            for (let rowIndex = 0; rowIndex < puzzle.length; rowIndex++) {
                if (newSolution[rowIndex][colIndex] === 1) {
                    filledCells++;
                }
            }

            // Nếu đã tô đủ số ô đen cần thiết
            if (filledCells === requiredFilledCells) {
                // Đánh dấu X vào các ô còn trống (chưa tô đen hoặc chưa đánh X)
                for (let rowIndex = 0; rowIndex < puzzle.length; rowIndex++) {
                    if (newSolution[rowIndex][colIndex] === 0) {
                        newSolution[rowIndex][colIndex] = 2; // Đánh dấu X
                        hasChanges = true;
                    }
                }
            }
        }

        // Cập nhật solution nếu có thay đổi
        if (hasChanges) {
            setSolution(newSolution);
        }
    };

    // Render a cell với hỗ trợ layout để lưu vị trí
    const renderCell = (row: number, col: number) => {
        let backgroundColor = '#F8F8F8';
        let borderColor = '#CCCCCC';
        let content = null;

        // Sử dụng màu từ colorGrid khi puzzle hoàn thành, áp dụng cho tất cả các ô
        if (isComplete) {
            // Lấy màu RGB từ colorGrid và chuyển sang màu CSS, áp dụng cho tất cả các ô
            const rgbColor = colorGrid[row][col];
            if (rgbColor && rgbColor.length === 3) {
                backgroundColor = `rgb(${Math.round(rgbColor[0])}, ${Math.round(rgbColor[1])}, ${Math.round(rgbColor[2])})`;
            } else {
                backgroundColor = '#333333'; // Màu mặc định nếu không có dữ liệu màu
            }

            // Không hiển thị dấu X sau khi giải xong
        } else if (solution[row][col] === 1) {
            backgroundColor = '#333333';
        } else if (solution[row][col] === 2) {
            content = <Text style={styles.cellX}>X</Text>;

            // Add visual emphasis to cells with alternating patterns
            // to make the grid more readable
            const isEvenRow = row % 2 === 0;
            const isEvenCol = col % 2 === 0;
            const isEvenCell = (isEvenRow && isEvenCol) || (!isEvenRow && !isEvenCol);
            backgroundColor = isEvenCell ? '#F8F8F8' : '#F0F0F0';
        } else {
            // Add visual emphasis to cells with alternating patterns
            // to make the grid more readable
            const isEvenRow = row % 2 === 0;
            const isEvenCol = col % 2 === 0;
            const isEvenCell = (isEvenRow && isEvenCol) || (!isEvenRow && !isEvenCol);
            backgroundColor = isEvenCell ? '#F8F8F8' : '#F0F0F0';
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
                    // Lưu thông tin layout của ô
                    const layout = event.nativeEvent.layout;
                    cellPositionsRef.current[cellKey] = {
                        ...cellPositionsRef.current[cellKey],
                        layout,
                    };
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
                <Text style={styles.levelText}>Level: {level + 1}</Text>
            </View>

            {isComplete && (
                <View style={styles.completeBanner}>
                    <Text style={styles.completeText}>{levels[level].title}</Text>
                    <TouchableOpacity
                        style={styles.nextLevelButton}
                        onPress={goToNextLevel}
                    >
                        <Text style={styles.nextLevelButtonText}>Tiếp tục</Text>
                    </TouchableOpacity>
                </View>
            )}

            <View style={styles.puzzleContainer}>
                {/* Empty top-left corner */}
                <View
                    style={[
                        styles.cornerSpace,
                        { width: CELL_SIZE * 1.5, height: CELL_SIZE * 2 },
                    ]}
                />

                {/* Column hints - fixed alignment */}
                <View style={[styles.colHintsContainer, { marginLeft: CELL_SIZE * 1.5 }]}>
                    {colHints.map((hints, colIndex) => (
                        <View
                            key={`col-hint-${colIndex}`}
                            style={[
                                styles.colHint,
                                {
                                    width: CELL_SIZE,
                                    height: CELL_SIZE * 2,
                                    marginHorizontal: 1, // Ensure even spacing
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
                >
                    {/* Row hints and grid */}
                    {rowHints.map((hints, rowIndex) => (
                        <View key={`row-${rowIndex}`} style={styles.row}>
                            {/* Row hints */}
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

                            {/* Grid cells for this row */}
                            {puzzle[0].map((_, colIndex) => (
                                <TouchableOpacity
                                    key={`cell-container-${rowIndex}-${colIndex}`}
                                    style={{
                                        width: CELL_SIZE,
                                        height: CELL_SIZE,
                                        marginHorizontal: 1, // Match the column spacing
                                    }}
                                    onPress={() => {
                                        if (!isComplete) {
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

            {/* Nút gạt chuyển chế độ */}
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
        // marginLeft will be applied dynamically
    },
    colHint: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: '#E0F7FA',
        borderRadius: 4,
        margin: 1,
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
        borderRadius: 4,
        margin: 1,
    },
    cell: {
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 0, // Remove margin from cell to use container margin instead
        borderRadius: 2,
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
});

export default Nonogram;