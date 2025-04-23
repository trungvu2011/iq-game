import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface HeaderProps {
    level: number;
    lives: number;
    totalLevels: number;
}

const Header = ({ level, lives, totalLevels }: HeaderProps) => {
    return (
        <View style={styles.header}>
            <Text style={styles.headerText}>Nonogram</Text>
            <Text style={styles.levelText}>Level: {level + 1} / {totalLevels}</Text>
            <Text style={styles.livesText}>Lives: {lives}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        width: '100%',
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
    },
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000000',
    },
    levelText: {
        fontSize: 16,
        color: '#757575',
        marginTop: 5,
    },
    livesText: {
        fontSize: 16,
        color: '#E57373',
        marginTop: 5,
    },
});

export default Header;