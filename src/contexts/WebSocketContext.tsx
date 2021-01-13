import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { useRoomState, RoomState, PlayerRole } from './RoomStateContext';
import io from 'socket.io-client';
import { List } from 'immutable';
import { AllActionType, CardState, ICardAction, useGame, WordCard } from './GameContext';

// Events sent to websocket
export enum WebSocketEvent {
  CreateRoom = 'create room',
  EnterRoom = 'enter room',
  SubmitName = 'submit name',
  SetWords = 'set words',
  SendAction = 'send action',
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
  ReceiveAction = 'received action',
  LeftRoom = 'member left room',
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
  const { setRoomState, setPlayerName, setRoomCode, roomCode, playerRole, setPlayerRole } = useRoomState();
  const { startGame, implementCardActions } = useGame();

  const connectToWebSocket = useCallback(() => {
    return new Promise<SocketIOClient.Socket>((resolve, reject) => {
      if (!socketIO) {
        const webSocket: SocketIOClient.Socket = io.connect(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}`);
        webSocket.on(WebSocketEmissionEvent.Connect, () => {
          console.log('User connected to web socket');
          setSocketIO(webSocket);
          resolve(webSocket);
        });
      } else {
        resolve(socketIO);
      }
    });
  }, [socketIO]);

  useEffect(() => {
    socketIO?.on(WebSocketEmissionEvent.GetNewMember, ({ actions }: { actions: AllActionType[] }) => {
      implementCardActions(actions);
    });

    socketIO?.on(WebSocketEmissionEvent.ConfirmRoom, ({ roomCode }: { roomCode: string }) => {
      setRoomCode && setRoomCode(roomCode);
      setRoomState && setRoomState(RoomState.SetPlayerName);
    });

    socketIO?.on(WebSocketEmissionEvent.RejectRoom, ({ roomCode }: { roomCode: string }) => {
      alert(`${roomCode} does not exist or game already started in the room`);
    });

    socketIO?.on(WebSocketEmissionEvent.CreateNewRoom, ({ roomCode }: { roomCode: string }) => {
      setRoomCode && setRoomCode(roomCode);
      setRoomState && setRoomState(RoomState.SetPlayerName);
    });

    socketIO?.on(WebSocketEmissionEvent.JoinRoom, ({ playerName }: { playerName: string }) => {
      setPlayerName && setPlayerName(playerName);
      setRoomState && setRoomState(RoomState.WaitForMembers);
    });

    socketIO?.on(
      WebSocketEmissionEvent.StartGame,
      ({
        shuffledWords,
        cardStates,
        actions,
      }: {
        shuffledWords: List<WordCard>;
        cardStates: List<CardState>;
        actions: AllActionType[];
      }) => {
        startGame(List(shuffledWords), List(cardStates));
        implementCardActions(actions);
        setRoomState && setRoomState(RoomState.PlayGame);
      },
    );

    socketIO?.on(WebSocketEmissionEvent.ReceiveAction, (actions: AllActionType[]) => {
      implementCardActions(actions);
    });

    socketIO?.on(WebSocketEmissionEvent.LeftRoom, ({ name, actions }: { name: string; actions: AllActionType[] }) => {
      // TODO: set a better data structure for removing member
      // or define an action on backend to do it
      // setAllMembers(allMembers.delete(name));
      implementCardActions(actions);
    });

    return () => {
      socketIO?.off(WebSocketEmissionEvent.GetNewMember);
      socketIO?.off(WebSocketEmissionEvent.ConfirmRoom);
      socketIO?.off(WebSocketEmissionEvent.RejectRoom);
      socketIO?.off(WebSocketEmissionEvent.CreateNewRoom);
      socketIO?.off(WebSocketEmissionEvent.StartGame);
      socketIO?.off(WebSocketEmissionEvent.ReceiveAction);
      socketIO?.off(WebSocketEmissionEvent.LeftRoom);
    };
  }, [socketIO, setRoomState, setPlayerName, setRoomCode, implementCardActions, startGame]);

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

      socketIO.emit(WebSocketEvent.SendAction, action);
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
