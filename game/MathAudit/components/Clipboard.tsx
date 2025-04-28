import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React, { useMemo } from 'react'
import { MathEquation } from '../types'

// Lấy kích thước màn hình
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Kích thước font cơ bản
const MAX_FONT_SIZE = 48;
const MIN_FONT_SIZE = 28;

/**
 * Props cho component Clipboard
 */
interface ClipboardProps {
    equation: MathEquation;
    showAnswer?: boolean;
}

/**
 * Component ClipboardClip - Hiển thị phần kẹp giấy ở trên cùng của clipboard
 */
const ClipboardClip = () => (
    <View style={styles.clipboardClip}>
        <View style={styles.clipInner} />
    </View>
);

/**
 * Component EquationDisplay - Hiển thị phương trình toán học
 * @param equation Mảng chứa các phần của phương trình
 * @param fontSize Kích thước font cho phương trình
 */
const EquationDisplay = ({
    equation,
    fontSize
}: {
    equation: string[],
    fontSize: number
}) => (
    <>
        {equation.map((item, index) => (
            <Text
                key={index}
                style={[styles.equationItem, { fontSize }]}
            >
                {item}
            </Text>
        ))}
    </>
);

/**
 * Component AnswerDisplay - Hiển thị kết quả đánh giá phương trình
 * @param isCorrect Phương trình có đúng không
 */
const AnswerDisplay = ({
    isCorrect
}: {
    isCorrect: boolean
}) => (
    <View style={styles.answerContainer}>
        <Text style={[
            styles.answerText,
            { color: isCorrect ? '#4CAF50' : '#E53935' }
        ]}>
            Phương trình này {isCorrect ? 'ĐÚNG' : 'SAI'}
        </Text>
    </View>
);

/**
 * Component Clipboard - Hiển thị phương trình toán học trên một bảng kẹp giấy
 */
const Clipboard = ({ equation, showAnswer = false }: ClipboardProps) => {
    // Tính toán kích thước font dựa trên độ dài phương trình
    const fontSize = useMemo(() => {
        // Tính tổng độ dài của tất cả các phần trong phương trình
        const totalLength = equation.equation.reduce((acc, curr) => acc + curr.length, 0);

        // Tính toán hệ số phức tạp dựa trên số lượng phần tử và độ dài của chúng
        const complexityFactor = equation.equation.length * 0.2 + totalLength * 0.4;

        // Tính toán kích thước font tỷ lệ nghịch với độ phức tạp
        // Phương trình phức tạp hơn có kích thước font nhỏ hơn
        let calculatedSize = MAX_FONT_SIZE - complexityFactor * 2;

        // Đảm bảo kích thước font nằm trong giới hạn
        return Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, calculatedSize));
    }, [equation]);

    return (
        <View style={styles.clipboardContainer}>
            {/* Kẹp giấy */}
            <ClipboardClip />

            {/* Nội dung giấy */}
            <View style={styles.paper}>
                {/* Hiển thị phương trình */}
                <EquationDisplay equation={equation.equation} fontSize={fontSize} />

                {/* Hiển thị kết quả đánh giá nếu được yêu cầu */}
                {showAnswer && <AnswerDisplay isCorrect={equation.isCorrect} />}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    // Container chính
    clipboardContainer: {
        width: screenWidth * 0.9,
        height: screenHeight * 0.6,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        alignSelf: 'center',
        marginBottom: 80,
    },
    // Kẹp giấy
    clipboardClip: {
        width: 60,
        height: 20,
        backgroundColor: '#FFC107',
        position: 'absolute',
        top: -5,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    // Phần bên trong kẹp giấy
    clipInner: {
        width: 30,
        height: 8,
        backgroundColor: '#E6A800',
        borderRadius: 2,
    },
    // Giấy
    paper: {
        width: '100%',
        height: '100%',
        paddingTop: 30,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Mục phương trình
    equationItem: {
        marginVertical: 10,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#333',
        // Kích thước font được áp dụng động
    },
    // Container kết quả đánh giá
    answerContainer: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#F8F9FA',
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#E0E0E0',
        width: '80%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    // Text kết quả đánh giá
    answerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Clipboard