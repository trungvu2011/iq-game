import { LayoutRectangle } from 'react-native';

// Định nghĩa interface cho vị trí ô
export interface CellPosition {
    row: number;
    col: number;
}

export interface GridLayout {
    layout: LayoutRectangle;
    cellSize: number;
    topOffset: number;
    leftOffset: number;
}

// Cấu trúc dữ liệu level từ file JSON
export interface NonogramLevel {
    title: string;
    colorgrid: number[][][];  // RGB values for each cell
    nonogrid: number[][];     // Puzzle solution grid (1 for filled, 0 for empty)
    difficulty: number;
    row_hints: number[][];
    col_hints: number[][];
}

// Định nghĩa interface cho ô đánh sai
export interface WrongCell {
    row: number;
    col: number;
    correctValue: number;
    actualState: number;
}

// Định nghĩa interface cho trạng thái game
export interface GameState {
    level: number;
    renderKey: number;
    lives: number;
    gameStatus: number;
    hintsRemaining: number;
    solution: number[][];
    isComplete: boolean;
    markMode: number;
    lastToggledCell: { row: number; col: number } | null;
    currentMarkValue: number;
    wrongCells: WrongCell[];
}
