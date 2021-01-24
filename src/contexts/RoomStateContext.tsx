import { List } from 'immutable';
import React, { createContext, useContext, useState, ReactNode, FunctionComponent } from 'react';

export enum RoomState {
  ChooseMode,
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

export enum Mode {
  Free,
  Game,
}

interface IRoomStateContext {
  roomState: RoomState | undefined;
  setRoomState: React.Dispatch<React.SetStateAction<RoomState>>;
  roomCode: string | undefined;
  setRoomCode: React.Dispatch<React.SetStateAction<string>>;
  playerName: string | undefined;
  setPlayerName: React.Dispatch<React.SetStateAction<string>>;
  allMembers: List<string> | undefined;
  setAllMembers: React.Dispatch<React.SetStateAction<List<string>>>;
  playerRole: string | undefined;
  setPlayerRole: React.Dispatch<React.SetStateAction<string | undefined>>;
  mode: Mode | undefined;
  setMode: React.Dispatch<React.SetStateAction<Mode | undefined>>;
}

export const RoomStateContext = createContext<IRoomStateContext>({
  roomState: undefined,
  setRoomState: () => console.log('Calling dummy setRoomState'),
  roomCode: undefined,
  setRoomCode: () => console.log('Calling dummy setRoomCode'),
  playerName: undefined,
  setPlayerName: () => console.log('Calling dummy setPlayerName'),
  allMembers: undefined,
  setAllMembers: () => console.log('Calling dummy setAllMembers'),
  playerRole: undefined,
  setPlayerRole: () => console.log('Calling dummy setPlayerRole'),
  mode: undefined,
  setMode: () => console.log('Calling dummy setMode'),
});

export const useRoomState: () => IRoomStateContext = () => useContext(RoomStateContext);

export const RoomStateContextProvider: FunctionComponent<{ children: ReactNode }> = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [roomState, setRoomState] = useState<RoomState>(RoomState.ChooseMode);
  const [roomCode, setRoomCode] = useState<string>('');
  const [playerName, setPlayerName] = useState<string>('');
  const [allMembers, setAllMembers] = useState<List<string>>(List());
  const [playerRole, setPlayerRole] = useState<string | undefined>(undefined);
  const [mode, setMode] = useState<Mode | undefined>();

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
        mode,
        setMode,
      }}
    >
      {children}
    </RoomStateContext.Provider>
  );
};
