import { useCallback } from 'react';
import { useGameContext } from '../../context/GameContext';
import { SCORE_CONFIG } from '../../constants/gameConstants';

/**
 * Hook quản lý việc tính điểm trong game
 */
export const useScoreCalculator = () => {
  const { state } = useGameContext();
  const { level, currentQuestion, levelScore } = state;

  /**
   * Tính điểm thưởng cho câu trả lời đúng
   */
  const calculateCorrectScore = useCallback(() => {
    const levelConfig = SCORE_CONFIG[level as keyof typeof SCORE_CONFIG] || SCORE_CONFIG[1];
    return levelConfig.baseCorrect + (currentQuestion - 1) * levelConfig.incrementCorrect;
  }, [level, currentQuestion]);

  /**
   * Tính điểm phạt cho câu trả lời sai
   */
  const calculateWrongScore = useCallback(() => {
    const levelConfig = SCORE_CONFIG[level as keyof typeof SCORE_CONFIG] || SCORE_CONFIG[1];
    return levelConfig.baseWrong + (currentQuestion - 1) * levelConfig.incrementWrong;
  }, [level, currentQuestion]);

  /**
   * Lấy thống kê điểm của người chơi
   */
  const getScoreStatistics = useCallback(() => {
    return {
      currentScore: levelScore,
      correctAnswers: state.correctAnswersInLevel,
      wrongAnswers: state.wrongAnswersInLevel,
      totalAttempts: state.totalAttempts
    };
  }, [levelScore, state.correctAnswersInLevel, state.wrongAnswersInLevel, state.totalAttempts]);

  return {
    calculateCorrectScore,
    calculateWrongScore,
    getScoreStatistics,
    currentScore: levelScore
  };
};