import { Color, GRID_DOT_CONFIG, COLORS, ROTATION_ANGLES } from '../constants/gameConstants';
import { PatternData } from '../types/gameTypes';

/**
 * Tạo lưới trống với kích thước cho trước
 * @param size Kích thước của lưới vuông
 * @returns Lưới trống với tất cả các ô là 0
 */
function createEmptyGrid(size: number): number[][] {
    return Array.from({ length: size }, () => Array(size).fill(0));
}

/**
 * Xáo trộn một mảng sử dụng thuật toán Fisher-Yates
 * @param array Mảng cần xáo trộn
 * @returns Mảng mới đã được xáo trộn
 */
function shuffleArray<T>(array: T[]): T[] {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

/**
 * Đặt ngẫu nhiên số lượng chấm cụ thể vào lưới
 * @param gridSize Kích thước của lưới
 * @param numDots Số lượng chấm cần đặt
 * @returns Lưới với các chấm đã được đặt
 */
function placeRandomDots(gridSize: number, numDots: number): number[][] {
    const grid = createEmptyGrid(gridSize);
    const positions: [number, number][] = [];

    // Tạo danh sách tất cả các vị trí có thể
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            positions.push([i, j] as [number, number]);
        }
    }

    // Chọn ngẫu nhiên numDots vị trí từ danh sách đã xáo trộn
    const chosen = shuffleArray(positions).slice(0, numDots);

    // Đặt chấm vào các vị trí đã chọn
    for (const [i, j] of chosen) {
        grid[i][j] = 1;
    }

    return grid;
}

/**
 * Xoay lưới theo một góc nhất định
 * @param grid Lưới cần xoay
 * @param rotation Góc xoay (0, 90, 180, 270 độ)
 * @returns Lưới mới sau khi xoay
 */
function rotateGrid(grid: number[][], rotation: number): number[][] {
    const size = grid.length;
    if (rotation === 0) return grid.map(row => [...row]);

    const newGrid = createEmptyGrid(size);
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (rotation === 90) newGrid[j][size - i - 1] = grid[i][j];
            else if (rotation === 180) newGrid[size - i - 1][size - j - 1] = grid[i][j];
            else if (rotation === -90) newGrid[size - j - 1][i] = grid[i][j];
        }
    }

    return newGrid;
}

/**
 * Xoay color map theo một góc nhất định
 * @param colorMap Map màu cần xoay
 * @param gridSize Kích thước lưới
 * @param rotation Góc xoay (0, 90, 180, 270 độ)
 * @returns Map màu mới sau khi xoay
 */
function rotateColorMap(colorMap: Record<string, Color>, gridSize: number, rotation: number): Record<string, Color> {
    if (rotation === 0) return { ...colorMap };

    const newColorMap: Record<string, Color> = {};

    for (const key in colorMap) {
        const [i, j] = key.split(',').map(Number);
        let ni = i, nj = j;

        if (rotation === 90) {
            ni = j;
            nj = gridSize - 1 - i;
        } else if (rotation === 180) {
            ni = gridSize - 1 - i;
            nj = gridSize - 1 - j;
        } else if (rotation === -90) {
            ni = gridSize - 1 - j;
            nj = i;
        }

        newColorMap[`${ni},${nj}`] = colorMap[key];
    }

    return newColorMap;
}

/**
 * Tạo ra một màu ngẫu nhiên từ danh sách màu có sẵn
 * @returns Một màu ngẫu nhiên
 */
function randomColor(): Color {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
}

/**
 * Chuyển đổi grid và colorMap thành mảng màu sắc 2 chiều
 * @param grid Lưới biểu diễn vị trí các chấm (0 hoặc 1)
 * @param colorMap Map màu tương ứng với các vị trí có chấm
 * @returns Mảng 2 chiều chứa màu sắc ('transparent' nếu không có chấm)
 */
function convertToColorPattern(grid: number[][], colorMap: Record<string, Color>): string[][] {
    const size = grid.length;
    const pattern = Array(size).fill(0).map(() => Array(size).fill('transparent'));

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (grid[i][j] === 1) {
                const key = `${i},${j}`;
                pattern[i][j] = colorMap[key] || 'transparent';
            }
        }
    }

    return pattern;
}

/**
 * Tạo mẫu cho một cấp độ cụ thể
 * @param level Cấp độ (1-10)
 * @param questionIndex Chỉ số câu hỏi trong cấp độ (0-6 cho 7 câu hỏi mỗi cấp độ)
 * @returns PatternData - Kết quả mẫu cho cấp độ đã chọn
 */
export function generatePatternForLevel(level: number, questionIndex: number = 0): PatternData {
    console.log(`Generating pattern for level ${level}, question index ${questionIndex}`);

    // Kiểm tra tính hợp lệ của cấp độ và chỉ số câu hỏi
    if (level < 1 || level > 10) {
        throw new Error('Level must be between 1 and 10.');
    }
    if (questionIndex < 0 || questionIndex > 6) {
        throw new Error('Question index must be between 0 and 6.');
    }

    // Tính toán chỉ số cấu hình dựa trên level
    const startIndexForLevel = (level - 1);
    const configIndex = startIndexForLevel + questionIndex;

    // Đảm bảo chỉ số không vượt quá số lượng cấu hình có sẵn
    const safeConfigIndex = Math.min(configIndex, GRID_DOT_CONFIG.length - 1);

    // Lấy cấu hình tương ứng
    const [gridSize, numDots] = GRID_DOT_CONFIG[safeConfigIndex];

    // Tạo lưới A và map màu A
    const gridA = placeRandomDots(gridSize, numDots);
    const colorMapA: Record<string, Color> = {};

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (gridA[i][j] === 1) {
                colorMapA[`${i},${j}`] = randomColor();
            }
        }
    }

    // Quyết định hai lưới giống nhau hay khác nhau
    const isSame = Math.random() < 0.5;

    // Lưu vị trí khác biệt nếu có
    const differenceCoordinates: number[][] = [];

    let gridB: number[][];
    let colorMapB: Record<string, Color>;

    if (isSame) {
        // Lưới B giống hệt lưới A
        gridB = gridA.map(row => [...row]);
        colorMapB = { ...colorMapA };
    } else {
        // Tìm một vị trí để thay đổi
        const dots: [number, number][] = [];

        // Tìm tất cả các vị trí có chấm
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                if (gridA[i][j] === 1) dots.push([i, j] as [number, number]);
            }
        }

        if (dots.length > 0) {
            // Chọn ngẫu nhiên một chấm để di chuyển
            const removeIndex = Math.floor(Math.random() * dots.length);
            const removePos = dots[removeIndex];

            // Tìm các vị trí lân cận có thể di chuyển đến
            const neighbors: [number, number][] = [
                [removePos[0] - 1, removePos[1]],
                [removePos[0] + 1, removePos[1]],
                [removePos[0], removePos[1] - 1],
                [removePos[0], removePos[1] + 1],
                [removePos[0] - 1, removePos[1] - 1],
                [removePos[0] - 1, removePos[1] + 1],
                [removePos[0] + 1, removePos[1] - 1],
                [removePos[0] + 1, removePos[1] + 1],
            ].filter(([i, j]) => i >= 0 && j >= 0 && i < gridSize && j < gridSize && gridA[i][j] === 0) as [number, number][];

            if (neighbors.length > 0) {
                // Chọn ngẫu nhiên một vị trí lân cận để đặt chấm
                const addIndex = Math.floor(Math.random() * neighbors.length);
                const addPos = neighbors[addIndex];

                // Lưu lại vị trí thay đổi để hiển thị chênh lệch nếu cần
                differenceCoordinates.push(removePos);
                differenceCoordinates.push(addPos);

                // Tạo lưới mới với chấm đã được di chuyển
                gridB = gridA.map(row => [...row]);
                gridB[removePos[0]][removePos[1]] = 0;
                gridB[addPos[0]][addPos[1]] = 1;

                // Cập nhật map màu
                colorMapB = { ...colorMapA };
                const color = colorMapA[`${removePos[0]},${removePos[1]}`] || randomColor();
                delete colorMapB[`${removePos[0]},${removePos[1]}`];
                colorMapB[`${addPos[0]},${addPos[1]}`] = color;
            } else {
                // Không tìm thấy vị trí lân cận, giữ nguyên grid
                gridB = gridA.map(row => [...row]);
                colorMapB = { ...colorMapA };
            }
        } else {
            // Không có chấm nào trong grid, giữ nguyên
            gridB = gridA.map(row => [...row]);
            colorMapB = { ...colorMapA };
        }
    }

    // Quyết định góc xoay cho lưới B dựa vào cấu hình cấp độ
    const rotation = ROTATION_ANGLES[Math.floor(Math.random() * ROTATION_ANGLES.length)];

    // Xoay lưới B và map màu B
    const rotatedGridB = rotateGrid(gridB, rotation);
    const rotatedColorMapB = rotateColorMap(colorMapB, gridSize, rotation);

    // Chuyển đổi grid và colorMap sang định dạng mảng màu 2 chiều
    const pattern1 = convertToColorPattern(gridA, colorMapA);
    const pattern2 = convertToColorPattern(rotatedGridB, rotatedColorMapB);

    return {
        pattern1,
        pattern2,
        is_same: isSame,
        difference_coordinates: differenceCoordinates.length > 0 ? differenceCoordinates : undefined,
        rotation: rotation
    };
}