import React, { createContext, useContext, useState, useEffect, useCallback, FunctionComponent } from 'react';

export enum GameState {
  GetGameRoom,
  SetPlayerName,
  WaitForMembers,
}

interface IGameStateContext {
  gameState: GameState | undefined;
  setGameState: (newGameState: GameState) => void;
}

export const GameStateContext = createContext<IGameStateContext>({
  gameState: undefined,
  setGameState: (newGameState: GameState) => console.log('Calling Game State dummy setGameState.'),
});

export const useGameState = () => useContext(GameStateContext);

export const GameStateContextProvider: FunctionComponent = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(GameState.GetGameRoom);

  return (
    <GameStateContext.Provider
      value={{
        gameState,
        setGameState,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};
