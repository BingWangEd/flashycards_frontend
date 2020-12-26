import React, { createContext, useContext, useState, FunctionComponent } from 'react';

export enum GameState {
  GetGameRoom,
  SetPlayerName,
  WaitForMembers,
}

export enum PlayerRole {
  Teacher = 'teacher',
  Student = 'student',
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
  playerRole: string | undefined,
  setPlayerRole: React.Dispatch<React.SetStateAction<string | undefined>> | undefined,
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
  playerRole: undefined,
  setPlayerRole: undefined,
});

export const useGameState = () => useContext(GameStateContext);

export const GameStateContextProvider: FunctionComponent = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(GameState.GetGameRoom);
  const [roomCode, setRoomCode] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [allMembers, setAllMembers] = useState<string[]>([]);
  const [playerRole, setPlayerRole] = useState<string | undefined>(undefined);

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
        playerRole,
        setPlayerRole,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};
