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

  // Sử dụng useRef để lưu trữ trạng thái isPaused mới nhất
  const isPausedRef = useRef(isPaused);
  // Thêm ref để theo dõi thời điểm reset timer
  const justResetRef = useRef(false);
  // Ref để theo dõi thời gian còn lại
  const timeRemainingRef = useRef(GAME_CONSTANTS.LEVEL_TIME_LIMITS);

  // Cập nhật ref khi isPaused thay đổi
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // State để lưu thời gian còn lại (tính bằng giây)
  const [timeRemaining, setTimeRemaining] = useState<number>(GAME_CONSTANTS.LEVEL_TIME_LIMITS);

  /**
   * Reset bộ đếm thời gian
   */
  const resetTimer = useCallback(() => {
    dispatch({ type: ActionTypes.RESET_TIMER });
    justResetRef.current = true; // Đánh dấu timer vừa được reset

    // Đặt lại cờ sau 1 giây để tránh kích hoạt TIME_UP ngay sau khi reset
    setTimeout(() => {
      justResetRef.current = false;
    }, 1000);
  }, [dispatch]);

  // Effect để xử lý việc reset timer khi level thay đổi hoặc reset được kích hoạt
  useEffect(() => {
    // Đặt lại thời gian ban đầu khi level thay đổi hoặc timer được reset
    setTimeRemaining(GAME_CONSTANTS.LEVEL_TIME_LIMITS);
    timeRemainingRef.current = GAME_CONSTANTS.LEVEL_TIME_LIMITS;
    justResetRef.current = true; // Đánh dấu timer vừa được reset

    // Đặt lại cờ sau 1 giây để tránh kích hoạt TIME_UP ngay sau khi reset
    setTimeout(() => {
      justResetRef.current = false;
    }, 1000);
  }, [level, timerResetTrigger]);

  // Effect riêng biệt để xử lý đếm ngược
  useEffect(() => {
    // Chỉ chạy đếm ngược khi không tạm dừng
    let timerId: NodeJS.Timeout | null = null;

    if (!isPaused) {
      timerId = setInterval(() => {
        // Kiểm tra lại trạng thái tạm dừng mới nhất trước khi cập nhật thời gian
        if (!isPausedRef.current) {
          setTimeRemaining(prev => {
            const newValue = prev - 1;
            timeRemainingRef.current = newValue > 0 ? newValue : 0;
            return timeRemainingRef.current;
          });
        }
      }, 1000);
    }

    // Dọn dẹp interval khi component unmount hoặc dependencies thay đổi
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isPaused]);

  // Thêm effect riêng để xử lý khi hết thời gian
  useEffect(() => {
    // Chỉ kích hoạt TIME_UP khi thời gian = 0, không bị tạm dừng và không phải vừa reset timer
    if (timeRemaining === 0 && !isPaused && !justResetRef.current) {
      // Gọi dispatch trong effect riêng biệt thay vì trong hàm setter
      dispatch({ type: ActionTypes.TIME_UP });
    }
  }, [timeRemaining, isPaused, dispatch]);

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
    resetTimer,
    isPaused
  };
};