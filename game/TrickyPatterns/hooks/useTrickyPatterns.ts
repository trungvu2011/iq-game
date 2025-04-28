import { useState, useEffect, useCallback } from 'react';
import { generatePatternForLevel } from '../utils/patternGenerator';

/**
 * Cấu hình điểm số theo cấp độ
 * Mỗi cấp độ có điểm cơ bản và mức tăng điểm khác nhau 
 */
export const SCORE_CONFIG = {
    1: { baseCorrect: 100, baseWrong: 96, incrementCorrect: 20, incrementWrong: 16 },
    2: { baseCorrect: 140, baseWrong: 128, incrementCorrect: 20, incrementWrong: 16 },
    3: { baseCorrect: 180, baseWrong: 168, incrementCorrect: 30, incrementWrong: 24 },
    4: { baseCorrect: 240, baseWrong: 216, incrementCorrect: 30, incrementWrong: 24 },
    5: { baseCorrect: 300, baseWrong: 264, incrementCorrect: 30, incrementWrong: 24 },
    6: { baseCorrect: 360, baseWrong: 312, incrementCorrect: 30, incrementWrong: 24 },
    7: { baseCorrect: 420, baseWrong: 360, incrementCorrect: 30, incrementWrong: 24 },
    8: { baseCorrect: 480, baseWrong: 408, incrementCorrect: 30, incrementWrong: 24 },
    9: { baseCorrect: 540, baseWrong: 460, incrementCorrect: 40, incrementWrong: 30 },
    10: { baseCorrect: 620, baseWrong: 520, incrementCorrect: 40, incrementWrong: 30 },
};

/**
 * Các hằng số của game
 */
export const GAME_CONSTANTS = {
    QUESTIONS_TO_COMPLETE_LEVEL: 7,
    LEVEL_TIME_LIMIT: 60, // giây
    MAX_LEVEL: 10, // Cấp độ tối đa
    MIN_QUESTIONS_TO_WIN: 7, // Số câu hỏi tối thiểu để hoàn thành cấp độ
};

/**
 * Hook quản lý trạng thái game TrickyPatterns
 */
export const useTrickyPatterns = () => {
    // Trạng thái game
    const [isPaused, setIsPaused] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [showPauseModal, setShowPauseModal] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [totalQuestions, setTotalQuestions] = useState(GAME_CONSTANTS.QUESTIONS_TO_COMPLETE_LEVEL);
    const [levelScore, setLevelScore] = useState(0);
    const [answerSelected, setAnswerSelected] = useState(false);
    const [level, setLevel] = useState(1);
    const [gameOver, setGameOver] = useState(false);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [timerResetTrigger, setTimerResetTrigger] = useState(false);
    const [showAnswerModal, setShowAnswerModal] = useState(false);
    const [wrongAnswer, setWrongAnswer] = useState<any>(null);

    // Dữ liệu mẫu hiện tại
    const [currentPattern, setCurrentPattern] = useState<any>(null);

    // Theo dõi tiến trình game
    const [correctAnswersInLevel, setCorrectAnswersInLevel] = useState(0);
    const [wrongAnswersInLevel, setWrongAnswersInLevel] = useState(0);
    const [totalAttempts, setTotalAttempts] = useState(0);
    const [showLevelComplete, setShowLevelComplete] = useState(false);
    const [showLevelFailed, setShowLevelFailed] = useState(false);

    // Hiển thị kết quả sau khi trả lời
    const [showResult, setShowResult] = useState(false);
    const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);

    // Tạo mẫu mới khi cấp độ thay đổi
    useEffect(() => {
        // Tạo mẫu mới dựa trên cấp độ
        generateNewPattern();

        // Reset các trạng thái
        setCorrectAnswersInLevel(0);
        setWrongAnswersInLevel(0);
        setTotalAttempts(0);
        setCurrentQuestion(1);
        setLevelScore(0);
    }, [level]);

    /**
     * Tạo mẫu mới cho cấp độ hiện tại
     */
    const generateNewPattern = useCallback(() => {
        // Tạo mẫu mới cho cấp độ hiện tại sử dụng thuật toán cải tiến
        // Truyền chỉ số câu hỏi hiện tại (0-indexed) để chọn cấu hình phù hợp
        const questionIndex = currentQuestion - 1;
        const newPattern = generatePatternForLevel(level, questionIndex);
        setCurrentPattern(newPattern);

        // Reset trạng thái hiển thị kết quả
        setShowResult(false);
    }, [level, currentQuestion]);

    /**
     * Xử lý khi người chơi tạm dừng game
     */
    const handlePause = useCallback(() => {
        setIsPaused(!isPaused);
        setShowPauseModal(!showPauseModal);
    }, [isPaused, showPauseModal]);

    /**
     * Xử lý khi người chơi tiếp tục game
     */
    const handleContinue = useCallback(() => {
        setIsPaused(false);
        setShowPauseModal(false);
    }, []);

    /**
     * Xử lý khi người chơi khởi động lại game
     */
    const handleRestart = useCallback(() => {
        // Đặt lại trạng thái game nhưng giữ nguyên cấp độ hiện tại
        generateNewPattern();
        setCurrentQuestion(1);
        setCorrectAnswersInLevel(0);
        setWrongAnswersInLevel(0);
        setTotalAttempts(0);
        setLevelScore(0);
        setAnswerSelected(false);
        setIsPaused(false);
        setShowPauseModal(false);
        setGameOver(false);
        setShowLevelComplete(false);
        setShowLevelFailed(false);
        setShowResult(false);

        // Khởi động lại bộ đếm thời gian
        setTimerResetTrigger(prev => !prev);
    }, [level, generateNewPattern]);

    /**
     * Xử lý khi người chơi muốn xem hướng dẫn
     */
    const handleHowToPlay = useCallback(() => {
        setShowHelp(true);
        setShowPauseModal(false);
    }, []);

    /**
     * Xử lý khi người chơi muốn xem trợ giúp
     */
    const handleHelp = useCallback(() => {
        setShowHelp(true);
    }, []);

    /**
     * Xử lý khi hết thời gian
     */
    const handleTimeUp = useCallback(() => {
        // Cấp độ thất bại
        setShowLevelFailed(true);
        setIsPaused(true);
    }, []);

    /**
     * Xử lý khi hoàn thành cấp độ
     */
    const handleLevelComplete = useCallback(() => {
        setShowLevelComplete(false);
        setIsPaused(false);

        // Kiểm tra nếu cấp độ hiện tại là cấp độ cuối cùng (10)
        if (level >= GAME_CONSTANTS.MAX_LEVEL) {
            // Game kết thúc, hiển thị màn hình hoàn thành game
            setGameCompleted(true);
        } else {
            // Tăng cấp độ lên để chuyển sang cấp độ tiếp theo
            setLevel(prev => prev + 1);
        }
    }, [level]);

    /**
     * Xử lý khi thất bại
     */
    const handleLevelFailed = useCallback(() => {
        setShowLevelFailed(false);
        setIsPaused(false);
        // Đặt lại với cùng cấp độ
        setCurrentQuestion(1);
        setCorrectAnswersInLevel(0);
        // Khởi động lại bộ đếm thời gian
        setTimerResetTrigger(prev => !prev);
    }, []);

    /**
     * Xử lý khi hoàn thành game (bắt đầu lại từ cấp độ 1)
     */
    const handleGameComplete = useCallback(() => {
        setGameCompleted(false);
        setLevel(1);
        handleRestart();
    }, [handleRestart]);

    /**
     * Xử lý khi đóng modal câu trả lời và tiếp tục game
     */
    const handleCloseAnswerModal = useCallback(() => {
        // Ẩn modal câu trả lời
        setShowAnswerModal(false);
        // Xóa câu trả lời sai
        setWrongAnswer(null);
        // Tiếp tục đếm thời gian
        setIsPaused(false);
        // Cho phép trả lời lại
        setAnswerSelected(false);
        // Tạo mẫu mới
        generateNewPattern();
    }, [generateNewPattern]);

    /**
     * Xử lý khi người chơi trả lời
     * @param selectedAnswer true nếu người chơi chọn "Giống nhau", false nếu chọn "Khác nhau"
     */
    const handleAnswer = useCallback((selectedAnswer: boolean) => {
        // Ngăn trả lời nhiều lần hoặc trả lời khi tạm dừng
        if (answerSelected || isPaused) return;

        setAnswerSelected(true);
        setTotalAttempts(prev => prev + 1);

        // Kiểm tra xem câu trả lời của người dùng có đúng không
        // Người dùng trả lời "Giống nhau" (true) và mẫu thực sự giống nhau (is_same = true)
        // HOẶC người dùng trả lời "Khác nhau" (false) và mẫu thực sự khác nhau (is_same = false)
        const isAnswerCorrect = selectedAnswer === currentPattern.is_same;

        // Hiển thị kết quả trên màn hình
        setShowResult(true);
        setIsCorrectAnswer(isAnswerCorrect);

        if (isAnswerCorrect) {
            // Lấy cấu hình điểm cho cấp độ hiện tại
            const levelConfig = SCORE_CONFIG[level as keyof typeof SCORE_CONFIG] || SCORE_CONFIG[1];

            // Tính điểm dựa trên cấp độ và số câu hỏi
            const pointsToAdd = levelConfig.baseCorrect + (currentQuestion - 1) * levelConfig.incrementCorrect;

            // Cập nhật điểm số
            setLevelScore(prev => prev + pointsToAdd);

            // Tăng số câu trả lời đúng
            setCorrectAnswersInLevel(prev => prev + 1);

            // Tăng số câu hỏi hiện tại
            const nextQuestionNumber = currentQuestion + 1;

            // Kiểm tra xem cấp độ đã hoàn thành chưa khi câu hỏi hiện tại vượt quá số câu tối thiểu
            if (nextQuestionNumber > GAME_CONSTANTS.MIN_QUESTIONS_TO_WIN) {
                setTimeout(() => {
                    setShowLevelComplete(true);
                    setIsPaused(true);
                }, 1500); // Chờ hiển thị kết quả 1.5 giây trước khi hiện thông báo hoàn thành
            } else {
                setCurrentQuestion(nextQuestionNumber);

                // Tạo mẫu mới sau một khoảng thời gian hiển thị kết quả
                setTimeout(() => {
                    generateNewPattern();
                    // Cho phép trả lời lại
                    setAnswerSelected(false);
                }, 1500);
            }
        } else {
            // Tăng số câu trả lời sai
            setWrongAnswersInLevel(prev => prev + 1);

            // Lấy cấu hình điểm cho cấp độ hiện tại
            const levelConfig = SCORE_CONFIG[level as keyof typeof SCORE_CONFIG] || SCORE_CONFIG[1];

            // Tính điểm phạt dựa trên cấp độ và số câu hỏi
            const pointsToPenalize = levelConfig.baseWrong + (currentQuestion - 1) * levelConfig.incrementWrong;

            // Cập nhật điểm số (không thấp hơn 0)
            setLevelScore(prev => Math.max(prev - pointsToPenalize, 0));

            // Lưu dữ liệu câu trả lời sai
            setWrongAnswer({
                pattern: currentPattern,
                userAnswer: selectedAnswer
            });

            // Sau khi hiển thị kết quả một khoảng thời gian, tạo mẫu mới
            setTimeout(() => {
                // Chuẩn bị câu hỏi tiếp theo (sẽ được hiển thị sau khi đóng modal)
                const nextQuestionNumber = Math.max(currentQuestion - 1, 1);
                setCurrentQuestion(nextQuestionNumber);

                // Tạo mẫu mới và cho phép trả lời lại
                generateNewPattern();
                setAnswerSelected(false);
            }, 1500);
        }
    }, [answerSelected, isPaused, currentPattern, level, currentQuestion, generateNewPattern]);

    return {
        // Trạng thái
        isPaused,
        showHelp,
        showPauseModal,
        currentQuestion,
        totalQuestions,
        levelScore,
        answerSelected,
        level,
        gameOver,
        gameCompleted,
        timerResetTrigger,
        showAnswerModal,
        wrongAnswer,
        currentPattern,
        correctAnswersInLevel,
        wrongAnswersInLevel,
        totalAttempts,
        showLevelComplete,
        showLevelFailed,
        showResult,
        isCorrectAnswer,

        // Xử lý sự kiện
        handlePause,
        handleContinue,
        handleRestart,
        handleHowToPlay,
        handleHelp,
        handleTimeUp,
        handleLevelComplete,
        handleLevelFailed,
        handleGameComplete,
        handleCloseAnswerModal,
        handleAnswer,

        // Hằng số
        maxLevel: GAME_CONSTANTS.MAX_LEVEL,

        // Setter
        setShowHelp
    };
};