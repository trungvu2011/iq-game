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
  const closeAnswerModal = () => {
    dispatch({ type: ActionTypes.CLOSE_ANSWER_MODAL });
  };

  /**
   * Hiển thị modal hướng dẫn
   */
  const showHelpModal = () => {
    modalRefs.helpModalRef.current?.show();
    dispatch({ type: ActionTypes.PAUSE_GAME });
  };

  /**
   * Ẩn modal hướng dẫn
   */
  const hideHelpModal = () => {
    modalRefs.helpModalRef.current?.hide();
    dispatch({ type: ActionTypes.CONTINUE_GAME });
  };

  /**
   * Hiển thị modal tạm dừng
   */
  const showPauseModal = () => {
    modalRefs.pauseModalRef.current?.show();
    dispatch({ type: ActionTypes.PAUSE_GAME });
  };

  /**
   * Ẩn modal tạm dừng
   */
  const hidePauseModal = () => {
    modalRefs.pauseModalRef.current?.hide();
    dispatch({ type: ActionTypes.CONTINUE_GAME });
  };

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