import React, { createContext, useContext, useReducer, RefObject, useRef } from 'react';
import { gameReducer, initialState } from '../state/gameReducer';
import { GameState, GameAction } from '../types/gameTypes';
import { BaseModalRefType } from '../../../commons/BaseModal';

/**
 * Props cho GameContext Provider
 */
interface GameContextProviderProps {
  children: React.ReactNode;
}

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  modalRefs: {
    helpModalRef: RefObject<BaseModalRefType | null>;
    pauseModalRef: RefObject<BaseModalRefType | null>;
  }
}

// Tạo context với giá trị mặc định
const GameContext = createContext<GameContextValue | undefined>(undefined);

/**
 * Provider component cho GameContext
 */
export const GameContextProvider: React.FC<GameContextProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Khai báo các refs cho modals
  const helpModalRef = useRef<BaseModalRefType>(null);
  const pauseModalRef = useRef<BaseModalRefType>(null);

  const modalRefs = {
    helpModalRef,
    pauseModalRef
  };

  return (
    <GameContext.Provider value={{ state, dispatch, modalRefs }}>
      {children}
    </GameContext.Provider>
  );
};

/**
 * Hook để sử dụng GameContext trong các components
 */
export const useGameContext = (): GameContextValue => {
  const context = useContext(GameContext);

  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameContextProvider');
  }

  return context;
};