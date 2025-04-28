// Types for the Math Audit game
export interface MathEquation {
    equation: string[];
    isCorrect: boolean;
}

export interface MathAuditGameState {
    isPaused: boolean;
    showHelp: boolean;
    currentQuestion: number;
    totalQuestions: number;
    score: number;
    answerSelected: boolean;
}