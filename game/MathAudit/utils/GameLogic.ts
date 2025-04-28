// filepath: d:\iq-game\game\MathAudit\utils\GameLogic.ts
import { MathEquation } from '../types';
import { generateEquationForCurrentLevel } from '../constants/gameData';

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
    LEVEL_TIME_LIMIT: 60, // seconds
    MAX_LEVEL: 10, // Maximum level in the game
    MIN_QUESTIONS_TO_WIN: 7, // Minimum question number to win the level
};

/**
 * Tính điểm dựa trên câu trả lời và cấp độ hiện tại
 * @param isCorrect Câu trả lời có đúng không
 * @param level Cấp độ hiện tại
 * @param currentQuestion Câu hỏi hiện tại
 * @returns Số điểm được thêm/trừ
 */
export const calculatePoints = (isCorrect: boolean, level: number, currentQuestion: number): number => {
    // Lấy cấu hình điểm cho cấp độ hiện tại
    const levelConfig = SCORE_CONFIG[level as keyof typeof SCORE_CONFIG] || SCORE_CONFIG[1];

    if (isCorrect) {
        // Tính điểm cộng dựa trên cấp độ và số câu hỏi
        return levelConfig.baseCorrect + (currentQuestion - 1) * levelConfig.incrementCorrect;
    } else {
        // Tính điểm trừ dựa trên cấp độ và số câu hỏi
        return levelConfig.baseWrong + (currentQuestion - 1) * levelConfig.incrementWrong;
    }
};

/**
 * Tạo phương trình mới cho cấp độ hiện tại
 * @param level Cấp độ hiện tại
 * @returns Phương trình mới
 */
export const generateNewEquation = (level: number): MathEquation => {
    return generateEquationForCurrentLevel(level);
};

/**
 * Tính tỷ lệ thành công dựa trên số câu trả lời đúng và tổng số câu đã trả lời
 * @param correctAnswers Số câu trả lời đúng
 * @param totalAttempts Tổng số câu đã trả lời
 * @returns Tỷ lệ thành công (%)
 */
export const calculateSuccessRate = (correctAnswers: number, totalAttempts: number): number => {
    if (totalAttempts <= 0) return 0;
    return Math.round((correctAnswers / totalAttempts) * 100);
};