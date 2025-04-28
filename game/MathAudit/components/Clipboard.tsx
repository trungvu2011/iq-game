import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React, { useMemo } from 'react'
import { MathEquation } from '../types'

// Get screen dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Base font sizes
const MAX_FONT_SIZE = 48;
const MIN_FONT_SIZE = 28;

interface ClipboardProps {
    equation: MathEquation;
    showAnswer?: boolean;
}

const Clipboard = ({ equation, showAnswer = false }: ClipboardProps) => {
    // Calculate font size based on equation length
    const fontSize = useMemo(() => {
        // Get total length of all equation parts
        const totalLength = equation.equation.reduce((acc, curr) => acc + curr.length, 0);

        // Calculate complexity factor based on number of items and their length
        const complexityFactor = equation.equation.length * 0.2 + totalLength * 0.4;

        // Calculate font size inversely proportional to complexity
        // More complex equations get smaller font sizes
        let calculatedSize = MAX_FONT_SIZE - complexityFactor * 2;

        // Ensure font size stays within bounds
        return Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, calculatedSize));
    }, [equation]);

    return (
        <View style={styles.clipboardContainer}>
            {/* Clipboard Clip */}
            <View style={styles.clipboardClip}>
                <View style={styles.clipInner} />
            </View>

            {/* Paper Content */}
            <View style={styles.paper}>
                {equation.equation.map((item, index) => (
                    <Text
                        key={index}
                        style={[styles.equationItem, { fontSize }]}
                    >
                        {item}
                    </Text>
                ))}

                {showAnswer && (
                    <View style={styles.answerContainer}>
                        <Text style={[
                            styles.answerText,
                            { color: equation.isCorrect ? '#4CAF50' : '#E53935' }
                        ]}>
                            This equation is {equation.isCorrect ? 'CORRECT' : 'INCORRECT'}
                        </Text>
                    </View>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
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
    clipInner: {
        width: 30,
        height: 8,
        backgroundColor: '#E6A800',
        borderRadius: 2,
    },
    paper: {
        width: '100%',
        height: '100%',
        paddingTop: 30,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    equationItem: {
        marginVertical: 10,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#333',
        // fontSize is now dynamically applied
    },
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
    answerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Clipboard