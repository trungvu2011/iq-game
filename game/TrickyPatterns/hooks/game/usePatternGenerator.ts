import { useCallback } from 'react';
import { useGameContext } from '../../context/GameContext';
import { generatePatternForLevel } from '../../utils/patternGenerator';
import { ActionTypes } from '../../types/gameTypes';

/**
 * Hook quản lý việc tạo các mẫu pattern cho game
 */
export const usePatternGenerator = () => {
  const { state, dispatch } = useGameContext();
  const { level, questionIndex } = state;

  /**
   * Tạo một pattern mới dựa trên level và questionIndex hiện tại
   */
  const generateNewPattern = useCallback(() => {
    dispatch({ type: ActionTypes.GENERATE_NEW_PATTERN });
  }, [dispatch]);

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
    const pattern = generatePatternForLevel(targetLevel, targetIndex);
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