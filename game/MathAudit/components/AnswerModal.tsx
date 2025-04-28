import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { MathEquation } from '../types'

interface AnswerModalProps {
    visible: boolean;
    onClose: () => void;
    equation: MathEquation | null;
}

const AnswerModal = ({ visible, onClose, equation }: AnswerModalProps) => {
    if (!equation) return null;

    // The equation provided is what the user answered incorrectly
    const userAnsweredCorrect = !equation.isCorrect;  // The user chose the opposite of reality

    // Get the equation parts for displaying
    const getCorrectEquation = () => {
        if (!equation) return [];

        // Extract the equation parts (excluding the result)
        const equationParts = [...equation.equation];
        // Find the index of the equals sign
        const equalsIndex = equationParts.indexOf('=');
        if (equalsIndex !== -1) {
            // Get only the calculation part (before equals sign)
            const calculationPart = equationParts.slice(0, equalsIndex);

            // For correct equations, keep the original result
            if (equation.isCorrect) {
                return equationParts;
            }

            // For incorrect equations, we need to show the correct result
            // Replace any division symbol for JS eval
            const evalExpression = calculationPart
                .join(' ')
                .replace(/×/g, '*')
                .replace(/÷/g, '/');

            try {
                // Safely evaluate the expression
                const correctResult = Math.round(eval(evalExpression));
                // Return the corrected equation
                return [...calculationPart, '=', correctResult.toString()];
            } catch (error) {
                // If evaluation fails, just return the original
                return equationParts;
            }
        }
        return equationParts;
    };

    const correctEquation = getCorrectEquation();

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>
                        ❌
                    </Text>

                    {/* Answer explanation */}
                    <View style={styles.answerExplanation}>
                        {/* Your answer section - only show if the equation was incorrect */}
                        {!equation.isCorrect && (
                            <View style={[styles.answerStatusContainer, { backgroundColor: '#FFEBEE' }]}>
                                <Text style={[styles.answerStatusText, { color: '#D32F2F' }]}>
                                    Your answer:
                                </Text>
                                <View style={styles.equationContainer}>
                                    {equation.equation.map((item, index) => (
                                        <Text key={index} style={styles.equationText}>
                                            {item}
                                        </Text>
                                    ))}
                                </View>
                            </View>
                        )}

                        {/* Correct answer section */}
                        <View style={[
                            styles.answerStatusContainer,
                            {
                                backgroundColor: '#E8F5E9',
                                marginTop: !equation.isCorrect ? 10 : 0
                            }
                        ]}>
                            <Text style={[styles.answerStatusText, { color: '#43A047' }]}>
                                Correct answer:
                            </Text>
                            <View style={styles.equationContainer}>
                                {correctEquation.map((item, index) => (
                                    <Text key={index} style={styles.equationText}>
                                        {item}
                                    </Text>
                                ))}
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.nextButton}
                        onPress={onClose}
                    >
                        <Text style={styles.nextButtonText}>NEXT</Text>
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
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#E53935',
    },
    equationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        paddingHorizontal: 5,
    },
    equationText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginHorizontal: 2,
    },
    answerExplanation: {
        width: '100%',
        marginTop: 15,
    },
    answerStatusContainer: {
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
    },
    answerStatusText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
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
    nextButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default AnswerModal