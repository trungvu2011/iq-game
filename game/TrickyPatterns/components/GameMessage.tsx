// filepath: d:\iq-game\game\MathAudit\components\GameMessage.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

// Lấy kích thước màn hình
const { width: screenWidth } = Dimensions.get('window');

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
    const successRate = totalAttempts > 0 ? Math.round((correctAnswers / totalAttempts) * 100) : 0;

    // Xác định nội dung tiêu đề và nút hành động dựa vào loại thông báo
    const getTitleAndButton = () => {
        switch (type) {
            case 'complete':
                return {
                    title: `Cấp độ ${level} hoàn thành!`,
                    button: level >= maxLevel ? "KẾT THÚC GAME" : "CẤP ĐỘ TIẾP THEO"
                };
            case 'failed':
                return {
                    title: "Hết thời gian!",
                    button: "THỬ LẠI"
                };
            case 'gameover':
                return {
                    title: "Chúc mừng!",
                    button: "CHƠI LẠI"
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
                <Text style={styles.messageText}>Bạn đã hoàn thành tất cả {maxLevel} cấp độ!</Text>
                <TouchableOpacity style={styles.button} onPress={onAction}>
                    <Text style={styles.buttonText}>{button}</Text>
                </TouchableOpacity>
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
            <TouchableOpacity style={styles.button} onPress={onAction}>
                <Text style={styles.buttonText}>{button}</Text>
            </TouchableOpacity>
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
        maxWidth: 500,
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
    button: {
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
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default GameMessage;