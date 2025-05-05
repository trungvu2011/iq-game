import { useEffect, useState, useCallback } from 'react';
import { useGameContext } from '../../context/GameContext';
import { ActionTypes } from '../../types/gameTypes';
import { GAME_CONSTANTS } from '../../constants/gameConstants';

/**
 * Hook quản lý thời gian trong game
 */
export const useTimer = () => {
  const { state, dispatch } = useGameContext();
  const { isPaused, timerResetTrigger, level } = state;

  // Hàm để lấy thời gian giới hạn cho level hiện tại
  const getLevelTimeLimit = useCallback((currentLevel: number): number => {
    return GAME_CONSTANTS.LEVEL_TIME_LIMITS;
  }, []);

  // State để lưu thời gian còn lại (tính bằng giây)
  const [timeRemaining, setTimeRemaining] = useState<number>(() => getLevelTimeLimit(level));

  /**
   * Reset bộ đếm thời gian
   */
  const resetTimer = useCallback(() => {
    dispatch({ type: ActionTypes.RESET_TIMER });
  }, [dispatch]);

  // Effect để xử lý bộ đếm thời gian
  useEffect(() => {
    // Đặt lại thời gian ban đầu khi level thay đổi hoặc timer được reset
    const initialTime = getLevelTimeLimit(level);
    setTimeRemaining(initialTime);

    // Khi không tạm dừng, tiếp tục đếm ngược
    let timerId: NodeJS.Timeout | null = null;

    if (!isPaused) {
      timerId = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Khi hết thời gian, thông báo cho game biết
            dispatch({ type: ActionTypes.TIME_UP });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    // Dọn dẹp interval khi component unmount hoặc dependencies thay đổi
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [level, isPaused, timerResetTrigger, dispatch, getLevelTimeLimit]);

  /**
   * Chuyển đổi thời gian từ giây sang định dạng mm:ss
   */
  const formatTime = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  /**
   * Tính phần trăm thời gian còn lại so với tổng thời gian
   */
  const calculateTimePercentage = useCallback((): number => {
    const totalTime = getLevelTimeLimit(level);
    return (timeRemaining / totalTime) * 100;
  }, [timeRemaining, level, getLevelTimeLimit]);

  return {
    timeRemaining,
    formattedTime: formatTime(timeRemaining),
    timePercentage: calculateTimePercentage(),
    resetTimer
  };
};