import React, { createContext, useContext, useState, useEffect, useCallback, FunctionComponent } from 'react';
import { useGameState, GameState } from './GameStateContext';

export enum WebSocketEvent {
  CreateRoom = 'create room',
  EnterRoom = 'enter room',
  SubmitName = 'submit name',
  SetWords = 'set words',
}

enum WebSocketEmissionEvent {
  GetNewMember = 'got new member',
  ConfirmRoom = 'confirmed room exists',
  RejectRoom = 'rejected room exists',
  JoinRoom = 'joined room',
  CreateNewRoom = 'created new room',
}

const io = require('socket.io-client');

interface IWebSocketContext {
  connected: boolean;
  handleEnterRoom: (roomName: string) => void;
  handleCreateRoom: () => void;
  handleSubmitName: (name: string) => void;
}

export const WebSocketContext = createContext<IWebSocketContext>({
  connected: false,
  handleEnterRoom: (roomName) => console.log('Call dummy handleEnterRoom.'),
  handleCreateRoom: () => console.log('Call dummy handleCreateRoom.'),
  handleSubmitName: (name) => console.log('Call dummy handleSubmitName.'),
});

export const useWebSocketContext = () => useContext(WebSocketContext);

export const WebSocketProvider: FunctionComponent = ({ children }) => {
  const [webSocket] = useState<SocketIOClient.Socket | null>(() => io.connect(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}`));
  const { setGameState, setName, setAllMembers, setRoomCode, roomCode } = useGameState();

  useEffect(() => {
    if (webSocket) {
      webSocket.on(WebSocketEmissionEvent.GetNewMember, ({ allMembers }: { allMembers: string[] }) => {
        setAllMembers && setAllMembers(allMembers);
      });
  
      webSocket.on(WebSocketEmissionEvent.ConfirmRoom, ({ roomCode }: { roomCode: string }) => {
        setRoomCode && setRoomCode(roomCode);
        setGameState && setGameState(GameState.SetPlayerName);
      });
  
      webSocket.on(WebSocketEmissionEvent.RejectRoom, ({roomCode}: { roomCode: string }) => {
        alert(`${roomCode} does not exist.`);
      });
  
      webSocket.on(WebSocketEmissionEvent.CreateNewRoom, ({roomCode}: { roomCode: string }) => {
        setRoomCode && setRoomCode(roomCode);
        setGameState && setGameState(GameState.SetPlayerName);
      })
  
      webSocket.on(WebSocketEmissionEvent.JoinRoom, ({ name }: { name: string }) => {
        setName && setName(name);
        setGameState && setGameState(GameState.WaitForMembers);
      })
    }
  }, [webSocket, setAllMembers, setGameState, setName, setRoomCode]);

  const submitName = useCallback(
    (name: string) => {
      webSocket && webSocket.emit(WebSocketEvent.SubmitName, { name, roomCode });
    },
    [webSocket, roomCode],
  );

  const enterRoom = useCallback(
    (roomCode: string) => { // TODO: catch error when webSocket connection is not created
      if (webSocket) {
        webSocket.emit(WebSocketEvent.EnterRoom, { roomCode });
      }
    },
    [webSocket],
  );

  const createRoom = useCallback(() => {
    if (webSocket) { // TODO: catch error when webSocket connection is not created
      webSocket.emit(WebSocketEvent.CreateRoom);
    }
  }, [webSocket]);

  return (
    <WebSocketContext.Provider
      value={{
        connected: webSocket !== null,
        handleEnterRoom: enterRoom,
        handleCreateRoom: createRoom,
        handleSubmitName: submitName,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
