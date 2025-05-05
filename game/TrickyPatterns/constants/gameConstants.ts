/**
 * Các hằng số được sử dụng trong game TrickyPatterns
 */

/**
 * Định nghĩa kiểu màu sắc cho các chấm
 */
export type Color = 'red' | 'blue' | 'green' | '#ADD8E6' | '#90EE90';

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
    [2, 2], // Câu hỏi 1
    [3, 3], // Câu hỏi 2
    [4, 3], // Câu hỏi 3
    [4, 4], // Câu hỏi 4
    [5, 5], // Câu hỏi 5
    [5, 5], // Câu hỏi 6
    [5, 5], // Câu hỏi 7
    [5, 5], // Câu hỏi 8
    [5, 6], // Câu hỏi 9
    [6, 6], // Câu hỏi 10
    [6, 7], // Câu hỏi 11
    [6, 8], // Câu hỏi 12
    [7, 8], // Câu hỏi 13
    [7, 9], // Câu hỏi 14
    [8, 10], // Câu hỏi 15
    [8, 11], // Câu hỏi 16
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
];

/**
 * Các góc xoay có thể có (độ)
 */
export const ROTATION_ANGLES = [-90, 90, 180];