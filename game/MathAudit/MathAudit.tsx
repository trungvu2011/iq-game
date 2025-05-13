import { View, StyleSheet, Platform, StatusBar as RNStatusBar } from 'react-native'
import React from 'react'
import ProgressTopBar from './components/ProgressTopBar'
import Clipboard from './components/Clipboard'
import AnswerButtons from './components/AnswerButtons'
import HelpModal from './components/HelpModal'
import PauseModal from './components/PauseModal'
import AnswerModal from './components/AnswerModal'
import GameMessage from './components/GameMessage'
import { useMathAudit } from './hooks/useMathAudit'
import { Alert } from 'react-native'

/**
 * Component chính của game Math Audit
 * Quản lý tất cả các thành phần của game và điều khiển luồng chơi
 */
const MathAudit = () => {
    // Sử dụng hook useMathAudit để quản lý trạng thái game
    const gameState = useMathAudit();

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
            <View style={styles.ProgressTopBarContainer}>
                <ProgressTopBar
                    currentQuestion={gameState.currentQuestion}
                    totalQuestions={gameState.totalQuestions}
                    score={gameState.levelScore}
                    level={gameState.level}
                    onPause={gameState.handlePause}
                    onHelp={gameState.handleHelp}
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
                        {/* Hiển thị phương trình */}
                        <Clipboard equation={gameState.currentEquation} />

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

            {/* Modal câu trả lời - hiển thị khi người chơi trả lời sai */}
            <AnswerModal
                visible={gameState.showAnswerModal}
                onClose={gameState.handleCloseAnswerModal}
                equation={gameState.wrongAnswerEquation}
            />
        </View>
    )
}

// Định nghĩa style
const styles = StyleSheet.create({
    // Container chính
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight || 0 : 0,
    },
    // Container cho thanh trạng thái trên cùng
    ProgressTopBarContainer: {
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
});

export default MathAudit