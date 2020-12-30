import React, { createContext, useContext, ReactNode, useState } from 'react';
import { Game } from '../objects/Game';

interface IGameContext {
  game: Game | undefined;
  setGame: React.Dispatch<React.SetStateAction<Game | undefined>> | undefined;
}

export const GameContext = createContext<IGameContext>({
  game: undefined,
  setGame: undefined,
});

export const useGame: () => IGameContext = () => useContext(GameContext);

export const GameContextProvider = ({ children }: { children: ReactNode }) => {
  const [game, setGame] = useState<Game>();

  return (
    <GameContext.Provider
      value={{
        game,
        setGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
