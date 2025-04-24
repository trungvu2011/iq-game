import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { GAME_STATUS } from '../constants/gameConstants';
import ModeSelector from './ModeSelector';

interface GameControlsProps {
    markMode: number;
    setMarkMode: (mode: number) => void;
    resetLevel: () => void;
    giveHint: () => void;
    hintsRemaining: number;
    gameStatus: number;
}

const GameControls = ({
    markMode,
    setMarkMode,
    resetLevel,
    giveHint,
    hintsRemaining,
    gameStatus
}: GameControlsProps) => {
    return (
        <>
            <ModeSelector markMode={markMode} setMarkMode={setMarkMode} />

            <View style={styles.controls}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={resetLevel}
                >
                    <Text style={styles.buttonText}>Reset</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.button,
                        { backgroundColor: hintsRemaining > 0 ? '#4A6572' : '#9E9E9E' }
                    ]}
                    onPress={giveHint}
                    disabled={hintsRemaining <= 0 || gameStatus === GAME_STATUS.FAILED}
                >
                    <Text style={styles.buttonText}>Gợi ý ({hintsRemaining})</Text>
                </TouchableOpacity>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    controls: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'center',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#4A6572',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        margin: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default GameControls;