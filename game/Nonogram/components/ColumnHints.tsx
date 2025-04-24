import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ColumnHintsProps {
    hints: number[][];
    cellSize: number;
    hintFontSize: number;
}

const ColumnHints = ({ hints, cellSize, hintFontSize }: ColumnHintsProps) => {
    return (
        <View style={styles.container}>
            {hints.map((colHint, colIndex) => (
                <View
                    key={`col-hint-${colIndex}`}
                    style={[
                        styles.colHint,
                        {
                            width: cellSize - 2,
                            height: cellSize * 2,
                        },
                    ]}
                >
                    <View style={styles.colHintInner}>
                        {colHint.map((hint, i) => (
                            <Text
                                key={`col-hint-${colIndex}-${i}`}
                                style={[styles.hintText, { fontSize: hintFontSize }]}
                            >
                                {hint}
                            </Text>
                        ))}
                    </View>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    colHint: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: '#E0F7FA',
        borderRadius: 0,
        margin: 1,
    },
    colHintInner: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: '100%',
    },
    hintText: {
        fontWeight: 'bold',
        color: '#37474F',
        marginHorizontal: 2,
    },
});

export default ColumnHints;