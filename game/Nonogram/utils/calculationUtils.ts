import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

/**
 * Tính toán kích thước ô phù hợp dựa trên kích thước màn hình và kích thước puzzle
 * @param puzzleWidth Chiều rộng của puzzle (số ô theo chiều ngang)
 * @param puzzleHeight Chiều cao của puzzle (số ô theo chiều dọc)
 * @returns Kích thước ô tính bằng điểm ảnh
 */
export const calculateCellSize = (puzzleWidth: number, puzzleHeight: number): number => {
    // Khả dụng khoảng 85% chiều rộng màn hình cho lưới chơi và gợi ý
    const availableWidth = width * 0.85;
    // Khả dụng khoảng 60% chiều cao màn hình cho lưới chơi
    const availableHeight = height * 0.6;

    // Tính toán kích thước dựa trên chiều nhỏ hơn để đảm bảo lưới vừa màn hình
    const cellSizeByWidth = availableWidth / puzzleWidth;
    const cellSizeByHeight = availableHeight / puzzleHeight;

    // Lấy giá trị nhỏ hơn để đảm bảo toàn bộ lưới vừa màn hình
    let cellSize = Math.min(cellSizeByWidth, cellSizeByHeight);

    // Giới hạn kích thước ô trong khoảng hợp lý
    cellSize = Math.max(cellSize, 25); // Tối thiểu 25px
    cellSize = Math.min(cellSize, 50); // Tối đa 50px

    return Math.floor(cellSize);
};