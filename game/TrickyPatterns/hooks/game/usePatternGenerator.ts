import { useCallback } from 'react';
import { useGameContext } from '../../context/GameContext';
import { generatePatternForLevel } from '../../utils/patternGenerator';
import { ActionTypes } from '../../types/gameTypes';

/**
 * Hook quản lý việc tạo các mẫu pattern cho game
 */
export const usePatternGenerator = () => {
  const { state, dispatch } = useGameContext();

  /**
   * Tạo một pattern mới dựa trên level và questionIndex hiện tại
   */
  const generateNewPattern = useCallback(() => {
    // Check if we've reached the end of the level
    if (state.questionIndex > 6) {
      // Show level complete screen instead of generating a new pattern
      dispatch({ type: ActionTypes.SHOW_LEVEL_COMPLETE });
      return;
    }

    dispatch({ type: ActionTypes.GENERATE_NEW_PATTERN });
  }, [dispatch, state.questionIndex]);

  /**
   * Khởi tạo pattern ban đầu cho một level
   */
  const initializePatternForLevel = useCallback((newLevel: number) => {
    const pattern = generatePatternForLevel(newLevel, 0);
    dispatch({
      type: ActionTypes.SET_CURRENT_PATTERN,
      payload: pattern
    });
  }, [dispatch]);

  /**
   * Cập nhật pattern dựa trên thông số đã cho
   */
  const updatePattern = useCallback((targetLevel: number, targetIndex: number) => {
    // Make sure targetIndex is within valid range (0-6)
    const safeIndex = Math.min(targetIndex, 6);

    const pattern = generatePatternForLevel(targetLevel, safeIndex);
    dispatch({
      type: ActionTypes.SET_CURRENT_PATTERN,
      payload: pattern
    });
  }, [dispatch]);

  return {
    generateNewPattern,
    initializePatternForLevel,
    updatePattern,
    currentPattern: state.currentPattern
  };
};