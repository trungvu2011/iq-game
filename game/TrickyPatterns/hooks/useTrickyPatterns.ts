import { useEffect } from 'react';
import { usePatternGenerator } from './game/usePatternGenerator';
import { useLevelManager } from './game/useLevelManager';
import { useScoreCalculator } from './game/useScoreCalculator';
import { useGameControl } from './game/useGameControl';
import { useModalController } from './ui/useModalController';
import { useGameContext } from '../context/GameContext';
import { GAME_CONSTANTS } from '../constants/gameConstants';

/**
 * Hook chính quản lý trạng thái game TrickyPatterns
 * Kết hợp các custom hook nhỏ hơn để quản lý các tính năng khác nhau
 */
export const useTrickyPatterns = () => {
  const { state } = useGameContext();

  // Sử dụng các custom hook đã tạo
  const patternGenerator = usePatternGenerator();
  const levelManager = useLevelManager();
  const scoreCalculator = useScoreCalculator();
  const gameControl = useGameControl();
  const modalController = useModalController();

  // Effect để khởi tạo pattern khi level thay đổi
  useEffect(() => {
    patternGenerator.initializePatternForLevel(state.level);
  }, [state.level, patternGenerator.initializePatternForLevel]);

  // Effect để cập nhật pattern mới sau khi trả lời đúng và thời gian delay hiển thị kết quả
  useEffect(() => {
    if (state.answerSelected && !state.showLevelComplete && !state.showLevelFailed) {
      const timeout = setTimeout(() => {
        patternGenerator.updatePattern(state.level, state.questionIndex);
      }, 1500);

      return () => clearTimeout(timeout);
    }
  }, [state.answerSelected, state.isCorrectAnswer, state.showLevelComplete, state.showLevelFailed, state.level, state.questionIndex, patternGenerator.updatePattern]);

  /**
   * Xử lý khi hoàn thành level
   */
  const handleLevelComplete = () => {
    levelManager.completeLevel();
  };

  /**
   * Xử lý khi level thất bại
   */
  const handleLevelFailed = () => {
    levelManager.failLevel();
  };

  /**
   * Xử lý khi hoàn thành game
   */
  const handleGameComplete = () => {
    levelManager.completeGame();
  };

  // Trích xuất ra các thuộc tính từ các hook để tránh trùng lặp
  const {
    currentPattern: generatedPattern,
    ...restPatternGenerator
  } = patternGenerator;

  const {
    currentQuestion: levelQuestion,
    isGameCompleted,
    showLevelComplete,
    showLevelFailed,
    ...restLevelManager
  } = levelManager;

  const {
    showResult: resultShown,
    isCorrectAnswer: answerCorrect,
    ...restGameControl
  } = gameControl;

  const {
    gameCompleted: modalGameCompleted,
    showLevelComplete: modalShowLevelComplete,
    showLevelFailed: modalShowLevelFailed,
    ...restModalController
  } = modalController;

  // Lấy các thuộc tính từ state gốc
  const {
    currentQuestion,
    totalQuestions,
    levelScore,
    level,
    gameOver,
    gameCompleted,
    currentPattern,
    correctAnswersInLevel,
    wrongAnswersInLevel,
    totalAttempts,
    showResult,
    isCorrectAnswer,
    timerResetTrigger,
  } = state;

  return {
    // Game state từ state tổng
    currentQuestion,
    totalQuestions,
    levelScore,
    level,
    gameOver,
    gameCompleted,
    currentPattern,
    correctAnswersInLevel,
    wrongAnswersInLevel,
    totalAttempts,
    showResult,
    isCorrectAnswer,
    timerResetTrigger,

    // Các trạng thái từ levelManager
    showLevelComplete,
    showLevelFailed,

    // Pattern generator methods (đã loại bỏ currentPattern)
    ...restPatternGenerator,

    // Level manager methods (đã loại bỏ các thuộc tính trùng lặp)
    ...restLevelManager,
    handleLevelComplete,
    handleLevelFailed,
    handleGameComplete,

    // Score calculator
    ...scoreCalculator,

    // Timer methods
    handleTimeUp: levelManager.timeUp,

    // Game control methods (đã loại bỏ các thuộc tính trùng lặp)
    ...restGameControl,

    // Modal controller (đã loại bỏ các thuộc tính trùng lặp)
    ...restModalController,

    // Constants
    maxLevel: GAME_CONSTANTS.MAX_LEVEL,
  };
};