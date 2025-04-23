// Các hằng số được sử dụng trong game Nonogram

export const CELL_STATES = {
    EMPTY: 0,
    FILLED: 1,
    MARKED: 2,
    FILLED_WRONG: 3, // Tô hồng (khi ô đáng lẽ phải tô đen)
    MARKED_WRONG: 4, // Tô X nền hồng (khi ô đáng lẽ phải đánh X)
};

export const MARK_MODES = {
    FILL: 0,    // Chế độ tô màu các ô
    MARK_X: 1,  // Chế độ đánh dấu X
};

export const GAME_STATUS = {
    PLAYING: 0,  // Đang chơi
    COMPLETED: 1, // Đã hoàn thành
    FAILED: 2,   // Thua cuộc
};