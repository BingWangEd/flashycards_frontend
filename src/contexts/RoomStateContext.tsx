import { List } from 'immutable';
import React, { createContext, useContext, useState, ReactNode, FunctionComponent } from 'react';

export enum RoomState {
  GetGameRoom,
  SetPlayerName,
  WaitForMembers,
  PlayGame,
  EndGame,
  Loading,
}

export enum PlayerRole {
  Teacher = 'teacher',
  Student = 'student',
}

interface IRoomStateContext {
  roomState: RoomState | undefined;
  setRoomState: React.Dispatch<React.SetStateAction<RoomState>> | undefined;
  roomCode: string | undefined;
  setRoomCode: React.Dispatch<React.SetStateAction<string>> | undefined;
  playerName: string | undefined;
  setPlayerName: React.Dispatch<React.SetStateAction<string>> | undefined;
  allMembers: List<string> | undefined;
  setAllMembers: React.Dispatch<React.SetStateAction<List<string>>> | undefined;
  playerRole: string | undefined;
  setPlayerRole: React.Dispatch<React.SetStateAction<string | undefined>> | undefined;
}

export const RoomStateContext = createContext<IRoomStateContext>({
  roomState: undefined,
  setRoomState: undefined,
  roomCode: undefined,
  setRoomCode: undefined,
  playerName: undefined,
  setPlayerName: undefined,
  allMembers: undefined,
  setAllMembers: undefined,
  playerRole: undefined,
  setPlayerRole: undefined,
});

export const useRoomState: () => IRoomStateContext = () => useContext(RoomStateContext);

export const RoomStateContextProvider: FunctionComponent<{ children: ReactNode }> = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [roomState, setRoomState] = useState<RoomState>(RoomState.GetGameRoom);
  const [roomCode, setRoomCode] = useState<string>('');
  const [playerName, setPlayerName] = useState<string>('');
  const [allMembers, setAllMembers] = useState<List<string>>(List());
  const [playerRole, setPlayerRole] = useState<string | undefined>(undefined);

  return (
    <RoomStateContext.Provider
      value={{
        roomState,
        setRoomState,
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
    </RoomStateContext.Provider>
  );
};
