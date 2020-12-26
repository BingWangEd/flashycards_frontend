import React, { createContext, useContext, useState, useCallback, FunctionComponent } from 'react';
import { useGameState, GameState, PlayerRole } from './GameStateContext';

// Events sent to websocket
export enum WebSocketEvent {
  CreateRoom = 'create room',
  EnterRoom = 'enter room',
  SubmitName = 'submit name',
  SetWords = 'set words',
}

// Events received from websocket
enum WebSocketEmissionEvent {
  Connect = 'connected to web socket',
  GetNewMember = 'got new member',
  ConfirmRoom = 'confirmed room exists',
  RejectRoom = 'rejected room exists',
  JoinRoom = 'joined room',
  CreateNewRoom = 'created new room',
}

const io = require('socket.io-client');

interface IWebSocketContext {
  connected: boolean;
  enterRoom: (roomName: string) => void;
  createRoom: () => void;
  submitName: (name: string) => void;
}

export const WebSocketContext = createContext<IWebSocketContext>({
  connected: false,
  enterRoom: (roomName) => console.log('Calling dummy enterRoom.'),
  createRoom: () => console.log('Calling dummy CreateRoom.'),
  submitName: (name) => console.log('Calling dummy submitName.'),
});

export const useWebSocketContext = () => useContext(WebSocketContext);

export const WebSocketProvider: FunctionComponent = ({ children }) => {
  const [socketIO, setSocketIO] = useState<SocketIOClient.Socket | undefined>();
  const {setGameState, setName, setAllMembers, setRoomCode, roomCode, playerRole, setPlayerRole} = useGameState();

  const connectToWebSocket = useCallback(() => {
    return new Promise<SocketIOClient.Socket>((resolve, reject) => {
      if (!socketIO) {
        const webSocket: SocketIOClient.Socket = io.connect(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}`);

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
        });
    
        webSocket.on(WebSocketEmissionEvent.JoinRoom, ({ name }: { name: string }) => {
          setName && setName(name);
          setGameState && setGameState(GameState.WaitForMembers);
        });

        webSocket.on(WebSocketEmissionEvent.Connect, () => {
          console.log('User connected to web socket');
          setSocketIO(webSocket);
          resolve(webSocket);
        });
      } else {
        resolve(socketIO);
      }
    });
  }, [socketIO, setAllMembers, setGameState, setName, setRoomCode]);

  const submitName = useCallback(
    (name: string) => {
      socketIO && socketIO.emit(WebSocketEvent.SubmitName, { name, roomCode, playerRole });
    },
    [socketIO, roomCode, playerRole],
  );

  const enterRoom = useCallback(
    async (roomCode: string) => { // TODO: catch error when webSocket connection is not created
      const role = playerRole ? playerRole : PlayerRole.Student;
      if (socketIO) {
        socketIO.emit(WebSocketEvent.EnterRoom, { roomCode });
      } else {
        const socket = await connectToWebSocket();
        socket.emit(WebSocketEvent.EnterRoom, { roomCode });
      }
      if (!playerRole) {
        setPlayerRole && setPlayerRole(role);
      }
    },
    [socketIO, connectToWebSocket, setPlayerRole, playerRole],
  );

  const createRoom = useCallback(async () => {
    if (socketIO) { // TODO: catch error when webSocket connection is not created
      socketIO.emit(WebSocketEvent.CreateRoom);
    } else {
      const socket = await connectToWebSocket();
      socket.emit(WebSocketEvent.CreateRoom);
    }
    setPlayerRole && setPlayerRole(PlayerRole.Teacher);
  }, [socketIO, connectToWebSocket, setPlayerRole]);

  return (
    <WebSocketContext.Provider
      value={{
        connected: socketIO !== undefined,
        enterRoom,
        createRoom,
        submitName,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
