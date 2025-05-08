export const HEX_GRID_CONFIG = [
  [3, 2, 3],
  [3, 3, 4],
  [3, 4, 4],
  [3, 4, 4],
  [3, 5, 4],
  [4, 5, 4],
  [4, 6, 5],
  [4, 6, 5],
  [5, 6, 5],
  [5, 6, 5],
  [6, 6, 5],
  [6, 6, 5],
  [6, 7, 5],
  [6, 8, 5]
]

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
  QUESTIONS_TO_COMPLETE_LEVEL: 5,
  MIN_QUESTIONS_TO_WIN: 5, // Số câu hỏi tối thiểu để hoàn thành cấp độ
  MAX_LEVEL: 10, // Cấp độ tối đa
  LEVEL_TIME_LIMITS: 60,
};