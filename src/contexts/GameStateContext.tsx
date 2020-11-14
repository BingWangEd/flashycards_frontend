import React, { createContext, useContext, useState, FunctionComponent } from 'react';

export enum GameState {
  GetGameRoom,
  SetPlayerName,
  WaitForMembers,
}

interface IGameStateContext {
  gameState: GameState | undefined;
  setGameState: React.Dispatch<React.SetStateAction<GameState>> | undefined;
  roomCode: string | undefined;
  setRoomCode: React.Dispatch<React.SetStateAction<string>> |undefined;
  name: string | undefined;
  setName: React.Dispatch<React.SetStateAction<string>> | undefined;
  allMembers: string[] | undefined,
  setAllMembers: React.Dispatch<React.SetStateAction<string[]>> | undefined,
}

export const GameStateContext = createContext<IGameStateContext>({
  gameState: undefined,
  setGameState: undefined,
  roomCode: undefined, 
  setRoomCode: undefined,
  name: undefined,
  setName: undefined,
  allMembers: undefined,
  setAllMembers: undefined,
});

export const useGameState = () => useContext(GameStateContext);

export const GameStateContextProvider: FunctionComponent = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(GameState.GetGameRoom);
  const [roomCode, setRoomCode] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [allMembers, setAllMembers] = useState<string[]>([]);

  return (
    <GameStateContext.Provider
      value={{
        gameState,
        setGameState,
        roomCode,
        setRoomCode,
        name,
        setName,
        allMembers,
        setAllMembers,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};
