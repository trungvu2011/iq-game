import { RefObject } from 'react';
import { BaseModalRefType } from '../../../commons/BaseModal';

/**
 * Kiểu dữ liệu cho mẫu pattern của game
 */
export interface PatternData {
  pattern1: string[][];
  pattern2: string[][];
  is_same: boolean;
  difference_coordinates?: number[][];
  rotation: number; // Góc xoay của pattern2
}

/**
 * Trạng thái của game TrickyPatterns
 */
export interface GameState {
  // Trạng thái game
  isPaused: boolean;
  currentQuestion: number;
  questionIndex: number;
  totalQuestions: number;
  levelScore: number;
  answerSelected: boolean;
  level: number;
  gameOver: boolean;
  gameCompleted: boolean;
  timerResetTrigger: boolean;

  // Modal state
  showAnswerModal: boolean;
  wrongAnswer: WrongAnswerData | null;

  // Pattern data
  currentPattern: PatternData | null;

  // Game progress
  correctAnswersInLevel: number;
  wrongAnswersInLevel: number;
  totalAttempts: number;
  showLevelComplete: boolean;
  showLevelFailed: boolean;
  showResult: boolean;
  isCorrectAnswer: boolean;
}

/**
 * Dữ liệu câu trả lời sai
 */
export interface WrongAnswerData {
  pattern: PatternData;
  userAnswer: boolean;
}

/**
 * Các loại action cho game reducer
 */
export enum ActionTypes {
  PAUSE_GAME = 'PAUSE_GAME',
  CONTINUE_GAME = 'CONTINUE_GAME',
  RESTART_GAME = 'RESTART_GAME',
  ANSWER_QUESTION = 'ANSWER_QUESTION',
  GENERATE_NEW_PATTERN = 'GENERATE_NEW_PATTERN',
  SET_CURRENT_PATTERN = 'SET_CURRENT_PATTERN',
  SHOW_LEVEL_COMPLETE = 'SHOW_LEVEL_COMPLETE',
  HIDE_LEVEL_COMPLETE = 'HIDE_LEVEL_COMPLETE',
  SHOW_LEVEL_FAILED = 'SHOW_LEVEL_FAILED',
  SET_GAME_COMPLETED = 'SET_GAME_COMPLETED',
  LEVEL_UP = 'LEVEL_UP',
  RESET_LEVEL = 'RESET_LEVEL',
  TIME_UP = 'TIME_UP',
  RESET_TIMER = 'RESET_TIMER',
  CLOSE_ANSWER_MODAL = 'CLOSE_ANSWER_MODAL',
}

/**
 * Kiểu dữ liệu cho các actions của game
 */
export type GameAction =
  | { type: ActionTypes.PAUSE_GAME }
  | { type: ActionTypes.CONTINUE_GAME }
  | { type: ActionTypes.RESTART_GAME }
  | { type: ActionTypes.ANSWER_QUESTION; payload: boolean }
  | { type: ActionTypes.GENERATE_NEW_PATTERN }
  | { type: ActionTypes.SET_CURRENT_PATTERN; payload: PatternData }
  | { type: ActionTypes.SHOW_LEVEL_COMPLETE }
  | { type: ActionTypes.HIDE_LEVEL_COMPLETE }
  | { type: ActionTypes.SHOW_LEVEL_FAILED }
  | { type: ActionTypes.SET_GAME_COMPLETED; payload: boolean }
  | { type: ActionTypes.LEVEL_UP }
  | { type: ActionTypes.RESET_LEVEL }
  | { type: ActionTypes.TIME_UP }
  | { type: ActionTypes.RESET_TIMER }
  | { type: ActionTypes.CLOSE_ANSWER_MODAL };