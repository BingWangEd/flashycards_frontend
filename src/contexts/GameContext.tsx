import { List, Map } from 'immutable';
import React, { createContext, useContext, ReactNode, useState, useCallback, FunctionComponent } from 'react';
import { RoomState, useRoomState } from './RoomStateContext';

export enum CardSide {
  Word = 'word',
  Translation = 'translation',
}

export interface CardState {
  isActive: boolean;
  isOpen: boolean;
}

export interface WordCard {
  word: string;
  side: CardSide;
  counterpart: string;
}

interface IGameContext {
  cardWords: List<WordCard | undefined> | undefined;
  cardStates: List<CardState> | undefined;
  updateCardStates: (positions: number[], newState: CardState) => void;
  startGame: (shuffledWords: List<WordCard>, cardStates: List<CardState>) => void;
  implementCardActions: (actions: AllServerActionType[]) => void;
  currentPlayer: string | undefined;
  scores: Map<string, number> | undefined;
  winners: string[] | undefined;
  waitingForResponse: boolean;
  setWaitingForResponse: React.Dispatch<React.SetStateAction<boolean>>;
  hasFlippedCard: boolean | undefined;
  setHasFlippedCard: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}

export type AllServerActionType =
  | IResponseAction<ServerActionType.UpdateCardStates>
  | IResponseAction<ServerActionType.ChangeTurns>
  | IResponseAction<ServerActionType.SetScores>
  | IResponseAction<ServerActionType.SetMembers>;

export type IResponseAction<T extends ServerActionType> = {
  type: T;
  payload: T extends ServerActionType.ChangeTurns
    ? IMember
    : T extends ServerActionType.EndGame
    ? string[]
    : T extends ServerActionType.SetScores
    ? Map<string, number>
    : T extends ServerActionType.SetMembers
    ? List<string>
    : List<CardState>; // when ActionType is `UpdateCardStates`, return cardStates directly
  player?: string;
  timeout?: number;
};

export enum ClientActionType {
  Open = 'open',
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

export interface ICardAction {
  type: ClientActionType;
  position: number;
  player?: string;
  roomCode: string;
}

export const GameContext = createContext<IGameContext>({
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

export const useGame: () => IGameContext = () => useContext(GameContext);

export const GameContextProvider: FunctionComponent<{ children: ReactNode }> = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [cardWords, setCardWords] = useState<List<WordCard>>();
  const [cardStates, setCardStates] = useState<List<CardState> | undefined>();
  const [currentPlayer, setCurrentPlayer] = useState<string | undefined>();
  const [scores, setScores] = useState<Map<string, number>>(Map());
  // Deactivate any interaction until received response to action
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const { setAllMembers, setRoomState } = useRoomState();
  const [winners, setWinners] = useState<string[] | undefined>();
  const [hasFlippedCard, setHasFlippedCard] = useState<boolean | undefined>();

  const act = useCallback(
    <T extends ServerActionType>(action: IResponseAction<T>) => {
      switch (action.type) {
        case ServerActionType.UpdateCardStates:
          const { payload: cardStatesPayload } = action as IResponseAction<ServerActionType.UpdateCardStates>;
          setCardStates(List(cardStatesPayload));
          break;
        case ServerActionType.ChangeTurns:
          const { payload: changeTurnsPayload } = action as IResponseAction<ServerActionType.ChangeTurns>;
          setCurrentPlayer(changeTurnsPayload.name);
          break;
        case ServerActionType.SetScores:
          const { payload: scores } = action as IResponseAction<ServerActionType.SetScores>;
          setScores(Map(scores));
          break;
        case ServerActionType.SetMembers:
          const { payload: membersPayload } = action as IResponseAction<ServerActionType.SetMembers>;
          setAllMembers && setAllMembers(List(membersPayload));
          break;
        case ServerActionType.EndGame:
          const { payload: winnersPayload } = action as IResponseAction<ServerActionType.EndGame>;
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
    (positions: number[], newState: CardState) => {
      let newCardStates: List<CardState> = cardStates || List();
      positions.forEach(position => {
        newCardStates = newCardStates.set(position, newState);
      });
      setCardStates(newCardStates);
    },
    [setCardStates, cardStates],
  );

  const timeoutFunc = useCallback(
    (action: AllServerActionType, ms: number) => {
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
    (action: AllServerActionType) => {
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
    async (actions: AllServerActionType[]) => {
      return Promise.all(
        actions.map(async action => {
          await asyncAct(action);
        }),
      );
    },
    [asyncAct],
  );

  const implementCardActions = useCallback(
    async (actions: AllServerActionType[]) => {
      await asyncActions(actions);

      setWaitingForResponse(false);
    },
    [asyncActions],
  );

  const startGame = useCallback(
    (shuffledWords: List<WordCard>, cardStates: List<CardState>) => {
      setCardWords(List(shuffledWords));
      setCardStates(List(cardStates));
    },
    [setCardWords, setCardStates],
  );

  return (
    <GameContext.Provider
      value={{
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
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
