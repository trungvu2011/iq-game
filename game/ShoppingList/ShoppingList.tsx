import { View, StyleSheet, Platform, StatusBar as RNStatusBar, Alert, Text, SafeAreaView } from 'react-native'
import React, { memo, use, useEffect, useRef, useState } from 'react'
import LevelTopBar from '../../components/LevelTopBar';
import PauseModal from '../../components/PauseModal';
import { GAME_CONSTANTS, SCORE_CONFIG } from './constant';
import { BaseModalRefType } from '../../components/BaseModal';
import RemeberList from './components/RememberList';
import Shelves from './components/Shelves';
import { generateFoodList } from './utils/ShoppingListGenerator';
import GameMessage from '../../components/GameMessage';


const ShoppingList = () => {
  // Refs to manage game state
  const levelRef = useRef<number>(1);
  const currentQuestionRef = useRef<number>(1);
  const indexQuestionRef = useRef<number>(0);
  const pauseModalRef = useRef<BaseModalRefType>(null);
  const correctAnswersRef = useRef<number>(0);
  const wrongAnswersRef = useRef<number>(0);
  const hasSelectedRef = useRef<() => boolean>(() => false);

  // State to manage game UI
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [showLevelFailed, setShowLevelFailed] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [items, setItems] = useState<number[]>([]);
  const [correctItems, setCorrectItems] = useState<number[]>([]);
  const [showMemorize, setShowMemorize] = useState(true); // New state to control visibility
  const [score, setScore] = useState<number>(0);
  const [pause, setPause] = React.useState(false);

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

      // Nếu chưa chọn bất kỳ item nào
      if (!hasSelectedRef.current()) {
        setShowMemorize(true);
        // Set timer to hide RemeberList after 5 seconds
        const timer = setTimeout(() => {
          setShowMemorize(false);
        }, correctItems.length * 1000);

        // Clear the timer when component unmounts
        return () => clearTimeout(timer);
      }
    }
  };
  const handleRestart = () => {
    if (pauseModalRef.current) {
      pauseModalRef.current.hide();
      setPause(false);

      // Đặt lại trạng thái trò chơi
      currentQuestionRef.current = 1;
      setScore(0);
      indexQuestionRef.current = levelRef.current - 1;
      correctAnswersRef.current = 0;
      wrongAnswersRef.current = 0;

      // Đặt lại các biến trạng thái
      setShowLevelComplete(false);
      setShowLevelFailed(false);
      setGameCompleted(false);

      // Generate the food grid when the component mounts
      generateFoodGrid();
      setShowMemorize(true); // Show the RemeberList when restarting

      // Set timer to hide RemeberList after 5 seconds
      const timer = setTimeout(() => {
        setShowMemorize(false);
      }, correctItems.length * 1000);

      // Clear the timer when component unmounts
      return () => clearTimeout(timer);
    }
  };

  const handleLeaveGame = () => {
    Alert.alert(
      "Leave Game",
      "This will return to the main menu in the complete app.",
      [{ text: "OK", onPress: () => handleContinue() }]
    );
  };

  const handleHowToPlay = () => {
    Alert.alert(
      "How to Play",
      "Instructions for the Shopping List game will appear here.",
      [{ text: "OK" }]
    );
  };

  // Handle level completion
  const handleLevelComplete = () => {
    // Kiểm tra xem người chơi đã trả lời đúng hết các câu hỏi chưa
    if (correctAnswersRef.current !== GAME_CONSTANTS.QUESTIONS_TO_COMPLETE_LEVEL) {
      // Level failed - Người chơi không trả lời đúng hết các câu hỏi
      setShowLevelFailed(true);
      return;
    }

    if (levelRef.current >= GAME_CONSTANTS.MAX_LEVEL) {
      // Game completed
      setGameCompleted(true);
    } else {
      // Go to next level - Chỉ khi đã trả lời đúng hết các câu hỏi
      levelRef.current += 1;
      currentQuestionRef.current = 1;
      correctAnswersRef.current = 0;
      wrongAnswersRef.current = 0;
      setScore(0);
      indexQuestionRef.current = levelRef.current - 1;
      setShowLevelFailed(false);
      setShowLevelComplete(false);

      // Generate new question
      generateFoodGrid();
      setShowMemorize(true);
    }
  };
  // Handle game completion
  const handleGameComplete = () => {
    // Reset game
    levelRef.current = 1;
    setScore(0);
    currentQuestionRef.current = 1;
    correctAnswersRef.current = 0;
    wrongAnswersRef.current = 0;
    setGameCompleted(false);

    // Generate new question
    generateFoodGrid();
    setShowMemorize(true);
  };
  const handleAnswer = (isCorrect: boolean) => {
    currentQuestionRef.current += 1;
    if (isCorrect) {
      indexQuestionRef.current += 1;
      correctAnswersRef.current += 1;
      if (currentQuestionRef.current > GAME_CONSTANTS.QUESTIONS_TO_COMPLETE_LEVEL) {
        // Chỉ hiển thị level complete nếu đã trả lời đúng đủ số câu hỏi
        if (correctAnswersRef.current >= GAME_CONSTANTS.QUESTIONS_TO_COMPLETE_LEVEL) {
          setTimeout(() => {
            setShowLevelComplete(true);
          }, 500);
          setShowLevelComplete(true);
        } else {
          // Nếu không đủ số câu trả lời đúng, hiển thị thông báo thất bại
          setTimeout(() => {
            setShowLevelFailed(true);
          }, 500);
          setShowLevelFailed(true);
        }
      } else {
        // Generate the next food grid
        generateFoodGrid();
        setShowMemorize(true); // Show the RemeberList when answering correctly

        // Set timer to hide RemeberList after 5 seconds
        const timer = setTimeout(() => {
          setShowMemorize(false);
        }, correctItems.length * 1000);

        // Clear the timer when component unmounts
        return () => clearTimeout(timer);
      }
    } else {
      indexQuestionRef.current = Math.max(0, indexQuestionRef.current - 1);
      wrongAnswersRef.current += 1;
      if (currentQuestionRef.current > GAME_CONSTANTS.QUESTIONS_TO_COMPLETE_LEVEL) {
        // Chỉ hiển thị level complete nếu đã trả lời đúng đủ số câu hỏi
        if (correctAnswersRef.current >= GAME_CONSTANTS.QUESTIONS_TO_COMPLETE_LEVEL) {
          setTimeout(() => {
            setShowLevelComplete(true);
          }, 500);
          setShowLevelComplete(true);
        } else {
          // Nếu không đủ số câu trả lời đúng, hiển thị thông báo thất bại
          setTimeout(() => {
            setShowLevelFailed(true);
          }, 500);
          setShowLevelFailed(true);
        }
      } else {
        generateFoodGrid();
        setShowMemorize(true); // Show the RemeberList when answering incorrectly

        // Set timer to hide RemeberList after 5 seconds
        const timer = setTimeout(() => {
          setShowMemorize(false);
        }, correctItems.length * 1000);

        // Clear the timer when component unmounts
        return () => clearTimeout(timer);
      }
    }
  }

  const generateFoodGrid = () => {
    const FoodList = generateFoodList(indexQuestionRef.current);
    const items = FoodList.items;
    const correctItems = FoodList.correctItems;

    setItems(items);
    setCorrectItems(correctItems);
  }

  useEffect(() => {
    handleRestart();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMemorize(false);
    }, correctItems.length * 1000);

    // Clear the timer when component unmounts
    return () => clearTimeout(timer);
  }, [showMemorize]);

  const messageType = gameCompleted ? 'gameover' : showLevelComplete ? 'complete' : showLevelFailed ? 'failed2' : null;


  return (
    <SafeAreaView style={styles.container}>
      <LevelTopBar
        currentQuestion={currentQuestionRef.current}
        totalQuestions={GAME_CONSTANTS.QUESTIONS_TO_COMPLETE_LEVEL}
        score={score}
        level={levelRef.current}
        onPause={handleShowPauseModal}
        onHelp={handleHowToPlay}
        isPaused={pause || showLevelComplete || showLevelFailed || gameCompleted}
      />

      <PauseModal
        ref={pauseModalRef}
        backgroundColor='#02596a'
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
              score={score}
              correctAnswers={correctAnswersRef.current}
              wrongAnswers={wrongAnswersRef.current}
              onAction={messageType === 'complete' ? handleLevelComplete : messageType === 'failed2' ? handleRestart : handleGameComplete}
              maxLevel={GAME_CONSTANTS.MAX_LEVEL}
            />
          </View>
        ) : (
          <>
            {
              showMemorize ? (
                <RemeberList correctItems={correctItems} />) : (<Shelves
                  items={items}
                  correctItems={correctItems}
                  onAnswer={handleAnswer}
                  score={score}
                  setScore={setScore}
                  indexQuestionRef={indexQuestionRef}
                  onHasSelectedRef={hasSelectedRef}
                />
              )}
          </>
        )}
      </View>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#02596a',
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

export default ShoppingList