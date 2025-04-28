import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import React from 'react'

interface HelpModalProps {
    visible: boolean;
    onClose: () => void;
}

const HelpModal = ({ visible, onClose }: HelpModalProps) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>How to Play</Text>
                    <ScrollView style={styles.modalScrollView}>
                        <Text style={styles.modalText}>
                            1. You will be presented with math equations to audit.{'\n\n'}
                            2. Check if the equations are correct or incorrect.{'\n\n'}
                            3. Score points for each correct answer.{'\n\n'}
                            4. Complete all questions as quickly as possible for a higher score.
                        </Text>
                    </ScrollView>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                    >
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    modalScrollView: {
        maxHeight: 300,
        width: '100%',
    },
    modalText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
    },
    closeButton: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 30,
        backgroundColor: '#4A90E2',
        borderRadius: 25,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default HelpModal