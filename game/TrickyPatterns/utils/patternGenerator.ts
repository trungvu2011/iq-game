import { Color, PatternResult, GRID_DOT_CONFIG, COLORS, ROTATION_ANGLES } from '../constants/gameConstants';

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
            else if (rotation === 270) newGrid[size - j - 1][i] = grid[i][j];
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
        } else if (rotation === 270) {
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
 * Thay đổi vị trí của một chấm để tạo ra sự khác biệt giữa hai lưới
 * @param grid Lưới gốc
 * @param colorMap Map màu gốc
 * @returns Lưới mới và map màu mới sau khi di chuyển một chấm
 */
function swapOneDot(grid: number[][], colorMap: Record<string, Color>): [number[][], Record<string, Color>] {
    const size = grid.length;
    const dots: [number, number][] = [];

    // Tìm tất cả các vị trí có chấm
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (grid[i][j] === 1) dots.push([i, j] as [number, number]);
        }
    }

    if (dots.length === 0) return [grid, colorMap];

    // Chọn ngẫu nhiên một chấm để di chuyển
    const removePos = dots[Math.floor(Math.random() * dots.length)];

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
    ].filter(([i, j]) => i >= 0 && j >= 0 && i < size && j < size && grid[i][j] === 0) as [number, number][];

    // Nếu không tìm thấy vị trí lân cận, trả về lưới ban đầu
    if (neighbors.length === 0) return [grid, colorMap];

    // Chọn ngẫu nhiên một vị trí lân cận để đặt chấm
    const addPos = neighbors[Math.floor(Math.random() * neighbors.length)];

    // Tạo lưới mới với chấm đã được di chuyển
    const newGrid = grid.map(row => [...row]);
    newGrid[removePos[0]][removePos[1]] = 0;
    newGrid[addPos[0]][addPos[1]] = 1;

    // Cập nhật map màu
    const newColorMap = { ...colorMap };
    const color = newColorMap[`${removePos[0]},${removePos[1]}`] ?? randomColor();
    newColorMap[`${addPos[0]},${addPos[1]}`] = color;
    delete newColorMap[`${removePos[0]},${removePos[1]}`];

    return [newGrid, newColorMap];
}

/**
 * Thay đổi màu của một chấm để tạo ra sự khác biệt giữa hai lưới
 * @param grid Lưới gốc
 * @param colorMap Map màu gốc
 * @returns Lưới mới và map màu mới sau khi thay đổi màu một chấm
 */
function changeOneDotColor(grid: number[][], colorMap: Record<string, Color>): [number[][], Record<string, Color>] {
    const size = grid.length;
    const dots: [number, number][] = [];

    // Tìm tất cả các vị trí có chấm
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (grid[i][j] === 1) dots.push([i, j] as [number, number]);
        }
    }

    if (dots.length === 0) return [grid, colorMap];

    // Chọn ngẫu nhiên một chấm để thay đổi màu
    const pos = dots[Math.floor(Math.random() * dots.length)];
    const key = `${pos[0]},${pos[1]}`;

    // Tạo map màu mới
    const newColorMap = { ...colorMap };
    const currentColor = newColorMap[key] || randomColor();

    // Chọn màu mới khác với màu hiện tại
    let newColor: Color;
    do {
        newColor = randomColor();
    } while (newColor === currentColor);

    newColorMap[key] = newColor;

    return [grid.map(row => [...row]), newColorMap];
}

/**
 * Tạo mẫu cho một cấp độ cụ thể
 * @param level Cấp độ (1-10)
 * @param questionIndex Chỉ số câu hỏi trong cấp độ (0-6 cho 7 câu hỏi mỗi cấp độ)
 * @returns Kết quả mẫu cho cấp độ đã chọn
 */
export function generatePatternForLevel(level: number, questionIndex: number = 0): PatternResult {
    // Đảm bảo chỉ số câu hỏi nằm trong phạm vi hợp lệ (0-6)
    const safeQuestionIndex = Math.max(0, Math.min(questionIndex, 6));

    // Sử dụng chỉ số câu hỏi trực tiếp làm chỉ số của GRID_DOT_CONFIG
    // Chẳng hạn: câu hỏi 1 -> chỉ số 0, câu hỏi 2 -> chỉ số 1, v.v.
    const configIndex = safeQuestionIndex;

    // Đảm bảo chỉ số không vượt quá số lượng cấu hình
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

    let gridB: number[][];
    let colorMapB: Record<string, Color>;

    if (isSame) {
        // Lưới B giống hệt lưới A
        gridB = gridA.map(row => [...row]);
        colorMapB = { ...colorMapA };
    } else {
        [gridB, colorMapB] = swapOneDot(gridA, colorMapA);
    }

    // Quyết định góc xoay cho lưới B dựa vào cấu hình cấp độ
    const rotation = ROTATION_ANGLES[Math.floor(Math.random() * ROTATION_ANGLES.length)];

    // Xoay lưới B và map màu B
    const rotatedGridB = rotateGrid(gridB, rotation);
    const rotatedColorMapB = rotateColorMap(colorMapB, gridSize, rotation);

    return {
        grid_size: gridSize,
        num_dots: numDots,
        grid_a: gridA,
        grid_b: rotatedGridB,
        is_same: isSame,
        rotation: rotation,
        color_map_a: colorMapA,
        color_map_b: rotatedColorMapB
    };
}
