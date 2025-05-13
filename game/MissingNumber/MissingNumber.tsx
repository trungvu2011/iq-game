import { View, StyleSheet, Platform, StatusBar as RNStatusBar, Alert, Text } from 'react-native'
import React, { useRef, useEffect, useState } from 'react'
import ProgressTopBar from '../../components/ProgressTopBar'
import PauseModal from '../../components/PauseModal'
import { BaseModalRefType } from '../../components/BaseModal'
import HexagonGrid from './components/HexagonGrid'
import AnswerButton from './components/AnswerButton'
import { GAME_CONSTANTS, SCORE_CONFIG } from './constants/gameConstants'
import GameMessage from '../../components/GameMessage'
import { generateHexGrid } from './utils/HexGridGenarator'

const MissingNumber = () => {
  // Game state refs
  const levelRef = useRef<number>(1);
  const scoreRef = useRef<number>(0);
  const currentQuestionRef = useRef<number>(1);
  const correctAnswersRef = useRef<number>(0);
  const wrongAnswersRef = useRef<number>(0);
  const isGeneratingRef = useRef<boolean>(false); // Add this to track if we're already generating a question

  // Hex grid state refs
  const rowsRef = useRef<number>(3);
  const colsRef = useRef<number>(3);
  const correctAnswerRef = useRef<number>(1);

  // Game UI state with useState (for re-rendering)
  const [pause, setPause] = useState(false);
  const [resetTimer, setResetTimer] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [showLevelFailed, setShowLevelFailed] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [renderKey, setRenderKey] = useState(0); // Used to force re-render

  // Answers for the current question
  const [answerOptions, setAnswerOptions] = useState<number[]>([1, 2, 3]);
  const [disabled, setDisabled] = useState(false);

  // Refs for modals
  const pauseModalRef = useRef<BaseModalRefType>(null);

  // For debugging: Monitor showLevelFailed state changes
  useEffect(() => {
    console.log("showLevelFailed changed to:", showLevelFailed);
  }, [showLevelFailed]);

  // Calculate the correct answer
  const getCorrectAnswer = () => {
    return correctAnswerRef.current;
  };

  // Generate new question using generateHexGrid
  const generateNewQuestion = () => {
    // Prevent multiple generations simultaneously
    if (isGeneratingRef.current) return;

    isGeneratingRef.current = true;

    // Use the generateHexGrid utility function
    const hexGridData = generateHexGrid(levelRef.current, currentQuestionRef.current);

    // Save the generated data to refs
    rowsRef.current = hexGridData.rows;
    colsRef.current = hexGridData.cols;
    correctAnswerRef.current = hexGridData.correctAnswer;

    // Set the answer options
    setAnswerOptions(hexGridData.answerList);

    // Reset button state
    setDisabled(false);

    // Increment render key to force re-render of grid
    setRenderKey(prev => prev + 1);

    // Update the game state
    isGeneratingRef.current = false;
  };

  // Initialize the game
  useEffect(() => {
    generateNewQuestion();
  }, []);

  // Handle reset timer effect
  useEffect(() => {
    if (resetTimer) {
      const timeout = setTimeout(() => {
        setResetTimer(false);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [resetTimer]);

  // Pause game handlers
  const handleShowPauseModal = () => {
    if (pauseModalRef.current) {
      pauseModalRef.current.show();
      setPause(true);
    }
  };

  const handleContinue = () => {
    if (pauseModalRef.current) {
      pauseModalRef.current.hide();
      setPause(false);
    }
  };

  const handleRestart = () => {
    if (pauseModalRef.current) {
      pauseModalRef.current.hide();
      setPause(false);

      // Đặt lại trạng thái trò chơi
      currentQuestionRef.current = 1;
      correctAnswersRef.current = 0;
      wrongAnswersRef.current = 0;
      scoreRef.current = 0;

      // Đầu tiên đặt lại bộ đếm thời gian
      setResetTimer(true);

      // Thêm một độ trễ nhỏ trước khi xóa trạng thái thất bại để đảm bảo bộ đếm thời gian đã được đặt lại
      setTimeout(() => {
        setShowLevelFailed(false);
        // Tạo câu hỏi mới sau khi trạng thái đã được cập nhật
        generateNewQuestion();
      }, 20);
    }
  };

  // Xử lý khi hết thời gian
  const handleTimeUp = () => {
    setShowLevelFailed(true);
    setDisabled(true);
    setPause(false);
    if (pauseModalRef.current) {
      pauseModalRef.current.hide();
    }
  };

  // Handle answer selection
  const handleAnswer = (isCorrect: boolean) => {
    // Prevent answering if already disabled
    if (disabled) return;

    // Disable buttons after answer
    setDisabled(true);

    // Get current level config
    const levelConfig = SCORE_CONFIG[levelRef.current as keyof typeof SCORE_CONFIG] || SCORE_CONFIG[1];

    if (isCorrect) {
      // Correct answer
      correctAnswersRef.current += 1;

      // Calculate points to add
      const pointsToAdd = levelConfig.baseCorrect + (currentQuestionRef.current - 1) * levelConfig.incrementCorrect;
      scoreRef.current += pointsToAdd;

      // Increment question counter
      currentQuestionRef.current += 1;

      // Check if level is complete
      if (currentQuestionRef.current > GAME_CONSTANTS.MIN_QUESTIONS_TO_WIN) {
        setTimeout(() => {
          setShowLevelComplete(true);
        }, 500);
      } else {
        // Generate new question
        if (!isGeneratingRef.current) {
          generateNewQuestion();
        }
      }
    } else {
      // Wrong answer
      wrongAnswersRef.current += 1;
      currentQuestionRef.current -= 1;
      if (currentQuestionRef.current < 1) {
        currentQuestionRef.current = 1;
      }

      // Calculate points to subtract
      const pointsToSubtract = levelConfig.baseWrong + (currentQuestionRef.current - 1) * levelConfig.incrementWrong;
      scoreRef.current = Math.max(0, scoreRef.current - pointsToSubtract);

      // Generate new question after a short delay
      if (!isGeneratingRef.current) {
        generateNewQuestion();
      }
    }
  };

  // Handle level completion
  const handleLevelComplete = () => {
    if (levelRef.current >= GAME_CONSTANTS.MAX_LEVEL) {
      // Game completed
      setGameCompleted(true);
    } else {
      // Go to next level
      levelRef.current += 1;
      currentQuestionRef.current = 1;
      correctAnswersRef.current = 0;
      wrongAnswersRef.current = 0;
      setShowLevelComplete(false);

      // Generate new question and reset timer
      generateNewQuestion();
      setResetTimer(true);
    }
  };

  // Handle game completion
  const handleGameComplete = () => {
    // Reset game
    levelRef.current = 1;
    scoreRef.current = 0;
    currentQuestionRef.current = 1;
    correctAnswersRef.current = 0;
    wrongAnswersRef.current = 0;
    setGameCompleted(false);

    // Generate new question and reset timer
    generateNewQuestion();
    setResetTimer(true);
  };

  // Mock leave game function
  const handleLeaveGame = () => {
    Alert.alert(
      "Leave Game",
      "This will return to the main menu in the complete app.",
      [{ text: "OK", onPress: () => handleContinue() }]
    );
  };

  // Mock how to play function
  const handleHowToPlay = () => {
    Alert.alert(
      "How to Play",
      "Find the missing number in the sequence shown on the hexagonal grid.",
      [{ text: "OK" }]
    );
  };

  const messageType = gameCompleted ? 'gameover' : showLevelComplete ? 'complete' : showLevelFailed ? 'failed' : null;

  return (
    <View style={styles.container}>
      <ProgressTopBar
        currentQuestion={currentQuestionRef.current}
        totalQuestions={GAME_CONSTANTS.QUESTIONS_TO_COMPLETE_LEVEL}
        score={scoreRef.current}
        level={levelRef.current}
        onPause={handleShowPauseModal}
        onTimeUp={handleTimeUp}
        onHelp={handleHowToPlay}
        shouldResetTimer={resetTimer}
        isPaused={pause || showLevelComplete || showLevelFailed || gameCompleted}
        timeRemaining={GAME_CONSTANTS.LEVEL_TIME_LIMITS}
      />

      <PauseModal
        ref={pauseModalRef}
        backgroundColor='#2f426d'
        onContinue={handleContinue}
        onLeaveGame={handleLeaveGame}
        onRestart={handleRestart}
        onHowToPlay={handleHowToPlay}
      />

      <View style={styles.gameContainer}>
        {messageType ? (
          // Game completed view
          <View style={styles.messageWrapper}>
            <GameMessage
              type={messageType}
              level={levelRef.current}
              score={scoreRef.current}
              correctAnswers={correctAnswersRef.current}
              wrongAnswers={wrongAnswersRef.current}
              onAction={messageType === 'complete' ? handleLevelComplete : messageType === 'failed' ? handleRestart : handleGameComplete}
              maxLevel={GAME_CONSTANTS.MAX_LEVEL}
            />
          </View>
        ) : (
          // Main game view
          <>
            <View style={styles.gridContainer}>
              <HexagonGrid
                key={renderKey}
                rows={rowsRef.current}
                cols={colsRef.current}
                correctAnswer={correctAnswerRef.current}
              />
            </View>

            <View>
              <AnswerButton
                answerList={answerOptions}
                correctAnswer={getCorrectAnswer()}
                onAnswer={handleAnswer}
                disabled={disabled}
              />
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2f426d',
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight || 0 : 0,
  },
  gameContainer: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 10,
  },
  gridContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  messageWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MissingNumber;