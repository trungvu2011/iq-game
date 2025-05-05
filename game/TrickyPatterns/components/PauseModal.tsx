import React, { forwardRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ViewStyle,
} from 'react-native';
import BaseModal, { BaseModalRefType } from '../../../commons/BaseModal';

interface PauseModalProps {
    onContinue: () => void;
    onRestart: () => void;
    onHowToPlay: () => void;
    onLeaveGame: () => void;
    modelStyle?: ViewStyle;
}

const PauseModal = forwardRef<BaseModalRefType, PauseModalProps>(
    ({ onContinue, onRestart, onHowToPlay, onLeaveGame, modelStyle }, ref) => {
        return (
            <BaseModal
                ref={ref}
                modelStyle={modelStyle}
                showCloseButton={false}
                bodyStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 12,
                    padding: 20,
                    width: '80%',
                    maxWidth: 400,
                    alignItems: 'center',
                }}
            >
                <View style={styles.container}>
                    <Text style={styles.modalTitle}>Game Paused</Text>

                    <TouchableOpacity
                        style={[styles.button, styles.continueButton]}
                        onPress={onContinue}
                    >
                        <Text style={styles.buttonText}>Continue</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={onRestart}>
                        <Text style={styles.buttonText}>Restart</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={onHowToPlay}>
                        <Text style={styles.buttonText}>How to Play</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, styles.leaveButton]} onPress={onLeaveGame}>
                        <Text style={styles.leaveButtonText}>Leave Game</Text>
                    </TouchableOpacity>
                </View>
            </BaseModal>
        );
    }
);

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
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
    },
    leaveButton: {
        backgroundColor: '#D9534F',
    },
    leaveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default PauseModal;
