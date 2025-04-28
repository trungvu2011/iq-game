import { View, SafeAreaView, StyleSheet, Dimensions, Alert, Platform, StatusBar as RNStatusBar, Text } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import { generateEquationForCurrentLevel } from './constants/gameData'
import TopBar from './components/TopBar'
import Clipboard from './components/Clipboard'
import AnswerButtons from './components/AnswerButtons'
import HelpModal from './components/HelpModal'
import PauseModal from './components/PauseModal'
import { MathEquation } from './types'

// Get screen dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Constants for the game
const QUESTIONS_TO_COMPLETE_LEVEL = 7;
const LEVEL_TIME_LIMIT = 60; // seconds
const MAX_LEVEL = 10; // Maximum level in the game
const MIN_QUESTIONS_TO_WIN = 7; // Minimum question number to win the level

// Scoring configuration by level
const SCORE_CONFIG = {
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

const MathAudit = () => {
    // Game state
    const [isPaused, setIsPaused] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [showPauseModal, setShowPauseModal] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [totalQuestions, setTotalQuestions] = useState(QUESTIONS_TO_COMPLETE_LEVEL);
    const [levelScore, setLevelScore] = useState(0); // Track score for current level separately
    const [answerSelected, setAnswerSelected] = useState(false);
    const [level, setLevel] = useState(1);
    const [gameOver, setGameOver] = useState(false);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [timerResetTrigger, setTimerResetTrigger] = useState(false);

    // Current question data - generate dynamically
    const [currentEquation, setCurrentEquation] = useState<MathEquation>(generateEquationForCurrentLevel(1));

    // Game progress tracking
    const [correctAnswersInLevel, setCorrectAnswersInLevel] = useState(0);
    const [wrongAnswersInLevel, setWrongAnswersInLevel] = useState(0);
    const [totalAttempts, setTotalAttempts] = useState(0);
    const [showLevelComplete, setShowLevelComplete] = useState(false);
    const [showLevelFailed, setShowLevelFailed] = useState(false);

    // console.log("Correct Answers in Level: ", correctAnswersInLevel);

    // Generate new question when level changes
    useEffect(() => {
        setCurrentEquation(generateEquationForCurrentLevel(level));
        setCorrectAnswersInLevel(0);
        setWrongAnswersInLevel(0);
        setTotalAttempts(0);
        setCurrentQuestion(1);
        setLevelScore(0); // Reset level score when level changes
    }, [level]);

    const handlePause = () => {
        setIsPaused(!isPaused);
        setShowPauseModal(!showPauseModal);
    };

    const handleContinue = () => {
        setIsPaused(false);
        setShowPauseModal(false);
    };

    const handleRestart = () => {
        // Reset game state while preserving the current level
        setCurrentEquation(generateEquationForCurrentLevel(level));
        setCurrentQuestion(1);
        setCorrectAnswersInLevel(0);
        setWrongAnswersInLevel(0);
        setTotalAttempts(0);
        setLevelScore(0); // Reset level score when restarting
        setAnswerSelected(false);
        setIsPaused(false);
        setShowPauseModal(false);
        setGameOver(false);
        setShowLevelComplete(false);
        setShowLevelFailed(false);
        // Toggle timer reset trigger to restart the timer
        setTimerResetTrigger(prev => !prev);
    };

    const handleHowToPlay = () => {
        setShowHelp(true);
        setShowPauseModal(false);
    };

    const handleLeaveGame = () => {
        Alert.alert(
            "Leave Game",
            "This would navigate back to the main menu in a complete app.",
            [
                { text: "OK", onPress: () => setShowPauseModal(false) }
            ]
        );
    };

    const handleHelp = () => {
        setShowHelp(true);
    };

    // Handle when time is up
    const handleTimeUp = useCallback(() => {
        // Level failed
        setShowLevelFailed(true);
        setIsPaused(true);
    }, []);

    // Handle level completion
    const handleLevelComplete = () => {
        setShowLevelComplete(false);
        setIsPaused(false);

        // Check if the current level is the last level (10)
        if (level >= MAX_LEVEL) {
            // Game is completed, show game completion screen
            setGameCompleted(true);
        } else {
            // Increment the level to move to the next one
            setLevel(prev => prev + 1);
            // Reset will happen automatically through the useEffect when level changes
        }
    };

    // Handle level failure
    const handleLevelFailed = () => {
        setShowLevelFailed(false);
        setIsPaused(false);
        // Reset with the same level
        setCurrentQuestion(1);
        setCorrectAnswersInLevel(0);
        // Toggle timer reset trigger to restart the timer
        setTimerResetTrigger(prev => !prev);
    };

    // Handle game completion (restart from level 1)
    const handleGameComplete = () => {
        setGameCompleted(false);
        // Reset to level 1
        handleRestart();
    };

    const handleAnswer = (selectedAnswer: boolean) => {
        // Prevent multiple answers or answering while paused
        if (answerSelected || isPaused) return;

        setAnswerSelected(true);
        setTotalAttempts(prev => prev + 1);

        // Check if user's answer (correct/incorrect) matches whether the equation is actually correct
        const isAnswerCorrect = (selectedAnswer === currentEquation.isCorrect);

        // Get the scoring config for the current level
        const levelConfig = SCORE_CONFIG[level as keyof typeof SCORE_CONFIG] || SCORE_CONFIG[1];

        // Update score and progress based on answer
        if (isAnswerCorrect) {
            // Calculate points based on level and question number
            const pointsToAdd = levelConfig.baseCorrect + (currentQuestion - 1) * levelConfig.incrementCorrect;

            // Update level scores
            setLevelScore(prev => prev + pointsToAdd);

            // Increment correct answers count
            setCorrectAnswersInLevel(prev => prev + 1);

            // Increment the current question counter
            const nextQuestionNumber = currentQuestion + 1;

            // Check if level is completed when current question exceeds 7
            if (nextQuestionNumber > MIN_QUESTIONS_TO_WIN) {
                setTimeout(() => {
                    setShowLevelComplete(true);
                    setIsPaused(true);
                    // We'll postpone the level change until after the user views the stats
                }, 500);
            } else {
                setCurrentQuestion(nextQuestionNumber);
            }

            // Generate a new question for the next question
            setCurrentEquation(generateEquationForCurrentLevel(level));

        } else {
            // Increment wrong answers count
            setWrongAnswersInLevel(prev => prev + 1);

            // Calculate penalty based on level and question number
            const pointsToPenalize = levelConfig.baseWrong + (currentQuestion - 2) * levelConfig.incrementWrong;

            // Update level scores (don't go below 0)
            setLevelScore(prev => Math.max(prev - pointsToPenalize, 0));

            // Decrement question number but not below 1
            setCurrentQuestion(Math.max(currentQuestion - 1, 1));

            // Generate a new question for the current level
            setCurrentEquation(generateEquationForCurrentLevel(level));
        }

        // Allow another answer after a delay
        setTimeout(() => {
            setAnswerSelected(false);
        }, 500);
    };

    return (
        <View style={styles.container}>
            <View style={styles.topBarContainer}>
                <TopBar
                    currentQuestion={currentQuestion}
                    totalQuestions={totalQuestions}
                    score={levelScore}
                    level={level}
                    onPause={handlePause}
                    onHelp={handleHelp}
                    onTimeUp={handleTimeUp}
                    shouldResetTimer={timerResetTrigger}
                    isPaused={isPaused}
                />
            </View>

            {/* Main Game Content */}
            <View style={styles.gameContent}>
                {gameCompleted ? (
                    <View style={styles.messageContainer}>
                        <Text style={styles.titleText}>Congratulations!</Text>
                        <Text style={styles.messageText}>You completed all 10 levels!</Text>
                        <View style={styles.nextLevelButton} >
                            <Text style={styles.nextLevelButtonText} onPress={handleGameComplete}>PLAY AGAIN</Text>
                        </View>
                    </View>
                ) : showLevelComplete ? (
                    <View style={styles.messageContainer}>
                        <Text style={styles.titleText}>Level {level} Completed!</Text>
                        <Text style={styles.messageText}>Level Score: {levelScore}</Text>
                        <Text style={styles.messageText}>Correct Answers: {correctAnswersInLevel}</Text>
                        <Text style={styles.messageText}>Wrong Answers: {wrongAnswersInLevel}</Text>
                        <Text style={styles.messageText}>Success Rate: {totalAttempts > 0 ? Math.round((correctAnswersInLevel / totalAttempts) * 100) : 0}%</Text>
                        <View style={styles.nextLevelButton} >
                            <Text style={styles.nextLevelButtonText} onPress={handleLevelComplete}>{level >= MAX_LEVEL ? "FINISH GAME" : "NEXT LEVEL"}</Text>
                        </View>
                    </View>
                ) : showLevelFailed ? (
                    <View style={styles.messageContainer}>
                        <Text style={styles.titleText}>Time's Up!</Text>
                        <Text style={styles.messageText}>Level Score: {levelScore}</Text>
                        <Text style={styles.messageText}>Correct Answers: {correctAnswersInLevel}</Text>
                        <Text style={styles.messageText}>Wrong Answers: {wrongAnswersInLevel}</Text>
                        <Text style={styles.messageText}>Success Rate: {totalAttempts > 0 ? Math.round((correctAnswersInLevel / totalAttempts) * 100) : 0}%</Text>
                        <View style={styles.nextLevelButton} >
                            <Text style={styles.nextLevelButtonText} onPress={handleLevelFailed}>TRY AGAIN</Text>
                        </View>
                    </View>
                ) : (
                    <>
                        <Clipboard equation={currentEquation} />
                        <AnswerButtons onAnswer={handleAnswer} disabled={answerSelected || isPaused} />
                    </>
                )}
            </View>

            {/* Help Modal */}
            <HelpModal visible={showHelp} onClose={() => setShowHelp(false)} />

            {/* Pause Modal */}
            <PauseModal
                visible={showPauseModal}
                onContinue={handleContinue}
                onRestart={handleRestart}
                onHowToPlay={handleHowToPlay}
                onLeaveGame={handleLeaveGame}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight || 0 : 0,
    },
    topBarContainer: {
        width: '100%',
        alignItems: 'center',
    },
    gameContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    messageContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 25,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        width: '85%',
    },
    titleText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#4A6572',
        marginBottom: 15,
        textAlign: 'center',
    },
    messageText: {
        fontSize: 18,
        color: '#757575',
        marginBottom: 8,
        textAlign: 'center',
    },
    actionText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#E57373',
        marginTop: 20,
        padding: 10,
    },
    nextLevelButton: {
        marginTop: 20,
        backgroundColor: '#4CAF50',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    nextLevelButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default MathAudit