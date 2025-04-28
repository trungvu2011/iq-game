import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'

// Get the screen width
const screenWidth = Dimensions.get('window').width;

interface TopBarProps {
    totalQuestions?: number;
    currentQuestion?: number;
    score?: number;
    level?: number;
    onPause?: () => void;
    onHelp?: () => void;
    onTimeUp?: () => void;
    shouldResetTimer?: boolean;
    isPaused?: boolean;
}

const TopBar = ({
    totalQuestions = 7,
    currentQuestion = 1,
    score = 0,
    level = 1,
    onPause = () => { },
    onHelp = () => { },
    onTimeUp = () => { },
    shouldResetTimer = false,
    isPaused = false
}: TopBarProps) => {
    const [seconds, setSeconds] = useState(60);
    const [timerActive, setTimerActive] = useState(true);

    // Update timerActive when isPaused changes
    useEffect(() => {
        setTimerActive(!isPaused);
    }, [isPaused]);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (timerActive) {
            interval = setInterval(() => {
                setSeconds(seconds => {
                    const newSeconds = seconds - 1;
                    if (newSeconds <= 0) {
                        // Clear the interval when time is up
                        clearInterval(interval);
                        // Call the onTimeUp callback
                        onTimeUp();
                        // Reset the timer for next level
                        return 60;
                    }
                    return newSeconds;
                });
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [timerActive, onTimeUp]);

    // Reset timer when level changes or shouldResetTimer is true
    useEffect(() => {
        setSeconds(60);
        // Ensure timer is active when reset
        setTimerActive(true);
    }, [level, shouldResetTimer]);

    const formatTime = (totalSeconds: number): string => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <View style={styles.container}>
            {/* Left: Pause Button */}
            <TouchableOpacity
                style={styles.iconButton}
                onPress={() => {
                    onPause();
                }}
            >
                <Text style={styles.iconText}>{!isPaused ? "⏸️" : "▶️"}</Text>
            </TouchableOpacity>

            {/* Center: Information Area */}
            <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                    <Text style={styles.infoValue}>{formatTime(seconds)}</Text>
                </View>

                <View style={styles.infoItem}>
                    <Text style={styles.infoValue}>{currentQuestion}/{totalQuestions}</Text>
                </View>

                <View style={styles.infoItem}>
                    <Text style={styles.infoValue}>{score}</Text>
                </View>
            </View>

            {/* Right: Help Button */}
            <TouchableOpacity
                style={styles.iconButton}
                onPress={onHelp}
            >
                <Text style={styles.iconText}>❓</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        width: screenWidth,
        // gap: 20,
    },
    iconButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: '#F0F0F0',
    },
    iconText: {
        fontSize: 20,
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'center', // Changed from 'space-between' to 'center'
        flex: 1,
        marginHorizontal: 16,
        gap: 40, // Added gap for consistent spacing between items
    },
    infoItem: {
        alignItems: 'center',
        minWidth: 60, // Added minWidth instead of fixed width on text
    },
    infoValue: {
        // Removed fixed width of 50
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
        textAlign: 'center', // Ensure text is centered
    },
});

export default TopBar