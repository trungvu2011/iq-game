import { HEX_GRID_CONFIG } from "../constants/gameConstants";

function generateAnswerList(rows: number, cols: number, numberOfAnswers: number) {
  const answerList = new Set<number>();

  while (answerList.size < numberOfAnswers) {
    // Start from 2 instead of 1 to avoid number 1
    const randomNumber = Math.floor(Math.random() * (rows * cols - 1)) + 2;
    answerList.add(randomNumber);
  }

  return Array.from(answerList);
}

export function generateHexGrid(level: number, currentQuestion: number) {
  const [cols, rows, numberOfAnswers] = HEX_GRID_CONFIG[level + currentQuestion - 2];

  const answerList = generateAnswerList(rows, cols, numberOfAnswers);

  const correctAnswer = answerList[Math.floor(Math.random() * answerList.length)];

  return {
    rows,
    cols,
    answerList,
    correctAnswer
  }
}
