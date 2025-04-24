import React, { useMemo } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import nonogramLevels from './nonogram_levels.json';
import { calculateCellSize } from './utils/calculationUtils';
import { useNonogramGame } from './hooks/useNonogramGame';
import { usePanGesture } from './hooks/usePanGesture';
import { GAME_STATUS } from './constants/gameConstants';
import Grid from './components/Grid';
import GameControls from './components/GameControls';
import GameStatusBanner from './components/GameStatusBanner';
import Header from './components/Header';

const Nonogram = () => {
    // Sử dụng custom hook để quản lý game state
    const gameState = useNonogramGame(nonogramLevels);
    const {
        level,
        renderKey,
        lives,
        gameStatus,
        hintsRemaining,
        markMode,
        puzzle,
        colorGrid,
        rowHints,
        colHints,
        goToNextLevel,
        resetLevel,
        setMarkMode,
        giveHint
    } = gameState;

    // Tính toán kích thước ô dựa trên kích thước puzzle
    const CELL_SIZE = useMemo(() => {
        if (puzzle.length > 0 && puzzle[0].length > 0) {
            return calculateCellSize(puzzle[0].length, puzzle.length);
        }
        return 40; // Giá trị mặc định
    }, [puzzle]);

    // Sử dụng custom hook để xử lý thao tác vuốt
    const panResponder = usePanGesture(gameState);
    console.log('Game Status:', gameStatus);

    return (
        <SafeAreaView style={styles.container} key={renderKey}>
            <StatusBar backgroundColor="#4A6572" barStyle="light-content" />

            <Header
                level={level}
                lives={lives}
                totalLevels={nonogramLevels.length}
            />


            <Grid
                puzzle={puzzle}
                colorGrid={colorGrid}
                rowHints={rowHints}
                colHints={colHints}
                cellSize={CELL_SIZE}
                gameState={gameState}
                panResponderHandlers={panResponder.panHandlers}
            />

            {gameStatus === GAME_STATUS.FAILED && (
                <GameStatusBanner
                    status="failed"
                    onButtonPress={resetLevel}
                />
            )}

            {gameStatus === GAME_STATUS.COMPLETED && (
                <GameStatusBanner
                    status="completed"
                    title={nonogramLevels[level].title}
                    onButtonPress={goToNextLevel}
                />
            )}

            {gameStatus == GAME_STATUS.PLAYING &&
                <GameControls
                    markMode={markMode}
                    setMarkMode={setMarkMode}
                    resetLevel={resetLevel}
                    giveHint={giveHint}
                    hintsRemaining={hintsRemaining}
                    gameStatus={gameStatus}
                />
            }
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        paddingTop: 10,
    },
});

export default Nonogram;
