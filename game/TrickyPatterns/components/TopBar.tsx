import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'

// Lấy chiều rộng màn hình
const screenWidth = Dimensions.get('window').width;

/**
 * Props cho component TopBar
 */
interface TopBarProps {
    totalQuestions?: number;
    currentQuestion?: number;
    score?: number;
    level?: number;
    onPause?: () => void;
    onHelp?: () => void;
    onTimeUp?: () => void;
    shouldResetTimer?: boolean;
    isPaused?: boolean;
    timeRemaining?: number;
    formattedTime?: string;
    timePercentage?: number;
}

/**
 * Component IconButton - Nút biểu tượng trong thanh trạng thái
 */
const IconButton = ({
    icon,
    onPress
}: {
    icon: string,
    onPress: () => void
}) => (
    <TouchableOpacity
        style={styles.iconButton}
        onPress={onPress}
    >
        <Text style={styles.iconText}>{icon}</Text>
    </TouchableOpacity>
);

/**
 * Component InfoItem - Hiển thị một mục thông tin trong thanh trạng thái
 */
const InfoItem = ({
    value
}: {
    value: string | number
}) => (
    <View style={styles.infoItem}>
        <Text style={styles.infoValue}>{value}</Text>
    </View>
);

/**
 * Component Timer - Quản lý và hiển thị thời gian còn lại
 * Có thể sử dụng giá trị từ hook useTimer hoặc tự quản lý state
 */
const Timer = ({
    isPaused,
    shouldReset,
    level,
    onTimeUp,
    timeRemaining,
    formattedTime
}: {
    isPaused: boolean,
    shouldReset: boolean,
    level: number,
    onTimeUp: () => void,
    timeRemaining?: number,
    formattedTime?: string
}) => {
    // Nếu có formattedTime được truyền vào, sử dụng giá trị đó
    if (formattedTime) {
        return <InfoItem value={formattedTime} />;
    }

    // Nếu không có formattedTime, sử dụng logic cũ
    // Thời gian còn lại (giây)
    const [seconds, setSeconds] = useState(timeRemaining || 60);
    // Trạng thái hoạt động của bộ đếm thời gian
    const [timerActive, setTimerActive] = useState(true);

    // Cập nhật trạng thái hoạt động khi isPaused thay đổi
    useEffect(() => {
        setTimerActive(!isPaused);
    }, [isPaused]);

    // Quản lý bộ đếm thời gian
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (timerActive) {
            interval = setInterval(() => {
                setSeconds(seconds => {
                    const newSeconds = seconds - 1;
                    if (newSeconds <= 0) {
                        // Xóa interval khi hết thời gian
                        clearInterval(interval);
                        // Gọi callback onTimeUp
                        onTimeUp();
                        // Đặt lại bộ đếm thời gian cho cấp độ tiếp theo
                        return 60;
                    }
                    return newSeconds;
                });
            }, 1000);
        }

        // Xóa interval khi component bị hủy
        return () => clearInterval(interval);
    }, [timerActive, onTimeUp]);

    // Đặt lại bộ đếm thời gian khi cấp độ thay đổi hoặc shouldReset là true
    useEffect(() => {
        setSeconds(60);
        // Đảm bảo bộ đếm thời gian hoạt động khi đặt lại
        setTimerActive(true);
    }, [level, shouldReset]);

    /**
     * Định dạng thời gian thành chuỗi MM:SS
     */
    const formatTime = (totalSeconds: number): string => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return <InfoItem value={formatTime(seconds)} />;
};

/**
 * Component TopBar - Hiển thị thanh trạng thái trên cùng của game
 */
const TopBar = ({
    totalQuestions = 7,
    currentQuestion = 1,
    score = 0,
    level = 1,
    onPause = () => { },
    onHelp = () => { },
    onTimeUp = () => { },
    shouldResetTimer = false,
    isPaused = false,
    timeRemaining,
    formattedTime,
    timePercentage
}: TopBarProps) => {
    // Đảm bảo currentQuestion không vượt quá totalQuestions khi hiển thị
    const displayQuestion = Math.min(currentQuestion, totalQuestions);

    return (
        <View style={styles.container}>
            {/* Trái: Nút tạm dừng */}
            <IconButton
                icon={isPaused ? "▶️" : "⏸️"}
                onPress={onPause}
            />

            {/* Giữa: Khu vực thông tin */}
            <View style={styles.infoContainer}>
                {/* Bộ đếm thời gian */}
                <Timer
                    isPaused={isPaused}
                    shouldReset={shouldResetTimer}
                    level={level}
                    onTimeUp={onTimeUp}
                    timeRemaining={timeRemaining}
                    formattedTime={formattedTime}
                />

                {/* Tiến trình câu hỏi */}
                <InfoItem value={`${displayQuestion}/${totalQuestions}`} />

                {/* Điểm số */}
                <InfoItem value={score} />
            </View>

            {/* Phải: Nút trợ giúp */}
            <IconButton
                icon="❓"
                onPress={onHelp}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    // Container chính
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#2d1b56', // tím đậm
        paddingVertical: 10,
        paddingHorizontal: 16,
        width: screenWidth,
    },
    // Nút biểu tượng
    iconButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: '#322a4f', // tím nhạt
    },
    // Text biểu tượng
    iconText: {
        fontSize: 20,
        color: 'white',
    },
    // Container khu vực thông tin
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        flex: 1,
        gap: 20,
    },
    // Mục thông tin
    infoItem: {
        alignItems: 'center',
        minWidth: 60,
    },
    // Giá trị thông tin
    infoValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
});

export default TopBar