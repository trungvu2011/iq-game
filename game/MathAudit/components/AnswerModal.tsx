import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { MathEquation } from '../types'

// Props cho component AnswerModal
interface AnswerModalProps {
    visible: boolean;
    onClose: () => void;
    equation: MathEquation | null;
}

/**
 * Component EquationDisplay - Hiển thị phương trình toán học
 * @param equation Mảng chứa các phần của phương trình
 */
const EquationDisplay = ({ equation }: { equation: string[] }) => (
    <View style={styles.equationContainer}>
        {equation.map((item, index) => (
            <Text key={index} style={styles.equationText}>
                {item}
            </Text>
        ))}
    </View>
);

/**
 * Component AnswerSection - Hiển thị phần câu trả lời
 * @param isUserAnswer Xác định đây là câu trả lời của người dùng hay câu trả lời đúng
 * @param equation Mảng chứa các phần của phương trình cần hiển thị
 */
const AnswerSection = ({
    isUserAnswer,
    equation
}: {
    isUserAnswer: boolean,
    equation: string[]
}) => (
    <View style={[
        styles.answerStatusContainer,
        {
            backgroundColor: isUserAnswer ? '#FFEBEE' : '#E8F5E9',
            marginTop: isUserAnswer ? 0 : 10
        }
    ]}>
        <Text style={[
            styles.answerStatusText,
            { color: isUserAnswer ? '#D32F2F' : '#43A047' }
        ]}>
            {isUserAnswer ? 'Câu trả lời của bạn:' : 'Câu trả lời đúng:'}
        </Text>
        <EquationDisplay equation={equation} />
    </View>
);

/**
 * Component ModalWrapper - Bao bọc nội dung của modal
 * @param visible Trạng thái hiển thị của modal
 * @param onClose Hàm xử lý khi đóng modal
 * @param children Nội dung bên trong modal
 */
const ModalWrapper = ({
    visible,
    onClose,
    children
}: {
    visible: boolean,
    onClose: () => void,
    children: React.ReactNode
}) => (
    <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={onClose}
    >
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                {children}
            </View>
        </View>
    </Modal>
);

/**
 * Component chính AnswerModal - Hiển thị modal kết quả khi người dùng trả lời sai
 */
const AnswerModal = ({ visible, onClose, equation }: AnswerModalProps) => {
    // Nếu không có dữ liệu phương trình, không hiển thị gì cả
    if (!equation) return null;

    // Lấy dữ liệu câu trả lời của người dùng (ngược với thực tế vì họ đã chọn sai)
    const userAnsweredCorrect = !equation.isCorrect;

    /**
     * Hàm tính toán và trả về phương trình đúng
     * @returns Mảng chứa phương trình đúng
     */
    const getCorrectEquation = () => {
        if (!equation) return [];

        // Trích xuất các phần của phương trình (không bao gồm kết quả)
        const equationParts = [...equation.equation];
        // Tìm vị trí của dấu bằng
        const equalsIndex = equationParts.indexOf('=');
        if (equalsIndex !== -1) {
            // Lấy phần tính toán (trước dấu bằng)
            const calculationPart = equationParts.slice(0, equalsIndex);

            // Đối với phương trình đúng, giữ nguyên kết quả
            if (equation.isCorrect) {
                return equationParts;
            }

            // Đối với phương trình sai, cần hiển thị kết quả đúng
            // Thay thế các ký hiệu phép tính để sử dụng với eval()
            const evalExpression = calculationPart
                .join(' ')
                .replace(/×/g, '*')
                .replace(/÷/g, '/');

            try {
                // Đánh giá biểu thức một cách an toàn
                const correctResult = Math.round(eval(evalExpression));
                // Trả về phương trình đã sửa chữa
                return [...calculationPart, '=', correctResult.toString()];
            } catch (error) {
                // Nếu đánh giá thất bại, trả về phương trình gốc
                return equationParts;
            }
        }
        return equationParts;
    };

    // Lấy phương trình đúng
    const correctEquation = getCorrectEquation();

    return (
        <ModalWrapper visible={visible} onClose={onClose}>
            {/* Biểu tượng báo sai */}
            <Text style={styles.modalTitle}>❌</Text>

            {/* Phần giải thích câu trả lời */}
            <View style={styles.answerExplanation}>
                {/* Phần câu trả lời của người dùng - chỉ hiển thị nếu phương trình sai */}
                {!equation.isCorrect && (
                    <AnswerSection isUserAnswer={true} equation={equation.equation} />
                )}

                {/* Phần câu trả lời đúng */}
                <AnswerSection isUserAnswer={false} equation={correctEquation} />
            </View>

            {/* Nút chuyển tiếp */}
            <TouchableOpacity
                style={styles.nextButton}
                onPress={onClose}
            >
                <Text style={styles.nextButtonText}>TIẾP TỤC</Text>
            </TouchableOpacity>
        </ModalWrapper>
    )
}

const styles = StyleSheet.create({
    // Phần overlay của modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    // Nội dung của modal
    modalContent: {
        width: '85%',
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    // Tiêu đề modal
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#E53935',
    },
    // Container cho phương trình
    equationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        paddingHorizontal: 5,
    },
    // Text của phương trình
    equationText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginHorizontal: 2,
    },
    // Phần giải thích câu trả lời
    answerExplanation: {
        width: '100%',
        marginTop: 15,
    },
    // Container cho trạng thái câu trả lời
    answerStatusContainer: {
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
    },
    // Text cho trạng thái câu trả lời
    answerStatusText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    // Nút chuyển tiếp
    nextButton: {
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 40,
        backgroundColor: '#4CAF50',
        borderRadius: 25,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    // Text cho nút chuyển tiếp
    nextButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default AnswerModal