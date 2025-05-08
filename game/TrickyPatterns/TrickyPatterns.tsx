import { View, StyleSheet, Platform, StatusBar as RNStatusBar, Alert, Text } from 'react-native'
import React from 'react'
import TopBar from '../../components/TopBar'
import AnswerButtons from './components/AnswerButtons'
import PauseModal from '../../components/PauseModal'
import GameMessage from '../../components/GameMessage'
import PatternComparison from './components/PatternComparison'
import { useTrickyPatterns } from './hooks/useTrickyPatterns'
import { GameContextProvider } from './context/GameContext'

/**
 * Component chính của game TrickyPatterns với Context Provider
 * Quản lý tất cả các thành phần của game và điều khiển luồng chơi
 */
const TrickyPatterns = () => {
    return (
        <GameContextProvider>
            <TrickyPatternsContent />
        </GameContextProvider>
    )
}

/**
 * Nội dung chính của game TrickyPatterns
 * Được bao bọc trong Context Provider
 */
const TrickyPatternsContent = () => {
    // Sử dụng hook useTrickyPatterns để quản lý trạng thái game
    const gameState = useTrickyPatterns();

    // Xử lý việc rời khỏi game
    const handleLeaveGame = () => {
        Alert.alert(
            "Rời khỏi game",
            "Điều này sẽ chuyển về menu chính trong ứng dụng hoàn chỉnh.",
            [
                { text: "OK", onPress: () => gameState.handleContinue() }
            ]
        );
    };

    return (
        <View style={styles.container}>
            {/* Thanh trạng thái trên cùng */}
            <View style={styles.topBarContainer}>
                <TopBar
                    currentQuestion={gameState.currentQuestion}
                    totalQuestions={gameState.totalQuestions}
                    score={gameState.levelScore}
                    level={gameState.level}
                    onPause={gameState.handlePause}
                    onTimeUp={gameState.handleTimeUp}
                    shouldResetTimer={gameState.timerResetTrigger}
                />
            </View>

            {/* Nội dung chính của game */}
            <View style={styles.gameContent}>
                {gameState.gameCompleted ? (
                    // Hiển thị thông báo hoàn thành game
                    <GameMessage
                        type="gameover"
                        level={gameState.level}
                        score={gameState.levelScore}
                        correctAnswers={gameState.correctAnswersInLevel}
                        wrongAnswers={gameState.wrongAnswersInLevel}
                        onAction={gameState.handleGameComplete}
                        maxLevel={gameState.maxLevel}
                    />
                ) : gameState.showLevelComplete ? (
                    // Hiển thị thông báo hoàn thành cấp độ
                    <GameMessage
                        type="complete"
                        level={gameState.level}
                        score={gameState.levelScore}
                        correctAnswers={gameState.correctAnswersInLevel}
                        wrongAnswers={gameState.wrongAnswersInLevel}
                        onAction={gameState.handleLevelComplete}
                        maxLevel={gameState.maxLevel}
                    />
                ) : gameState.showLevelFailed ? (
                    // Hiển thị thông báo thất bại
                    <GameMessage
                        type="failed"
                        level={gameState.level}
                        score={gameState.levelScore}
                        correctAnswers={gameState.correctAnswersInLevel}
                        wrongAnswers={gameState.wrongAnswersInLevel}
                        onAction={gameState.handleLevelFailed}
                        maxLevel={gameState.maxLevel}
                    />
                ) : (
                    // Hiển thị màn hình chơi game chính
                    <>
                        {gameState.currentPattern && (
                            <>
                                <Text style={styles.instructionText}>
                                    Will rotating the right pattern make it match the left?
                                </Text>
                                <PatternComparison
                                    pattern1={gameState.currentPattern.pattern1}
                                    pattern2={gameState.currentPattern.pattern2}
                                    showResult={gameState.showResult}
                                    isCorrectAnswer={gameState.isCorrectAnswer}
                                    animationDuration={500} // Thời gian animation 500ms
                                    rotation={gameState.currentPattern.rotation} // Truyền góc xoay từ pattern
                                />
                            </>
                        )}

                        {/* Hiển thị các nút trả lời */}
                        <AnswerButtons
                            onAnswer={gameState.handleAnswer}
                            disabled={gameState.answerSelected || gameState.isPaused}
                        />
                    </>
                )}
            </View>



            {/* Modal tạm dừng */}
            <PauseModal
                ref={gameState.modalRefs.pauseModalRef}
                onContinue={gameState.handleContinue}
                onRestart={gameState.restartLevel}
                onHowToPlay={gameState.handleHowToPlay}
                onLeaveGame={handleLeaveGame}
            />
        </View>
    )
}

// Định nghĩa style
const styles = StyleSheet.create({
    // Container chính
    container: {
        flex: 1,
        backgroundColor: '#3a2c6a',
        paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight || 0 : 0,
    },
    // Container cho thanh trạng thái trên cùng
    topBarContainer: {
        width: '100%',
        alignItems: 'center',
    },
    // Nội dung chính của game
    gameContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    // Text hướng dẫn
    instructionText: {
        color: '#fff',
        fontSize: 20,
        marginBottom: 10,
        textAlign: 'center',
        backgroundColor: '#282047',
        marginLeft: 40,
        marginRight: 40,
    },
});

export default TrickyPatterns