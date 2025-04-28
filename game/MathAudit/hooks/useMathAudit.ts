import { useState, useEffect, useCallback } from 'react';
import { MathEquation } from '../types';
import { generateNewEquation, calculatePoints, GAME_CONSTANTS } from '../utils/GameLogic';

/**
 * Hook quản lý Game state 
 */
export const useMathAudit = () => {
    // Game state 
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
    const [wrongAnswerEquation, setWrongAnswerEquation] = useState<MathEquation | null>(null);

    // Phương trình hiện tại
    const [currentEquation, setCurrentEquation] = useState<MathEquation>(generateNewEquation(1));

    // Theo dõi tiến trình game
    const [correctAnswersInLevel, setCorrectAnswersInLevel] = useState(0);
    const [wrongAnswersInLevel, setWrongAnswersInLevel] = useState(0);
    const [totalAttempts, setTotalAttempts] = useState(0);
    const [showLevelComplete, setShowLevelComplete] = useState(false);
    const [showLevelFailed, setShowLevelFailed] = useState(false);

    // Tạo phương trình mới khi cấp độ thay đổi
    useEffect(() => {
        setCurrentEquation(generateNewEquation(level));
        setCorrectAnswersInLevel(0);
        setWrongAnswersInLevel(0);
        setTotalAttempts(0);
        setCurrentQuestion(1);
        setLevelScore(0);
    }, [level]);

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
        setCurrentEquation(generateNewEquation(level));
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
        // Khởi động lại bộ đếm thời gian
        setTimerResetTrigger(prev => !prev);
    }, [level]);

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
        // Xóa phương trình câu trả lời sai
        setWrongAnswerEquation(null);
        // Tiếp tục đếm thời gian
        setIsPaused(false);
        // Cho phép trả lời lại
        setAnswerSelected(false);
    }, []);

    /**
     * Xử lý khi người chơi trả lời
     */
    const handleAnswer = useCallback((selectedAnswer: boolean) => {
        // Ngăn trả lời nhiều lần hoặc trả lời khi tạm dừng
        if (answerSelected || isPaused) return;

        setAnswerSelected(true);
        setTotalAttempts(prev => prev + 1);

        // Kiểm tra xem câu trả lời của người dùng có đúng không
        const isAnswerCorrect = (selectedAnswer === currentEquation.isCorrect);

        if (isAnswerCorrect) {
            // Tính điểm dựa trên cấp độ và số câu hỏi
            const pointsToAdd = calculatePoints(true, level, currentQuestion);

            // Cập nhật điểm số
            setLevelScore(prev => prev + pointsToAdd);

            // Tăng số câu trả lời đúng
            setCorrectAnswersInLevel(prev => prev + 1);

            // Tăng số câu hỏi hiện tại
            const nextQuestionNumber = currentQuestion + 1;

            // Kiểm tra xem cấp độ đã hoàn thành chưa khi câu hỏi hiện tại vượt quá 7
            if (nextQuestionNumber > GAME_CONSTANTS.MIN_QUESTIONS_TO_WIN) {
                setTimeout(() => {
                    setShowLevelComplete(true);
                    setIsPaused(true);
                }, 500);
            } else {
                setCurrentQuestion(nextQuestionNumber);

                // Tạo câu hỏi mới cho câu hỏi tiếp theo
                setCurrentEquation(generateNewEquation(level));
            }


            // Cho phép trả lời lại sau một khoảng thời gian
            setTimeout(() => {
                setAnswerSelected(false);
            }, 500);
        } else {
            // Tăng số câu trả lời sai
            setWrongAnswersInLevel(prev => prev + 1);

            // Tính điểm phạt dựa trên cấp độ và số câu hỏi
            const pointsToPenalize = calculatePoints(false, level, currentQuestion);

            // Cập nhật điểm số (không thấp hơn 0)
            setLevelScore(prev => Math.max(prev - pointsToPenalize, 0));

            // Lưu một bản sao của phương trình hiện tại cho modal câu trả lời
            setWrongAnswerEquation({ ...currentEquation });

            // Tạm dừng bộ đếm thời gian và hiển thị modal câu trả lời
            setIsPaused(true);
            setShowAnswerModal(true);

            // Chuẩn bị câu hỏi tiếp theo (sẽ được hiển thị sau khi đóng modal)
            const nextQuestionNumber = Math.max(currentQuestion - 1, 1);
            setCurrentQuestion(nextQuestionNumber);
            setCurrentEquation(generateNewEquation(level));
        }
    }, [answerSelected, isPaused, currentEquation, level, currentQuestion]);

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
        wrongAnswerEquation,
        currentEquation,
        correctAnswersInLevel,
        wrongAnswersInLevel,
        totalAttempts,
        showLevelComplete,
        showLevelFailed,

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