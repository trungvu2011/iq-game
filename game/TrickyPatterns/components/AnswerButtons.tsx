import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import React from 'react'

// Get screen dimensions
const { width: screenWidth } = Dimensions.get('window');

interface AnswerButtonsProps {
    onAnswer: (isCorrect: boolean) => void;
    disabled: boolean;
}

const AnswerButtons = ({ onAnswer, disabled }: AnswerButtonsProps) => {
    return (
        <View style={styles.buttonContainer}>
            {/* Wrong Button (NO) */}
            <TouchableOpacity
                style={[styles.answerButton, styles.wrongButton]}
                onPress={() => onAnswer(false)}
                disabled={disabled}
            >
                <Text style={styles.wrongButtonText}>
                    NO
                </Text>
            </TouchableOpacity>

            {/* Correct Button (YES) */}
            <TouchableOpacity
                style={[styles.answerButton, styles.correctButton]}
                onPress={() => onAnswer(true)}
                disabled={disabled}
            >
                <Text style={styles.correctButtonText}>
                    YES
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
        position: 'absolute',
        bottom: 20,
    },
    answerButton: {
        width: screenWidth * 0.35,
        height: 70,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    wrongButton: {
        backgroundColor: '#d32f2f',
    },
    wrongButtonText: {
        fontSize: 40,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    correctButton: {
        backgroundColor: '#388e3c',
    },
    correctButtonText: {
        fontSize: 40,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});

export default AnswerButtons