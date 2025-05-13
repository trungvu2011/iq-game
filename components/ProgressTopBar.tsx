import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import PauseIcon from '../assets/icons/PauseIcon';
import QuestionIcon from '../assets/icons/QuestionIcon';
import { BaseModalRefType } from './BaseModal';

// Lấy chiều rộng màn hình
const screenWidth = Dimensions.get('window').width;

/**
 * Props cho component ProgressTopBar
 */
interface ProgressTopBarProps {
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
    // Modal refs for external control
    helpModalRef?: React.RefObject<BaseModalRefType>;
    pauseModalRef?: React.RefObject<BaseModalRefType>;
    // Styling
    textColor?: string;
    showTimer?: boolean;
    showQuestions?: boolean;
    showScore?: boolean;
    showHelpButton?: boolean;
    showPauseButton?: boolean;
}

/**
 * Component InfoItem - Hiển thị một mục thông tin trong thanh trạng thái
 */
const InfoItem = ({
    value,
    textColor = 'white'
}: {
    value: string | number,
    textColor?: string
}) => (
    <View style={styles.infoItem}>
        <Text style={[styles.infoValue, { color: textColor }]}>{value}</Text>
    </View>
);

/**
 * Component Timer - Quản lý và hiển thị thời gian còn lại
 */
const Timer = ({
    isPaused = false,
    shouldReset = false,
    level = 1,
    onTimeUp = () => { },
    timeRemaining,
    formattedTime,
    textColor = 'white'
}: {
    isPaused?: boolean,
    shouldReset?: boolean,
    level?: number,
    onTimeUp?: () => void,
    timeRemaining?: number,
    formattedTime?: string,
    textColor?: string
}) => {
    // console.log("timer render")
    // Nếu có formattedTime được truyền vào, sử dụng giá trị đó
    if (formattedTime) {
        return <InfoItem value={formattedTime} textColor={textColor} />;
    }

    // Nếu không có formattedTime, sử dụng logic cũ
    // Thời gian còn lại (giây)
    const [seconds, setSeconds] = useState(timeRemaining || 60); // Default to 60 if timeRemaining is undefined
    // Trạng thái hoạt động của bộ đếm thời gian
    const [timerActive, setTimerActive] = useState(true);
    // Ref để theo dõi khi nào cần gọi onTimeUp
    const shouldCallTimeUp = useRef(false);

    // Cập nhật trạng thái hoạt động khi isPaused thay đổi
    useEffect(() => {
        setTimerActive(!isPaused);
    }, [isPaused]);

    // Cập nhật khi hết giờ
    useEffect(() => {
        if (seconds <= 0) {
            setTimerActive(false);
            onTimeUp();
        }
    }, [seconds, onTimeUp]);

    // Effect riêng để gọi onTimeUp ngoài quá trình render
    useEffect(() => {
        if (shouldCallTimeUp.current) {
            onTimeUp();
            shouldCallTimeUp.current = false;
        }
    }, [seconds, onTimeUp]);

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
                        // Đánh dấu để gọi onTimeUp trong effect riêng biệt
                        shouldCallTimeUp.current = true;
                        return 0;
                    }
                    // console.log('seconds', newSeconds);
                    return newSeconds;
                });
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [timerActive]);

    // Đặt lại bộ đếm thời gian khi cấp độ thay đổi
    useEffect(() => {
        setSeconds(timeRemaining || 60); // Đặt lại thời gian với fallback 60 giây
        // Đảm bảo bộ đếm thời gian hoạt động khi đặt lại
        setTimerActive(true);
    }, [level, shouldReset, timeRemaining]);

    /**
     * Định dạng thời gian thành chuỗi MM:SS
     */
    const formatTime = (totalSeconds: number): string => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return <InfoItem value={formatTime(seconds || 0)} textColor={textColor} />;
};

/**
 * Component ProgressTopBar - Hiển thị thanh trạng thái trên cùng của game
 * Có thể tái sử dụng cho tất cả các game
 */
const ProgressTopBar = ({
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
    helpModalRef,
    pauseModalRef,
    textColor = 'white',
    showTimer = true,
    showQuestions = true,
    showScore = true,
    showHelpButton = true,
    showPauseButton = true,
}: ProgressTopBarProps) => {
    // Đảm bảo currentQuestion không vượt quá totalQuestions khi hiển thị
    const displayQuestion = Math.min(currentQuestion, totalQuestions);

    // Xử lý khi nhấn nút pause
    const handlePause = () => {
        if (pauseModalRef?.current) {
            pauseModalRef.current.show();
        }
        onPause();
    };

    // Xử lý khi nhấn nút help
    const handleHelp = () => {
        if (helpModalRef?.current) {
            helpModalRef.current.show();
        }
        onHelp();
    };

    return (
        <View style={styles.outerContainer}>
            <View style={styles.container}>
                {/* Trái: Nút tạm dừng */}
                {showPauseButton && (
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={handlePause}
                    >
                        <PauseIcon width={20} height={20} />
                    </TouchableOpacity>
                )}

                {/* Giữa: Khu vực thông tin */}
                <View style={styles.infoContainer}>
                    {/* Bộ đếm thời gian */}
                    {showTimer && (
                        <Timer
                            isPaused={isPaused}
                            shouldReset={shouldResetTimer}
                            level={level}
                            onTimeUp={onTimeUp}
                            timeRemaining={timeRemaining}
                            formattedTime={formattedTime}
                            textColor={textColor}
                        />
                    )}

                    {/* Tiến trình câu hỏi */}
                    {showQuestions && (
                        <InfoItem
                            value={`${displayQuestion}/${totalQuestions}`}
                            textColor={textColor}
                        />
                    )}

                    {/* Điểm số */}
                    {showScore && (
                        <InfoItem
                            value={score}
                            textColor={textColor}
                        />
                    )}
                </View>

                {/* Phải: Nút trợ giúp */}
                {showHelpButton && (
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={handleHelp}
                    >
                        <QuestionIcon width={20} height={20} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    // Outer container để căn giữa hoàn toàn
    outerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Container chính
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        width: screenWidth,
    },
    // Nút biểu tượng
    iconButton: {
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    // Container khu vực thông tin
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        flex: 1,
        gap: 40,
        marginLeft: 30,
        marginRight: 30,
        paddingVertical: 3,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 20,
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
        textAlign: 'center',
    },
});

export default ProgressTopBar