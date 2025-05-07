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
                style={[styles.answerButton]}
                onPress={() => onAnswer(false)}
                disabled={disabled}
            >
                <Text style={styles.buttonText}>
                    No
                </Text>
            </TouchableOpacity>

            {/* Correct Button (YES) */}
            <TouchableOpacity
                style={[styles.answerButton]}
                onPress={() => onAnswer(true)}
                disabled={disabled}
            >
                <Text style={styles.buttonText}>
                    Yes
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
        backgroundColor: '#221c40',
    },
    buttonText: {
        fontSize: 40,
        color: '#ffffffff',
        fontWeight: 'bold',
    },
});

export default AnswerButtons