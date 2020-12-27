import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  setRoomCode: React.Dispatch<React.SetStateAction<string>> | undefined;
  playerName: string | undefined;
  setPlayerName: React.Dispatch<React.SetStateAction<string>> | undefined;
  allMembers: string[] | undefined;
  setAllMembers: React.Dispatch<React.SetStateAction<string[]>> | undefined;
  playerRole: string | undefined;
  setPlayerRole: React.Dispatch<React.SetStateAction<string | undefined>> | undefined;
}

export const GameStateContext = createContext<IGameStateContext>({
  gameState: undefined,
  setGameState: undefined,
  roomCode: undefined,
  setRoomCode: undefined,
  playerName: undefined,
  setPlayerName: undefined,
  allMembers: undefined,
  setAllMembers: undefined,
  playerRole: undefined,
  setPlayerRole: undefined,
});

export const useGameState: () => IGameStateContext = () => useContext(GameStateContext);

export const GameStateContextProvider = ({ children }: { children: ReactNode }) => {
  const [gameState, setGameState] = useState<GameState>(GameState.GetGameRoom);
  const [roomCode, setRoomCode] = useState<string>('');
  const [playerName, setPlayerName] = useState<string>('');
  const [allMembers, setAllMembers] = useState<string[]>([]);
  const [playerRole, setPlayerRole] = useState<string | undefined>(undefined);

  return (
    <GameStateContext.Provider
      value={{
        gameState,
        setGameState,
        roomCode,
        setRoomCode,
        playerName,
        setPlayerName,
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
