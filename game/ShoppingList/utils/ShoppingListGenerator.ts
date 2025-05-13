import { FOOD_LIST_CONFIG, FOOD_LIST } from "../constant/index";

export function generateFoodList(index: number) {
  const foodList = FOOD_LIST_CONFIG[index];
  const correctFoodCount = foodList[0];
  const foodCount = foodList[1];

  // Lấy danh sách index từ 0 đến FOOD_LIST.length - 1
  const allIndexes = Array.from({ length: FOOD_LIST.length }, (_, i) => i);

  // Trộn ngẫu nhiên và chọn foodCount phần tử
  const shuffledIndexes = allIndexes.sort(() => Math.random() - 0.5);
  const selectedIndexes = shuffledIndexes.slice(0, foodCount);

  // Trộn lại selectedIndexes và chọn correctFoodCount phần tử đúng
  const correctIndexes = selectedIndexes
    .sort(() => Math.random() - 0.5)
    .slice(0, correctFoodCount);
  // selectedIndexes.sort(() => Math.random() - 0.5);

  return {
    items: selectedIndexes,
    correctItems: correctIndexes,
  };
}
