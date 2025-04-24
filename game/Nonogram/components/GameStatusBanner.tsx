import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface GameStatusBannerProps {
    status: 'completed' | 'failed';
    title?: string;
    onButtonPress: () => void;
}

const GameStatusBanner = ({ status, title, onButtonPress }: GameStatusBannerProps) => {
    const isCompleted = status === 'completed';

    return (
        <View style={[
            styles.banner,
            { backgroundColor: isCompleted ? '#66BB6A' : '#F44336' }
        ]}>
            {isCompleted ? (
                <Text style={styles.bannerText}>{title || 'Completed!'}</Text>
            ) : (
                <>
                    <Text style={styles.bannerText}>Game Over</Text>
                    <Text style={styles.bannerSubText}>Bạn đã hết mạng!</Text>
                </>
            )}

            <TouchableOpacity
                style={[
                    styles.bannerButton,
                    { backgroundColor: isCompleted ? '#4CAF50' : '#D32F2F' }
                ]}
                onPress={onButtonPress}
            >
                <Text style={styles.bannerButtonText}>
                    {isCompleted ? 'Next Level' : 'Chơi lại'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    banner: {
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 20,
        marginBottom: 15,
        marginTop: 15,
        alignItems: 'center',
    },
    bannerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 5,
    },
    bannerSubText: {
        fontSize: 16,
        color: '#FFFFFF',
    },
    bannerButton: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#FFFFFF',
        marginTop: 8,
    },
    bannerButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
});

export default GameStatusBanner;