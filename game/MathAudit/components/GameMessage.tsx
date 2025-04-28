// filepath: d:\iq-game\game\MathAudit\components\GameMessage.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { calculateSuccessRate } from '../utils/GameLogic';

interface GameMessageProps {
    type: 'complete' | 'failed' | 'gameover';
    level: number;
    score: number;
    correctAnswers: number;
    wrongAnswers: number;
    totalAttempts: number;
    onAction: () => void;
    maxLevel: number;
}

/**
 * Component hiển thị các thông báo trong game (hoàn thành cấp độ, thất bại, kết thúc game)
 */
const GameMessage = ({
    type,
    level,
    score,
    correctAnswers,
    wrongAnswers,
    totalAttempts,
    onAction,
    maxLevel
}: GameMessageProps) => {

    // Tính tỷ lệ thành công
    const successRate = calculateSuccessRate(correctAnswers, totalAttempts);

    // Xác định nội dung tiêu đề và nút hành động dựa vào loại thông báo
    const getTitleAndButton = () => {
        switch (type) {
            case 'complete':
                return {
                    title: `Level ${level} completed!`,
                    button: level >= maxLevel ? "LEAVE GAME" : "NEXT LEVEL"
                };
            case 'failed':
                return {
                    title: "Time up!",
                    button: "Play Again"
                };
            default:
                return {
                    title: "",
                    button: ""
                };
        }
    };

    const { title, button } = getTitleAndButton();

    // Nếu đây là thông báo kết thúc game, hiển thị thông báo đặc biệt
    if (type === 'gameover') {
        return (
            <View style={styles.messageContainer}>
                <Text style={styles.titleText}>{title}</Text>
                <Text style={styles.messageText}>You have completed all 10 levels!</Text>
                <View style={styles.nextLevelButton}>
                    <Text style={styles.nextLevelButtonText} onPress={onAction}>{button}</Text>
                </View>
            </View>
        );
    }

    // Hiển thị thông báo cấp độ hoàn thành hoặc thất bại
    return (
        <View style={styles.messageContainer}>
            <Text style={styles.titleText}>{title}</Text>
            <Text style={styles.messageText}>Score: {score}</Text>
            <Text style={styles.messageText}>Correct: {correctAnswers}</Text>
            <Text style={styles.messageText}>Incorrect: {wrongAnswers}</Text>
            <Text style={styles.messageText}>Accurancy: {successRate}%</Text>
            <View style={styles.nextLevelButton}>
                <Text style={styles.nextLevelButtonText} onPress={onAction}>{button}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    // Container thông báo
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
    // Tiêu đề thông báo
    titleText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#4A6572',
        marginBottom: 15,
        textAlign: 'center',
    },
    // Nội dung thông báo
    messageText: {
        fontSize: 18,
        color: '#757575',
        marginBottom: 8,
        textAlign: 'center',
    },
    // Nút hành động
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
    // Text cho nút hành động
    nextLevelButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default GameMessage;