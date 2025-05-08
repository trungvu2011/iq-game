import React, { forwardRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ViewStyle,
    Dimensions,
} from 'react-native';
import BaseModal, { BaseModalRefType } from './BaseModal';
import PlayIcon from '../assets/icons/PlayIcon';
import RestartIcon from '../assets/icons/RestartIcon';
import QuestionIcon from '../assets/icons/QuestionIcon';
import LeaveIcon from '../assets/icons/LeaveIcon';

interface PauseModalProps {
    onContinue: () => void;
    onRestart: () => void;
    onHowToPlay: () => void;
    onLeaveGame: () => void;
    modelStyle?: ViewStyle;
    backgroundColor?: string;
}

const PauseModal = forwardRef<BaseModalRefType, PauseModalProps>(
    ({ onContinue, onRestart, onHowToPlay, onLeaveGame, modelStyle, backgroundColor }, ref) => {
        return (
            <BaseModal
                ref={ref}
                modelStyle={modelStyle}
                showCloseButton={false}
                bodyStyle={{
                    backgroundColor: backgroundColor,
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0,
                }}
            >
                <View style={styles.container}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.continueButton]}
                            onPress={onContinue}
                        >
                            <PlayIcon
                                width={20}
                                height={20}
                                style={styles.icon}
                            />
                            <Text style={styles.buttonText}>Continue</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} onPress={onRestart}>
                            <RestartIcon
                                width={25}
                                height={25}
                                style={styles.icon}
                            />
                            <Text style={styles.buttonText}>Restart</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} onPress={onHowToPlay}>
                            <QuestionIcon
                                width={25}
                                height={25}
                                style={styles.icon}
                            />
                            <Text style={styles.buttonText}>How to Play</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.button]} onPress={onLeaveGame}>
                            <LeaveIcon
                                width={20}
                                height={20}
                                style={styles.icon}
                            />
                            <Text style={styles.buttonText}>Leave Game</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </BaseModal>
        );
    }
);

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
    },
    buttonContainer: {
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalTitle: {
        fontSize: Math.min(32, windowHeight * 0.04),
        fontWeight: 'bold',
        color: '#333',
        marginBottom: windowHeight * 0.05,
        textAlign: 'center',
    },
    button: {
        width: '100%',
        padding: windowHeight * 0.015,
        borderRadius: 30,
        marginVertical: windowHeight * 0.012,
        backgroundColor: '#241c43',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        position: 'relative',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 1,
    },
    icon: {
        position: 'absolute',
        left: 20,
    },
    continueButton: {
        backgroundColor: '#4CAF50',
    },
});

export default PauseModal;
