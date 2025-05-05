import { useCallback } from 'react';
import { useGameContext } from '../../context/GameContext';
import { ActionTypes } from '../../types/gameTypes';
import { GAME_CONSTANTS } from '../../constants/gameConstants';

/**
 * Hook quản lý các level của game
 */
export const useLevelManager = () => {
  const { state, dispatch } = useGameContext();

  /**
   * Hoàn thành level hiện tại và chuyển sang level tiếp theo
   */
  const completeLevel = useCallback(() => {
    dispatch({ type: ActionTypes.HIDE_LEVEL_COMPLETE });
    dispatch({ type: ActionTypes.LEVEL_UP });
  }, [dispatch]);

  /**
   * Đánh dấu level hiện tại thất bại và khởi động lại
   */
  const failLevel = useCallback(() => {
    dispatch({ type: ActionTypes.HIDE_LEVEL_FAILED });
  }, [dispatch]);

  /**
   * Đánh dấu hoàn thành toàn bộ game
   */
  const completeGame = useCallback(() => {
    dispatch({ type: ActionTypes.SET_GAME_COMPLETED, payload: false });
    // Reset về level 1
    dispatch({ type: ActionTypes.RESET_LEVEL });
  }, [dispatch]);

  /**
   * Khởi động lại level hiện tại
   */
  const restartLevel = useCallback(() => {
    dispatch({ type: ActionTypes.RESTART_GAME });
  }, [dispatch]);

  /**
   * Ghi nhận hết thời gian cho level hiện tại
   */
  const timeUp = useCallback(() => {
    dispatch({ type: ActionTypes.TIME_UP });
  }, [dispatch]);

  return {
    completeLevel,
    failLevel,
    completeGame,
    restartLevel,
    timeUp,
    currentLevel: state.level,
    isGameCompleted: state.gameCompleted,
    showLevelComplete: state.showLevelComplete,
    showLevelFailed: state.showLevelFailed,
    maxLevel: GAME_CONSTANTS.MAX_LEVEL,
    minQuestionsToWin: GAME_CONSTANTS.MIN_QUESTIONS_TO_WIN,
    currentQuestion: state.currentQuestion,
    questionIndex: state.questionIndex
  };
};