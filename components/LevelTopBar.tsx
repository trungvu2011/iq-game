import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import PauseIcon from '../assets/icons/PauseIcon';
import QuestionIcon from '../assets/icons/QuestionIcon';
import { BaseModalRefType } from './BaseModal';

// Lấy chiều rộng màn hình
const screenWidth = Dimensions.get('window').width;

/**
 * Props cho component LevelTopBar
 */
interface LevelTopBarProps {
  totalQuestions?: number;
  currentQuestion?: number;
  score?: number;
  level?: number;
  onPause?: () => void;
  onHelp?: () => void;
  onTimeUp?: () => void;
  onAction?: () => void;
  shouldResetTimer?: boolean;
  isPaused?: boolean;
  // Modal refs for external control
  helpModalRef?: React.RefObject<BaseModalRefType>;
  pauseModalRef?: React.RefObject<BaseModalRefType>;
  // Styling
  textColor?: string;
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
 * Component LevelTopBar - Hiển thị thanh trạng thái trên cùng của game
 * Có thể tái sử dụng cho tất cả các game
 */
const LevelTopBar = ({
  totalQuestions = 7,
  currentQuestion = 1,
  score = 0,
  level = 1,
  onPause = () => { },
  onHelp = () => { },
  helpModalRef,
  pauseModalRef,
  textColor = 'white',
  showQuestions = true,
  showScore = true,
  showHelpButton = true,
  showPauseButton = true,
}: LevelTopBarProps) => {
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
          <InfoItem value='' />

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

export default LevelTopBar