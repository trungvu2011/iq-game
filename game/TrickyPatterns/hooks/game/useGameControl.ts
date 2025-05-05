import { useCallback, useEffect } from 'react';
import { useGameContext } from '../../context/GameContext';
import { ActionTypes } from '../../types/gameTypes';
import { generatePatternForLevel } from '../../utils/patternGenerator';
import { GAME_CONSTANTS } from '../../constants/gameConstants';

/**
 * Hook quản lý trạng thái và điều khiển chung của game
 */
export const useGameControl = () => {
  const { state, dispatch, modalRefs } = useGameContext();

  /**
   * Xử lý khi người dùng tạm dừng game
   */
  const handlePause = useCallback(() => {
    if (state.isPaused) {
      modalRefs.pauseModalRef.current?.hide();
      dispatch({ type: ActionTypes.CONTINUE_GAME });
    } else {
      modalRefs.pauseModalRef.current?.show();
      dispatch({ type: ActionTypes.PAUSE_GAME });
    }
  }, [state.isPaused, modalRefs.pauseModalRef, dispatch]);

  /**
   * Tiếp tục game sau khi tạm dừng
   */
  const handleContinue = useCallback(() => {
    modalRefs.pauseModalRef.current?.hide();
    dispatch({ type: ActionTypes.CONTINUE_GAME });
  }, [modalRefs.pauseModalRef, dispatch]);

  /**
   * Xử lý khi người dùng muốn xem hướng dẫn
   */
  const handleHowToPlay = useCallback(() => {
    modalRefs.helpModalRef.current?.show();
    modalRefs.pauseModalRef.current?.hide();
    dispatch({ type: ActionTypes.PAUSE_GAME });
  }, [modalRefs.helpModalRef, modalRefs.pauseModalRef, dispatch]);

  /**
   * Xử lý khi người dùng đóng modal hướng dẫn
   */
  const handleCloseHelpModal = useCallback(() => {
    modalRefs.helpModalRef.current?.hide();
    dispatch({ type: ActionTypes.CONTINUE_GAME });
  }, [modalRefs.helpModalRef, dispatch]);

  /**
   * Xử lý khi người dùng trả lời câu hỏi
   */
  const handleAnswer = useCallback((selectedAnswer: boolean) => {
    // Ngăn việc trả lời khi game đang tạm dừng hoặc đã chọn câu trả lời
    if (state.isPaused || state.answerSelected) return;

    dispatch({
      type: ActionTypes.ANSWER_QUESTION,
      payload: selectedAnswer
    });
  }, [state.isPaused, state.answerSelected, dispatch]);

  // Xử lý hiển thị thông báo hoàn thành level và tạo pattern mới sau khi trả lời
  useEffect(() => {
    // Chỉ xử lý khi đã chọn câu trả lời
    if (state.answerSelected && state.showResult) {
      const timeout = setTimeout(() => {
        const nextQuestionNumber = state.currentQuestion;

        if (state.isCorrectAnswer) {
          // Kiểm tra xem cấp độ đã hoàn thành chưa khi câu hỏi hiện tại vượt quá số câu tối thiểu
          if (nextQuestionNumber > GAME_CONSTANTS.MIN_QUESTIONS_TO_WIN) {
            dispatch({ type: ActionTypes.SHOW_LEVEL_COMPLETE });
          } else {
            // Tạo pattern mới cho câu hỏi tiếp theo
            const newPattern = generatePatternForLevel(state.level, state.questionIndex);
            dispatch({ type: ActionTypes.SET_CURRENT_PATTERN, payload: newPattern });
          }
        } else {
          // Trả lời sai, tạo pattern mới tương ứng với cấp độ hiện tại
          const newPattern = generatePatternForLevel(state.level, state.questionIndex);
          dispatch({ type: ActionTypes.SET_CURRENT_PATTERN, payload: newPattern });
        }
      }, 1500); // Chờ 1.5 giây để hiển thị kết quả trước khi chuyển pattern

      return () => clearTimeout(timeout);
    }
  }, [state.answerSelected, state.showResult, state.isCorrectAnswer, state.currentQuestion, state.level, state.questionIndex, dispatch]);

  return {
    handlePause,
    handleContinue,
    handleHowToPlay,
    handleCloseHelpModal,
    handleAnswer,
    isPaused: state.isPaused,
    answerSelected: state.answerSelected,
    showResult: state.showResult,
    isCorrectAnswer: state.isCorrectAnswer,
    modalRefs
  };
};