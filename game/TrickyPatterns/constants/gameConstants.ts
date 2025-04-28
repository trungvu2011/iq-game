/**
 * Các hằng số được sử dụng trong game TrickyPatterns
 */

/**
 * Định nghĩa kiểu màu sắc cho các chấm
 */
export type Color = 'red' | 'blue' | 'green' | '#ADD8E6' | '#90EE90' | '#FFA07A' | '#FFD700' | '#FF00FF' | '#00FFFF' | '#FFC0CB';

/**
 * Interface định nghĩa kết quả của việc tạo mẫu
 */
export interface PatternResult {
    grid_size: number;
    num_dots: number;
    grid_a: number[][];
    grid_b: number[][];
    is_same: boolean;
    rotation: number;
    color_map_a: Record<string, Color>;
    color_map_b: Record<string, Color>;
}

/**
 * Danh sách cấu hình các kích thước grid và số lượng chấm tương ứng cho mỗi câu hỏi
 * Mỗi mục là một cặp [kích thước grid, số lượng chấm]
 * Câu hỏi 1 sử dụng chỉ số 0, câu hỏi 2 sử dụng chỉ số 1, v.v.
 */
export const GRID_DOT_CONFIG: [number, number][] = [
    [3, 3],   // Câu hỏi 1
    [3, 4],   // Câu hỏi 2
    [4, 5],   // Câu hỏi 3
    [4, 6],   // Câu hỏi 4
    [4, 7],   // Câu hỏi 5
    [5, 8],   // Câu hỏi 6
    [5, 9],   // Câu hỏi 7
    [5, 10],  // Dự phòng
    [6, 11],  // Dự phòng
    [6, 12],  // Dự phòng
    [6, 13],  // Dự phòng
    [6, 14],  // Dự phòng
    [7, 15],  // Dự phòng
    [7, 16],  // Dự phòng
    [7, 17],  // Dự phòng
    [8, 18],  // Dự phòng
];

/**
 * Các màu sẵn có cho các chấm tròn
 */
export const COLORS: Color[] = [
    'red',
    'blue',
    'green',
    '#ADD8E6', // Light blue
    '#90EE90', // Light green
    '#FFA07A', // Light salmon
    '#FFD700', // Gold
    '#FF00FF', // Magenta
    '#00FFFF', // Cyan
    '#FFC0CB', // Pink
];

/**
 * Các góc xoay có thể có (độ)
 */
export const ROTATION_ANGLES = [-90, 90, 180];