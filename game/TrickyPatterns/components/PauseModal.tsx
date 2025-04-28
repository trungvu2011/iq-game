import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'

interface PauseModalProps {
    visible: boolean;
    onContinue: () => void;
    onRestart: () => void;
    onHowToPlay: () => void;
    onLeaveGame: () => void;
}

const PauseModal = ({
    visible,
    onContinue,
    onRestart,
    onHowToPlay,
    onLeaveGame
}: PauseModalProps) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Game Paused</Text>

                    <TouchableOpacity
                        style={[styles.button, , styles.leaveButton]}
                        onPress={onContinue}
                    >
                        <Text style={styles.buttonText}>Continue</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={onRestart}
                    >
                        <Text style={styles.buttonText}>Restart</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={onHowToPlay}
                    >
                        <Text style={styles.buttonText}>How to Play</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={onLeaveGame}
                    >
                        <Text style={styles.leaveButtonText}>Leave Game</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        width: '85%',
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
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    button: {
        width: '100%',
        padding: 15,
        borderRadius: 8,
        marginVertical: 8,
        backgroundColor: '#4A90E2',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    continueButton: {
        backgroundColor: '#4CAF50',
        marginTop: 16,
    },
    leaveButton: {
        backgroundColor: '#4CAF50',
    },
    leaveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default PauseModal