import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
  FunctionComponent,
} from 'react';
import { useRoomState, RoomState, PlayerRole, Mode } from './RoomStateContext';
import io from 'socket.io-client';
import { List } from 'immutable';
import { AllServerActionType, GameCardState, ICardAction, useGame, GameWordCard } from './GameContext';
import { IRule } from '../components/SetCardsLayout';

// Events sent to websocket
export enum WebSocketEvent {
  CreateRoom = 'create room',
  EnterRoom = 'enter room',
  SubmitName = 'submit name',
  SetWords = 'set words',
  ConfirmCardsLayout = 'confirm cards layout',
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
  ReadyToSetLayout = 'ready to set layout',
  StartGame = 'started game',
  UpdateGameState = 'update gaem state',
  LeftRoom = 'member left room',
}

interface IWebSocketContext {
  connected: boolean;
  enterRoom: (roomCode: string) => void;
  createRoom: () => void;
  submitName: (playerName: string) => void;
  setWords: (words: Array<[string, string]>) => void;
  confirmCardsLayout: (layoutRules: IRule[], groupWordsBySet: boolean) => void;
  sendAction: (action: ICardAction) => void;
}

export const WebSocketContext = createContext<IWebSocketContext>({
  connected: false,
  enterRoom: roomCode => console.log('Calling dummy enterRoom.'),
  createRoom: () => console.log('Calling dummy CreateRoom.'),
  submitName: playerName => console.log('Calling dummy submitName.'),
  setWords: words => console.log('Calling dummy setWords.'),
  confirmCardsLayout: layoutRule => console.log('confirmCardsLayout'),
  sendAction: action => console.log('Calling dummy sendAction.'),
});

export const useWebSocketContext: () => IWebSocketContext = () => useContext(WebSocketContext);
interface IProp {
  children: ReactNode;
}
export const WebSocketProvider: FunctionComponent<{ children: ReactNode }> = ({ children }: IProp) => {
  const [socketIO, setSocketIO] = useState<SocketIOClient.Socket | undefined>();
  const { setRoomState, setPlayerName, setRoomCode, roomCode, playerRole, setPlayerRole, mode } = useRoomState();
  const { startGame, implementCardActions } = useGame();

  const connectToWebSocket = useCallback(() => {
    return new Promise<SocketIOClient.Socket>((resolve, reject) => {
      if (!socketIO) {
        const url =
          process.env.NODE_ENV === 'production'
            ? 'https://fathomless-oasis-35021.herokuapp.com/'
            : `http://localhost:${process.env.REACT_APP_BACKEND_PORT}`;
        const webSocket: SocketIOClient.Socket = io.connect(url);
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
    if (!mode) return;
    socketIO?.on(
      WebSocketEmissionEvent.GetNewMember,
      ({ actions }: { actions: AllServerActionType<typeof mode>[] }) => {
        implementCardActions(actions);
      },
    );

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
        shuffledCards,
        cardStates,
        actions,
      }: {
        shuffledCards: List<GameWordCard>;
        cardStates: List<GameCardState>;
        actions: AllServerActionType<typeof mode>[];
      }) => {
        if (!setRoomState) return;

        switch (mode) {
          case Mode.Game:
            startGame(List(shuffledCards), List(cardStates));
            implementCardActions(actions);
            setRoomState(RoomState.PlayCardMatchGame);
            return;
          case Mode.Free:
            console.log('shuffled cards: ', shuffledCards);
            console.log('cardStates: ', cardStates);
            console.log('actions: ', actions);
            startGame(List(shuffledCards), List(cardStates));
            setRoomState(RoomState.PlayFreeCard);
            return;
          default:
            throw Error(`${mode} does not exist`);
        }
      },
    );

    socketIO?.on(WebSocketEmissionEvent.ReadyToSetLayout, () => {
      setRoomState(RoomState.SetCardsLayout);
    });

    socketIO?.on(WebSocketEmissionEvent.UpdateGameState, (actions: AllServerActionType<typeof mode>[]) => {
      console.log('updateState actions: ', actions);
      implementCardActions(actions);
    });

    socketIO?.on(
      WebSocketEmissionEvent.LeftRoom,
      ({ name, actions }: { name: string; actions: AllServerActionType<typeof mode>[] }) => {
        // TODO: set a better data structure for removing member
        // or define an action on backend to do it
        implementCardActions(actions);
      },
    );

    return () => {
      socketIO?.off(WebSocketEmissionEvent.GetNewMember);
      socketIO?.off(WebSocketEmissionEvent.ConfirmRoom);
      socketIO?.off(WebSocketEmissionEvent.RejectRoom);
      socketIO?.off(WebSocketEmissionEvent.CreateNewRoom);
      socketIO?.off(WebSocketEmissionEvent.StartGame);
      socketIO?.off(WebSocketEmissionEvent.ReadyToSetLayout);
      socketIO?.off(WebSocketEmissionEvent.UpdateGameState);
      socketIO?.off(WebSocketEmissionEvent.LeftRoom);
    };
  }, [socketIO, setRoomState, setPlayerName, setRoomCode, implementCardActions, startGame, mode]);

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
      socketIO.emit(WebSocketEvent.CreateRoom, { mode });
    } else {
      const socket = await connectToWebSocket();
      socket.emit(WebSocketEvent.CreateRoom, { mode });
    }
    setPlayerRole && setPlayerRole(PlayerRole.Teacher);
  }, [socketIO, connectToWebSocket, setPlayerRole, mode]);

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

  const confirmCardsLayout = useCallback(
    (layoutRules: IRule[], groupWordsBySet: boolean) => {
      socketIO?.emit(WebSocketEvent.ConfirmCardsLayout, {
        roomCode,
        layoutRules,
        groupWordsBySet,
      });
    },
    [socketIO, roomCode],
  );

  return (
    <WebSocketContext.Provider
      value={{
        connected: socketIO !== undefined,
        enterRoom,
        createRoom,
        submitName,
        setWords,
        confirmCardsLayout,
        sendAction,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
