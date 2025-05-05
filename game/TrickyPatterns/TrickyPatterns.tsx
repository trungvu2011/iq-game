import { View, StyleSheet, Platform, StatusBar as RNStatusBar, Dimensions, Alert, Text } from 'react-native'
import React from 'react'
import TopBar from './components/TopBar'
import AnswerButtons from './components/AnswerButtons'
import HelpModal from './components/HelpModal'
import PauseModal from './components/PauseModal'
import GameMessage from './components/GameMessage'
import PatternComparison from './components/PatternComparison'
import { useTrickyPatterns } from './hooks/useTrickyPatterns'

// Lấy kích thước màn hình
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

/**
 * Component chính của game TrickyPatterns
 * Quản lý tất cả các thành phần của game và điều khiển luồng chơi
 */
const TrickyPatterns = () => {
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
                    isPaused={gameState.isPaused}
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
                        totalAttempts={gameState.totalAttempts}
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
                        totalAttempts={gameState.totalAttempts}
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
                        totalAttempts={gameState.totalAttempts}
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
                                    gridA={gameState.currentPattern.grid_a}
                                    colorMapA={gameState.currentPattern.color_map_a}
                                    gridB={gameState.currentPattern.grid_b}
                                    colorMapB={gameState.currentPattern.color_map_b}
                                    rotation={gameState.currentPattern.rotation}
                                    showResult={gameState.showResult}
                                    isCorrectAnswer={gameState.isCorrectAnswer}
                                    gridSize={gameState.currentPattern.grid_size}
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

            {/* Modal trợ giúp */}
            <HelpModal
                visible={gameState.showHelp}
                onClose={() => gameState.setShowHelp(false)}
            />

            {/* Modal tạm dừng */}
            <PauseModal
                visible={gameState.showPauseModal}
                onContinue={gameState.handleContinue}
                onRestart={gameState.handleRestart}
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