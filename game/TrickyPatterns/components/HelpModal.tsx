import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import React, { forwardRef } from 'react'
import BaseModal, { BaseModalRefType } from '../../../components/BaseModal'

interface HelpModalProps {
    onClose: () => void;
}

/**
 * Component hiển thị modal hướng dẫn chơi game
 */
const HelpModal = forwardRef<BaseModalRefType, HelpModalProps>(({ onClose }, ref) => {
    return (
        <BaseModal
            ref={ref}
            showCloseButton={false}
            touchOutsideToHide
            onRequestClose={onClose}
            bodyStyle={{
                backgroundColor: '#FFFFFF',
                borderRadius: 15,
                padding: 0,
                width: '90%',
                maxWidth: 500,
                maxHeight: '90%',
            }}
        >
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Hướng dẫn</Text>

                <ScrollView style={styles.scrollView}>
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Mục tiêu</Text>
                        <Text style={styles.sectionText}>
                            Nhiệm vụ của bạn là xác định xem hai lưới mẫu có giống nhau hay không.
                        </Text>
                    </View>

                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Cách chơi</Text>
                        <Text style={styles.sectionText}>
                            1. Xem xét kỹ lưới mẫu bên trái (Lưới A) và bên phải (Lưới B).
                        </Text>
                        <Text style={styles.sectionText}>
                            2. Lưu ý rằng lưới bên phải có thể bị xoay.
                        </Text>
                        <Text style={styles.sectionText}>
                            3. Hai lưới có thể khác nhau ở một chấm (vị trí hoặc màu sắc).
                        </Text>
                        <Text style={styles.sectionText}>
                            4. Nếu bạn nghĩ hai lưới giống nhau (sau khi xoay), nhấn nút "Giống nhau".
                        </Text>
                        <Text style={styles.sectionText}>
                            5. Nếu bạn nghĩ hai lưới khác nhau, nhấn nút "Khác nhau".
                        </Text>
                        <Text style={styles.sectionText}>
                            6. Sau khi trả lời, lưới B sẽ hiển thị ở hướng đúng để so sánh.
                        </Text>
                    </View>

                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Điểm số và cấp độ</Text>
                        <Text style={styles.sectionText}>
                            • Trả lời đúng: Nhận điểm thưởng. Số điểm tăng theo cấp độ và số câu hỏi.
                        </Text>
                        <Text style={styles.sectionText}>
                            • Trả lời sai: Bị trừ điểm. Số điểm trừ tăng theo cấp độ và số câu hỏi.
                        </Text>
                        <Text style={styles.sectionText}>
                            • Hoàn thành cấp độ: Trả lời đúng 7 câu hỏi để vượt qua cấp độ.
                        </Text>
                        <Text style={styles.sectionText}>
                            • Thời gian: Mỗi cấp độ có giới hạn 60 giây. Nếu hết thời gian, bạn sẽ phải thử lại.
                        </Text>
                    </View>

                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Độ khó</Text>
                        <Text style={styles.sectionText}>
                            • Cấp độ càng cao, kích thước lưới càng lớn.
                        </Text>
                        <Text style={styles.sectionText}>
                            • Từ cấp độ 3 trở lên, lưới B có thể bị xoay 90°, 180° hoặc 270°.
                        </Text>
                        <Text style={styles.sectionText}>
                            • Sự khác biệt giữa hai lưới sẽ ngày càng tinh tế ở các cấp độ cao hơn.
                        </Text>
                    </View>
                </ScrollView>

                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={onClose}
                >
                    <Text style={styles.closeButtonText}>ĐÓNG</Text>
                </TouchableOpacity>
            </View>
        </BaseModal>
    )
})

const styles = StyleSheet.create({
    // Nội dung modal
    modalContent: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        paddingBottom: 10,
        alignItems: 'center',
        width: '100%',
    },
    // Tiêu đề modal
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4A6572',
        marginBottom: 15,
        textAlign: 'center',
    },
    // ScrollView
    scrollView: {
        width: '100%',
        marginBottom: 15,
        maxHeight: 400,
    },
    // Container của mỗi phần
    sectionContainer: {
        marginBottom: 20,
    },
    // Tiêu đề phần
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 8,
    },
    // Text phần
    sectionText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 6,
        lineHeight: 22,
    },
    // Nút đóng
    closeButton: {
        marginTop: 10,
        paddingVertical: 12,
        paddingHorizontal: 30,
        backgroundColor: '#4CAF50',
        borderRadius: 25,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    // Text nút đóng
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default HelpModal