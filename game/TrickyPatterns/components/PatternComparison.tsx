import { View, StyleSheet, Text } from 'react-native'
import React from 'react'
import PatternGrid from './PatternGrid'
import CorrectIcon from '../../../assets/icons/CorrectIcon';
import WrongIcon from '../../../assets/icons/WrongIcon';

interface PatternComparisonProps {
    pattern1: string[][];
    pattern2: string[][];
    showResult: boolean;
    isCorrectAnswer: boolean;
    animationDuration?: number; // Thêm prop cho thời gian animation
    rotation?: number; // Thêm prop cho góc xoay
}

/**
 * Component PatternComparison - Hiển thị hai lưới mẫu để so sánh
 */
const PatternComparison = ({
    pattern1,
    pattern2,
    showResult,
    isCorrectAnswer,
    animationDuration = 500, // Mặc định là 500ms
    rotation = 90, // Góc xoay mặc định là 90 độ
}: PatternComparisonProps) => {
    return (
        <View style={styles.comparisonContainer}>
            {/* Result icon shown in the middle between the grids */}
            {showResult && (
                <View style={styles.resultIconContainer}>
                    <View>
                        {isCorrectAnswer ?
                            <CorrectIcon width={60} height={60} /> :
                            <WrongIcon width={60} height={60} />
                        }
                    </View>
                </View>
            )}

            <View style={styles.gridsContainer}>
                <PatternGrid
                    pattern={pattern1}
                    showResult={showResult}
                    animationDuration={animationDuration}
                />

                <PatternGrid
                    pattern={pattern2}
                    showResult={showResult}
                    animationDuration={animationDuration}
                    rotation={rotation} // Truyền góc xoay cho pattern thứ hai
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    // Main container
    comparisonContainer: {
        width: '100%',
        position: 'relative',
        marginBottom: 20,
    },
    // Container for both grids
    gridsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 10,
    },
    // Result icon container positioned in the middle and above
    resultIconContainer: {
        position: 'absolute',
        top: -60, // Position above the grids
        left: 0,
        right: 0,
        zIndex: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default PatternComparison;