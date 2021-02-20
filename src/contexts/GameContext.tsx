import { List, Map } from 'immutable';
import React, { createContext, useContext, ReactNode, useState, useCallback, FunctionComponent } from 'react';
import { Content } from '../components/SetCardsLayout';
import { Position } from '../uiUnits/card/FreeModeCard';
import { Mode, RoomState, useRoomState } from './RoomStateContext';

export enum CardSide {
  Word = 'word',
  Translation = 'translation',
}

export interface GameCardState {
  isActive: boolean;
  isOpen: boolean;
}

export interface GameWordCard {
  word: string;
  side: CardSide;
  counterpart: string;
}

export enum ZindexLayer {
  Normal = 0,
  Upper = 10,
}

export interface FreeCardState {
  isFaceUp: boolean;
  isActive: boolean;
  zIndex: ZindexLayer;
  position: {
    x: number;
    y: number;
  };
}

export interface FreeWordCard {
  id: number;
  faceUp: Content;
  faceDown: Content;
  content: [string, string];
}

type WordCard<M extends Mode> = M extends Mode.Free ? FreeWordCard : GameWordCard;
type CardState<M extends Mode> = M extends Mode.Free ? FreeCardState : GameCardState;

interface IGameContext<M extends Mode> {
  cardWords: List<WordCard<M>> | undefined;
  cardStates: List<CardState<M>> | undefined;
  updateCardStates: (positions: number[], newState: Partial<CardState<M>>) => void;
  startGame: (shuffledCards: List<WordCard<M>>, cardStates: List<CardState<M>>) => void;
  implementCardActions: (actions: AllServerActionType<M>[]) => void;
  currentPlayer: string | undefined;
  scores: Map<string, number> | undefined;
  winners: string[] | undefined;
  waitingForResponse: boolean;
  setWaitingForResponse: React.Dispatch<React.SetStateAction<boolean>>;
  hasFlippedCard: boolean | undefined;
  setHasFlippedCard: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}

export type AllServerActionType<M extends Mode> =
  | IResponseAction<ServerActionType.UpdateCardStates, M>
  | IResponseAction<ServerActionType.ChangeTurns, M>
  | IResponseAction<ServerActionType.SetScores, M>
  | IResponseAction<ServerActionType.SetMembers, M>;

export type IResponseAction<T extends ServerActionType, M extends Mode> = {
  type: T;
  payload: T extends ServerActionType.ChangeTurns
    ? IMember
    : T extends ServerActionType.EndGame
    ? string[]
    : T extends ServerActionType.SetScores
    ? Map<string, number>
    : T extends ServerActionType.SetMembers
    ? List<string>
    : List<CardState<M>>; // when ActionType is `UpdateCardStates`, return cardStates directly
  player?: string;
  timeout?: number;
};

export enum ClientActionType {
  Open = 'open',
  Move = 'move',
  Drop = 'drop',
}

export enum ServerActionType {
  UpdateCardStates = 'update card states',
  ChangeTurns = 'change turns',
  SetScores = 'set scores',
  SetMembers = 'set members',
  EndGame = 'end game',
}

interface IMember {
  name: string;
  role: string;
  socketId: string;
}

type MovedDimensions = {
  x: number;
  y: number;
};

export interface ICardAction<T extends ClientActionType> {
  type: T;
  position: number;
  player?: string;
  payload: T extends ClientActionType.Move ? MovedDimensions : T extends ClientActionType.Drop ? Position : null;
  roomCode: string;
}

export const GameContext = createContext<IGameContext<Mode>>({
  cardWords: undefined,
  startGame: () => console.log('Calling dummy setCardWords'),
  cardStates: undefined,
  updateCardStates: () => console.log('Calling dummy updateCardStates'),
  implementCardActions: () => console.log('Calling dummy implementCardActions'),
  currentPlayer: undefined,
  scores: undefined,
  winners: undefined,
  waitingForResponse: false,
  setWaitingForResponse: () => console.log('Calling dummy setWaitingForResponse'),
  hasFlippedCard: undefined,
  setHasFlippedCard: () => console.log('Calling dummy setHasFlippedCard'),
});

type UseGameContextType = <M extends Mode>() => IGameContext<M>;
export const useGame: UseGameContextType = () => useContext(GameContext);

export const GameContextProvider: FunctionComponent<{ children: ReactNode }> = <M extends Mode>({
  children,
}: {
  children: ReactNode;
}) => {
  const [cardWords, setCardWords] = useState<List<WordCard<M>>>(List([]));
  const [cardStates, setCardStates] = useState<List<CardState<M>> | undefined>();
  const [currentPlayer, setCurrentPlayer] = useState<string | undefined>();
  const [scores, setScores] = useState<Map<string, number>>(Map());
  // Deactivate any interaction until received response to action
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const { setAllMembers, setRoomState } = useRoomState();
  const [winners, setWinners] = useState<string[] | undefined>();
  const [hasFlippedCard, setHasFlippedCard] = useState<boolean | undefined>();

  const act = useCallback(
    <T extends ServerActionType>(action: IResponseAction<T, M>) => {
      switch (action.type) {
        case ServerActionType.UpdateCardStates:
          const { payload: cardStatesPayload } = action as IResponseAction<ServerActionType.UpdateCardStates, M>;
          setCardStates(List(cardStatesPayload));
          break;
        case ServerActionType.ChangeTurns:
          const { payload: changeTurnsPayload } = action as IResponseAction<ServerActionType.ChangeTurns, M>;
          setCurrentPlayer(changeTurnsPayload.name);
          break;
        case ServerActionType.SetScores:
          const { payload: scores } = action as IResponseAction<ServerActionType.SetScores, M>;
          setScores(Map(scores));
          break;
        case ServerActionType.SetMembers:
          const { payload: membersPayload } = action as IResponseAction<ServerActionType.SetMembers, M>;
          setAllMembers && setAllMembers(List(membersPayload));
          break;
        case ServerActionType.EndGame:
          const { payload: winnersPayload } = action as IResponseAction<ServerActionType.EndGame, M>;
          setWinners(winnersPayload);
          setRoomState && setRoomState(RoomState.EndGame);
          break;
        default:
          throw Error(`Action ${action} is not recognizable`);
      }
    },
    [setAllMembers, setRoomState],
  );

  const updateCardStates = useCallback(
    (positions: number[], newState: Partial<CardState<M>>) => {
      if (cardStates === undefined) return;
      let newCardStates: List<CardState<M>> = cardStates;
      positions.forEach(position => {
        const currState = cardStates.get(position);
        if (currState === undefined) return;
        newCardStates = newCardStates.set(position, {
          ...currState,
          ...newState,
        });
      });
      setCardStates(newCardStates);
    },
    [setCardStates, cardStates],
  );

  const timeoutFunc = useCallback(
    (action: AllServerActionType<M>, ms: number) => {
      return new Promise(resolve => {
        setTimeout(() => {
          act(action);
          resolve('OK');
        }, ms);
      });
    },
    [act],
  );

  const asyncAct = useCallback(
    (action: AllServerActionType<M>) => {
      return new Promise(async resolve => {
        const { timeout } = action;
        if (timeout) {
          await timeoutFunc(action, timeout);
        } else {
          act(action);
        }
        resolve('OK');
      });
    },
    [act, timeoutFunc],
  );

  const asyncActions = useCallback(
    async (actions: AllServerActionType<M>[]) => {
      return Promise.all(
        actions.map(async action => {
          await asyncAct(action);
        }),
      );
    },
    [asyncAct],
  );

  const implementCardActions = useCallback(
    async (actions: AllServerActionType<M>[]) => {
      await asyncActions(actions);

      setWaitingForResponse(false);
    },
    [asyncActions],
  );

  const startGame = useCallback(
    (shuffledCards: List<WordCard<M>>, cardStates: List<CardState<M>>) => {
      setCardWords(List(shuffledCards));
      setCardStates(List(cardStates));
    },
    [setCardWords, setCardStates],
  );

  const newContext: IGameContext<M> = {
    cardWords,
    cardStates,
    updateCardStates,
    implementCardActions,
    startGame,
    currentPlayer,
    scores,
    winners,
    waitingForResponse,
    setWaitingForResponse,
    hasFlippedCard,
    setHasFlippedCard,
  };

  return <GameContext.Provider value={newContext}>{children}</GameContext.Provider>;
};
