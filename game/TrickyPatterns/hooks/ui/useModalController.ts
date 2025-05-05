import { useCallback } from 'react';
import { useGameContext } from '../../context/GameContext';
import { ActionTypes } from '../../types/gameTypes';

/**
 * Hook quản lý việc hiển thị các modal dialog trong game
 */
export const useModalController = () => {
  const { state, dispatch, modalRefs } = useGameContext();

  /**
   * Đóng modal kết quả câu trả lời
   */
  const closeAnswerModal = useCallback(() => {
    dispatch({ type: ActionTypes.CLOSE_ANSWER_MODAL });
  }, [dispatch]);

  /**
   * Hiển thị modal hướng dẫn
   */
  const showHelpModal = useCallback(() => {
    modalRefs.helpModalRef.current?.show();
    dispatch({ type: ActionTypes.PAUSE_GAME });
  }, [modalRefs.helpModalRef, dispatch]);

  /**
   * Ẩn modal hướng dẫn
   */
  const hideHelpModal = useCallback(() => {
    modalRefs.helpModalRef.current?.hide();
    dispatch({ type: ActionTypes.CONTINUE_GAME });
  }, [modalRefs.helpModalRef, dispatch]);

  /**
   * Hiển thị modal tạm dừng
   */
  const showPauseModal = useCallback(() => {
    modalRefs.pauseModalRef.current?.show();
    dispatch({ type: ActionTypes.PAUSE_GAME });
  }, [modalRefs.pauseModalRef, dispatch]);

  /**
   * Ẩn modal tạm dừng
   */
  const hidePauseModal = useCallback(() => {
    modalRefs.pauseModalRef.current?.hide();
    dispatch({ type: ActionTypes.CONTINUE_GAME });
  }, [modalRefs.pauseModalRef, dispatch]);

  return {
    closeAnswerModal,
    showHelpModal,
    hideHelpModal,
    showPauseModal,
    hidePauseModal,
    showAnswerModal: state.showAnswerModal,
    wrongAnswer: state.wrongAnswer,
    showLevelComplete: state.showLevelComplete,
    showLevelFailed: state.showLevelFailed,
    gameCompleted: state.gameCompleted,
    modalRefs
  };
};