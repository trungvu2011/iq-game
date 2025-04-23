import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface RowHintsProps {
    hints: number[][];
    cellSize: number;
    hintFontSize: number;
}

const RowHints = ({ hints, cellSize, hintFontSize }: RowHintsProps) => {
    return (
        <>
            {hints.map((rowHint, rowIndex) => (
                <View
                    key={`row-hint-${rowIndex}`}
                    style={[
                        styles.rowHint,
                        { width: cellSize * 1.5, height: cellSize },
                    ]}
                >
                    {rowHint.map((hint, i) => (
                        <Text
                            key={`row-hint-${rowIndex}-${i}`}
                            style={[styles.hintText, { fontSize: hintFontSize }]}
                        >
                            {hint}
                        </Text>
                    ))}
                </View>
            ))}
        </>
    );
};

const styles = StyleSheet.create({
    rowHint: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: 5,
        backgroundColor: '#E0F7FA',
        borderRadius: 0,
        margin: 0,
    },
    hintText: {
        fontWeight: 'bold',
        color: '#37474F',
        marginHorizontal: 2,
    },
});

export default RowHints;