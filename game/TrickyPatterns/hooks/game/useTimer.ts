import { useEffect, useState, useCallback, useRef } from 'react';
import { useGameContext } from '../../context/GameContext';
import { ActionTypes } from '../../types/gameTypes';
import { GAME_CONSTANTS } from '../../constants/gameConstants';

/**
 * Hook quản lý thời gian trong game
 */
export const useTimer = () => {
  const { state, dispatch } = useGameContext();
  const { isPaused, timerResetTrigger, level } = state;

  // State để lưu thời gian còn lại (tính bằng giây)
  const [timeRemaining, setTimeRemaining] = useState<number>(GAME_CONSTANTS.LEVEL_TIME_LIMITS);

  /**
   * Reset bộ đếm thời gian
   */
  const resetTimer = useCallback(() => {
    dispatch({ type: ActionTypes.RESET_TIMER });
  }, [dispatch]);

  // Effect để xử lý việc reset timer khi level thay đổi hoặc reset được kích hoạt
  useEffect(() => {
    // Đặt lại thời gian ban đầu khi level thay đổi hoặc timer được reset
    setTimeRemaining(GAME_CONSTANTS.LEVEL_TIME_LIMITS);
  }, [level, timerResetTrigger]);

  // Effect riêng biệt để xử lý đếm ngược
  useEffect(() => {
    // Chỉ chạy đếm ngược khi không tạm dừng
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
  }, [isPaused, dispatch]);

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
  const calculateTimePercentage = (): number => {
    const totalTime = GAME_CONSTANTS.LEVEL_TIME_LIMITS;
    return (timeRemaining / totalTime) * 100;
  };

  return {
    timeRemaining,
    formattedTime: formatTime(timeRemaining),
    timePercentage: calculateTimePercentage(),
    resetTimer
  };
};