import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { useTimer } from '../hooks/game/useTimer';
import HelpModal from './HelpModal';
import { useGameContext } from '../context/GameContext';
import { ActionTypes } from '../types/gameTypes';
import PlayIcon from '../../../commons/icons/PlayIcon';
import PauseIcon from '../../../commons/icons/PauseIcon';
import QuestionIcon from '../../../commons/icons/QuestionIcon';

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
    // Ref để theo dõi khi nào cần gọi onTimeUp
    const shouldCallTimeUp = useRef(false);

    // Cập nhật trạng thái hoạt động khi isPaused thay đổi
    useEffect(() => {
        setTimerActive(!isPaused);
    }, [isPaused]);

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
        setSeconds(60); // Đặt lại thời gian là 60 giây cho cấp độ mới
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
}: TopBarProps) => {
    // Đảm bảo currentQuestion không vượt quá totalQuestions khi hiển thị
    const displayQuestion = Math.min(currentQuestion, totalQuestions);

    // Lấy modalRefs và dispatch từ GameContext để sử dụng chung với các hoạt động khác
    const { modalRefs, dispatch } = useGameContext();

    // Sử dụng hook useTimer
    const { timeRemaining, formattedTime, resetTimer, isPaused } = useTimer();

    // Hiển thị modal trợ giúp và tạm dừng game
    const handleShowHelpModal = () => {
        modalRefs.helpModalRef.current?.show();
        dispatch({ type: ActionTypes.PAUSE_GAME }); // Đảm bảo game tạm dừng khi mở help modal
        onHelp(); // Gọi callback từ props để thực hiện các tác vụ bổ sung
    };

    // Xử lý đóng modal help và tiếp tục đếm thời gian
    const handleCloseHelpModal = () => {
        modalRefs.helpModalRef.current?.hide();
        dispatch({ type: ActionTypes.CONTINUE_GAME }); // Đảm bảo game tiếp tục sau khi đóng modal
    };

    return (
        <View style={styles.container}>
            {/* Trái: Nút tạm dừng */}
            <TouchableOpacity
                style={styles.iconButton}
                onPress={onPause}
            >
                <PauseIcon width={20} height={20} />  // Nếu không, hiển thị biểu tượng Pause
            </TouchableOpacity>

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
                <InfoItem
                    value={`${displayQuestion}/${totalQuestions}`}
                />

                {/* Điểm số */}
                <InfoItem
                    value={score}
                />
            </View>

            {/* Phải: Nút trợ giúp */}
            <TouchableOpacity
                style={styles.iconButton}
                onPress={handleShowHelpModal} // Mở modal trợ giúp
            >
                <QuestionIcon width={20} height={20} />
            </TouchableOpacity>

            {/* Modal trợ giúp - sẽ sử dụng ref từ GameContext */}
            <HelpModal
                ref={modalRefs.helpModalRef}
                onClose={handleCloseHelpModal}
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
        backgroundColor: '#62588a',
    },
    // Container khu vực thông tin
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        flex: 1,
        gap: 40,
        backgroundColor: '#2f2557',
        marginLeft: 30,
        marginRight: 30,
        borderRadius: 10,
        paddingVertical: 3,
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