import { generatePatternForLevel } from '../utils/patternGenerator';
import { GAME_CONSTANTS, SCORE_CONFIG } from '../constants/gameConstants';
import { GameState, ActionTypes, GameAction, PatternData } from '../types/gameTypes';

/**
 * State ban đầu cho game TrickyPatterns
 */
export const initialState: GameState = {
  isPaused: false,
  currentQuestion: 1,
  questionIndex: 0,
  totalQuestions: GAME_CONSTANTS.QUESTIONS_TO_COMPLETE_LEVEL,
  levelScore: 0,
  answerSelected: false,
  level: 1,
  gameOver: false,
  gameCompleted: false,
  timerResetTrigger: false,
  showAnswerModal: false,
  wrongAnswer: null,
  currentPattern: null,
  correctAnswersInLevel: 0,
  wrongAnswersInLevel: 0,
  totalAttempts: 0,
  showLevelComplete: false,
  showLevelFailed: false,
  showResult: false,
  isCorrectAnswer: false,
};

/**
 * Reducer quản lý state của game TrickyPatterns
 */
export const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case ActionTypes.PAUSE_GAME:
      return { ...state, isPaused: true };

    case ActionTypes.CONTINUE_GAME:
      return { ...state, isPaused: false };

    case ActionTypes.RESTART_GAME:
      return {
        ...initialState,
        level: state.level,
        currentPattern: generatePatternForLevel(state.level, 0),
        timerResetTrigger: !state.timerResetTrigger,
      };

    case ActionTypes.ANSWER_QUESTION: {
      const selectedAnswer = action.payload;
      const isAnswerCorrect = selectedAnswer === state.currentPattern?.is_same;

      // Cập nhật số lần thử
      const totalAttempts = state.totalAttempts + 1;

      if (isAnswerCorrect) {
        // Lấy cấu hình điểm cho cấp độ hiện tại
        const levelConfig = SCORE_CONFIG[state.level as keyof typeof SCORE_CONFIG] || SCORE_CONFIG[1];

        // Tính điểm dựa trên cấp độ và số câu hỏi
        const pointsToAdd = levelConfig.baseCorrect + (state.currentQuestion - 1) * levelConfig.incrementCorrect;

        // Tăng số câu đúng và số câu hỏi
        const correctAnswersInLevel = state.correctAnswersInLevel + 1;
        const nextQuestionNumber = state.currentQuestion + 1;
        const nextQuestionIndex = state.questionIndex + 1;

        // Kiểm tra nếu đã hoàn thành số câu hỏi tối thiểu để vượt level
        const isLevelComplete = nextQuestionNumber > GAME_CONSTANTS.MIN_QUESTIONS_TO_WIN;

        // Ban đầu chỉ cập nhật trạng thái câu trả lời và hiển thị kết quả
        return {
          ...state,
          answerSelected: true,
          totalAttempts,
          levelScore: state.levelScore + pointsToAdd,
          correctAnswersInLevel,
          currentQuestion: nextQuestionNumber,
          questionIndex: nextQuestionIndex,
          showResult: true,
          isCorrectAnswer: true,
          // Không cập nhật showLevelComplete và isPaused ngay lập tức
          // Việc này sẽ được xử lý bởi setTimeout ở useEffect trong useGameControl
        };
      } else {
        // Lấy cấu hình điểm cho cấp độ hiện tại
        const levelConfig = SCORE_CONFIG[state.level as keyof typeof SCORE_CONFIG] || SCORE_CONFIG[1];

        // Tính điểm phạt dựa trên cấp độ và số câu hỏi
        const pointsToPenalize = levelConfig.baseWrong + (state.currentQuestion - 1) * levelConfig.incrementWrong;

        // Tăng số câu sai
        const wrongAnswersInLevel = state.wrongAnswersInLevel + 1;

        // Lưu thông tin câu trả lời sai
        const wrongAnswer = {
          pattern: state.currentPattern!,
          userAnswer: selectedAnswer
        };

        // Giảm số câu hỏi hiện tại và question index, nhưng không thấp hơn 1
        const nextQuestionNumber = Math.max(state.currentQuestion - 1, 1);
        const nextQuestionIndex = Math.max(state.questionIndex - 1, 0);

        return {
          ...state,
          answerSelected: true,
          totalAttempts,
          levelScore: Math.max(state.levelScore - pointsToPenalize, 0),
          wrongAnswersInLevel,
          wrongAnswer,
          currentQuestion: nextQuestionNumber,
          questionIndex: nextQuestionIndex,
          showResult: true,
          isCorrectAnswer: false
          // Cập nhật pattern mới sẽ được xử lý bởi setTimeout ở useEffect trong useGameControl
        };
      }
    }

    case ActionTypes.GENERATE_NEW_PATTERN:
      return {
        ...state,
        currentPattern: generatePatternForLevel(state.level, state.questionIndex),
        showResult: false,
        answerSelected: false,
      };

    case ActionTypes.SET_CURRENT_PATTERN:
      return {
        ...state,
        currentPattern: action.payload,
        showResult: false,
        answerSelected: false,
      };

    case ActionTypes.SHOW_LEVEL_COMPLETE:
      return {
        ...state,
        showLevelComplete: true,
        isPaused: true,
      };

    case ActionTypes.HIDE_LEVEL_COMPLETE:
      return {
        ...state,
        showLevelComplete: false,
        isPaused: false,
        answerSelected: false,
      };

    case ActionTypes.LEVEL_UP:
      if (state.level >= GAME_CONSTANTS.MAX_LEVEL) {
        return {
          ...state,
          gameCompleted: true,
        };
      }
      return {
        ...initialState,
        level: state.level + 1,
        currentPattern: generatePatternForLevel(state.level + 1, 0),
      };

    case ActionTypes.SHOW_LEVEL_FAILED:
      return {
        ...state,
        showLevelFailed: true,
        isPaused: true,
      };

    case ActionTypes.SET_GAME_COMPLETED:
      return {
        ...state,
        gameCompleted: action.payload,
      };

    case ActionTypes.RESET_LEVEL:
      return {
        ...initialState,
        level: state.level,
        currentPattern: generatePatternForLevel(state.level, 0),
        timerResetTrigger: !state.timerResetTrigger,
        showLevelFailed: false,
      };

    case ActionTypes.TIME_UP:
      return {
        ...state,
        showLevelFailed: true,
        isPaused: true,
      };

    case ActionTypes.RESET_TIMER:
      return {
        ...state,
        timerResetTrigger: !state.timerResetTrigger,
      };

    case ActionTypes.CLOSE_ANSWER_MODAL:
      return {
        ...state,
        showAnswerModal: false,
        wrongAnswer: null,
        isPaused: false,
        answerSelected: false,
      };

    default:
      return state;
  }
};