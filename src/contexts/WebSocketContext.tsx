import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useRoomState, RoomState, PlayerRole } from './RoomStateContext';
import io from 'socket.io-client';
import { List } from 'immutable';
import { CardState, Game, WordCard } from '../objects/Game';
import { useGame } from './GameContext';

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
  StartGame = 'started game',
}

enum ActionType {
  FlipCard = 'flip card',
}

interface ICardAction {
  type: ActionType;
  position: number;
  player: string;
}

interface IWebSocketContext {
  connected: boolean;
  enterRoom: (roomCode: string) => void;
  createRoom: () => void;
  submitName: (playerName: string) => void;
  setWords: (words: Array<[string, string]>) => void;
  sendAction: (action: ICardAction) => void;
}

export const WebSocketContext = createContext<IWebSocketContext>({
  connected: false,
  enterRoom: roomCode => console.log('Calling dummy enterRoom.'),
  createRoom: () => console.log('Calling dummy CreateRoom.'),
  submitName: playerName => console.log('Calling dummy submitName.'),
  setWords: words => console.log('Calling dummy setWords.'),
  sendAction: action => console.log('Calling dummy sendAction.'),
});

export const useWebSocketContext: () => IWebSocketContext = () => useContext(WebSocketContext);
interface IProp {
  children: ReactNode;
}
export const WebSocketProvider = ({ children }: IProp) => {
  const [socketIO, setSocketIO] = useState<SocketIOClient.Socket | undefined>();
  const {
    setRoomState,
    setPlayerName,
    setAllMembers,
    setRoomCode,
    roomCode,
    playerRole,
    setPlayerRole,
  } = useRoomState();
  const { setGame } = useGame();

  const connectToWebSocket = useCallback(() => {
    return new Promise<SocketIOClient.Socket>((resolve, reject) => {
      if (!socketIO) {
        const webSocket: SocketIOClient.Socket = io.connect(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}`);

        webSocket.on(WebSocketEmissionEvent.GetNewMember, ({ allMembers }: { allMembers: string[] }) => {
          setAllMembers && setAllMembers(allMembers);
        });

        webSocket.on(WebSocketEmissionEvent.ConfirmRoom, ({ roomCode }: { roomCode: string }) => {
          setRoomCode && setRoomCode(roomCode);
          setRoomState && setRoomState(RoomState.SetPlayerName);
        });

        webSocket.on(WebSocketEmissionEvent.RejectRoom, ({ roomCode }: { roomCode: string }) => {
          alert(`${roomCode} does not exist.`);
        });

        webSocket.on(
          WebSocketEmissionEvent.CreateNewRoom,
          ({ roomCode, list }: { roomCode: string; list: List<number> }) => {
            setRoomCode && setRoomCode(roomCode);
            setRoomState && setRoomState(RoomState.SetPlayerName);
          },
        );

        webSocket.on(WebSocketEmissionEvent.JoinRoom, ({ playerName }: { playerName: string }) => {
          setPlayerName && setPlayerName(playerName);
          setRoomState && setRoomState(RoomState.WaitForMembers);
        });

        webSocket.on(WebSocketEmissionEvent.Connect, () => {
          console.log('User connected to web socket');
          setSocketIO(webSocket);
          resolve(webSocket);
        });

        webSocket.on(
          WebSocketEmissionEvent.StartGame,
          ({ shuffledWords, cardStates }: { shuffledWords: List<WordCard>; cardStates: List<CardState> }) => {
            const game = new Game(List(shuffledWords), List(cardStates));
            setGame && setGame(game);
            setRoomState && setRoomState(RoomState.PlayGame);
          },
        );
      } else {
        resolve(socketIO);
      }
    });
  }, [socketIO, setAllMembers, setRoomState, setPlayerName, setRoomCode, setGame]);

  const submitName = useCallback(
    (playerName: string) => {
      socketIO && socketIO.emit(WebSocketEvent.SubmitName, { playerName, roomCode, playerRole });
    },
    [socketIO, roomCode, playerRole],
  );

  const enterRoom = useCallback(
    async (roomCode: string) => {
      // TODO: catch error when webSocket connection is not created
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
    if (socketIO) {
      // TODO: catch error when webSocket connection is not created
      socketIO.emit(WebSocketEvent.CreateRoom);
    } else {
      const socket = await connectToWebSocket();
      socket.emit(WebSocketEvent.CreateRoom);
    }
    setPlayerRole && setPlayerRole(PlayerRole.Teacher);
  }, [socketIO, connectToWebSocket, setPlayerRole]);

  const setWords = useCallback(
    (words: Array<[string, string]>) => {
      if (socketIO) {
        socketIO.emit(WebSocketEvent.SetWords, { words, roomCode });
      }
    },
    [socketIO, roomCode],
  );

  const sendAction = useCallback(
    (action: ICardAction) => {
      if (!socketIO) return;

      socketIO.emit(WebSocketEvent.SetWords, action);
    },
    [socketIO],
  );

  return (
    <WebSocketContext.Provider
      value={{
        connected: socketIO !== undefined,
        enterRoom,
        createRoom,
        submitName,
        setWords,
        sendAction,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
