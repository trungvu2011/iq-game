import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { MARK_MODES } from '../constants/gameConstants';

interface ModeSelectorProps {
    markMode: number;
    setMarkMode: (mode: number) => void;
}

const ModeSelector = ({ markMode, setMarkMode }: ModeSelectorProps) => {
    return (
        <View style={styles.modeSelector}>
            <Text style={[styles.modeText, markMode === MARK_MODES.FILL ? styles.activeMode : null]}>
                Tô đen
            </Text>

            <Switch
                trackColor={{ false: '#4A6572', true: '#E57373' }}
                thumbColor={markMode === MARK_MODES.FILL ? '#333333' : '#FF5252'}
                onValueChange={() => setMarkMode(markMode === MARK_MODES.FILL ? MARK_MODES.MARK_X : MARK_MODES.FILL)}
                value={markMode === MARK_MODES.MARK_X}
                style={styles.modeSwitch}
            />

            <Text style={[styles.modeText, markMode === MARK_MODES.MARK_X ? styles.activeMode : null]}>
                Đánh X
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    modeSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        paddingVertical: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    modeText: {
        fontSize: 14,
        color: '#757575',
        marginHorizontal: 8,
        fontWeight: '500',
    },
    activeMode: {
        color: '#4A6572',
        fontWeight: 'bold',
    },
    modeSwitch: {
        transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
    },
});

export default ModeSelector;