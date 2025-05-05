/**
 * Các hằng số được sử dụng trong game TrickyPatterns
 */

/**
 * Định nghĩa kiểu màu sắc cho các chấm
 */
export type Color = 'red' | 'blue' | 'green' | '#ADD8E6' | '#90EE90';

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

/**
 * Cấu hình điểm số theo cấp độ
 * Mỗi cấp độ có điểm cơ bản và mức tăng điểm khác nhau 
 */
export const SCORE_CONFIG = {
    1: { baseCorrect: 100, baseWrong: 96, incrementCorrect: 20, incrementWrong: 16 },
    2: { baseCorrect: 140, baseWrong: 128, incrementCorrect: 20, incrementWrong: 16 },
    3: { baseCorrect: 180, baseWrong: 168, incrementCorrect: 30, incrementWrong: 24 },
    4: { baseCorrect: 240, baseWrong: 216, incrementCorrect: 30, incrementWrong: 24 },
    5: { baseCorrect: 300, baseWrong: 264, incrementCorrect: 30, incrementWrong: 24 },
    6: { baseCorrect: 360, baseWrong: 312, incrementCorrect: 30, incrementWrong: 24 },
    7: { baseCorrect: 420, baseWrong: 360, incrementCorrect: 30, incrementWrong: 24 },
    8: { baseCorrect: 480, baseWrong: 408, incrementCorrect: 30, incrementWrong: 24 },
    9: { baseCorrect: 540, baseWrong: 460, incrementCorrect: 40, incrementWrong: 30 },
    10: { baseCorrect: 620, baseWrong: 520, incrementCorrect: 40, incrementWrong: 30 },
};

/**
 * Các hằng số của game
 */
export const GAME_CONSTANTS = {
    QUESTIONS_TO_COMPLETE_LEVEL: 7,
    MIN_QUESTIONS_TO_WIN: 7, // Số câu hỏi tối thiểu để hoàn thành cấp độ
    MAX_LEVEL: 10, // Cấp độ tối đa
    LEVEL_TIME_LIMITS: 60,
};