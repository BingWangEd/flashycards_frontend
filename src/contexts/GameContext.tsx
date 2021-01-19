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
  startGame: (shuffledWords: List<WordCard>, cardStates: List<CardState>) => void;
  implementCardActions: (actions: AllActionType[]) => void;
  currentPlayer: string | undefined;
  scores: Map<string, number> | undefined;
  winners: string[] | undefined;
  waitingForResponse: boolean;
  setWaitingForResponse: React.Dispatch<React.SetStateAction<boolean>>;
}

export type AllActionType =
  | IResponseAction<ActionType.Open>
  | IResponseAction<ActionType.Close>
  | IResponseAction<ActionType.Deactivate>
  | IResponseAction<ActionType.ChangeTurns>
  | IResponseAction<ActionType.SetScores>
  | IResponseAction<ActionType.SetMembers>;

export type IResponseAction<T extends ActionType> = {
  type: T;
  payload: T extends ActionType.ChangeTurns
    ? IMember
    : T extends ActionType.EndGame
    ? string[]
    : T extends ActionType.SetScores
    ? Map<string, number>
    : T extends ActionType.SetMembers
    ? List<string>
    : number[];
  player?: string;
  timeout?: number;
};

export enum ActionType {
  Open = 'open card',
  Close = 'close card',
  Deactivate = 'deactivate card',
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
  type: ActionType;
  position: number;
  player?: string;
  roomCode: string;
}

export const GameContext = createContext<IGameContext>({
  cardWords: undefined,
  startGame: () => console.log('Calling dummy setCardWords'),
  cardStates: undefined,
  implementCardActions: () => console.log('Calling dummy implementCardActions'),
  currentPlayer: undefined,
  scores: undefined,
  winners: undefined,
  waitingForResponse: false,
  setWaitingForResponse: () => console.log('Calling dummy setWaitingForResponse'),
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

  const act = useCallback(
    <T extends ActionType>(action: IResponseAction<T>) => {
      let newCardStates = cardStates || List();
      switch (action.type) {
        case ActionType.Open:
          if (!cardStates) return;
          const { payload: openPayload } = action as IResponseAction<ActionType.Open>;

          openPayload.forEach(position => {
            newCardStates = newCardStates.set(position, {
              isActive: true,
              isOpen: true,
            });
          });
          setCardStates(newCardStates);
          break;
        case ActionType.Close:
          if (!cardStates) return;
          const { payload: closePayload } = action as IResponseAction<ActionType.Close>;

          closePayload.forEach(position => {
            newCardStates = newCardStates.set(position, {
              isActive: true,
              isOpen: false,
            });
          });
          setCardStates(newCardStates);
          break;
        case ActionType.Deactivate:
          if (!cardStates) return;
          const { payload: deactivatePayload } = action as IResponseAction<ActionType.Deactivate>;
          deactivatePayload.forEach(position => {
            newCardStates = newCardStates.set(position, {
              isActive: false,
              isOpen: true,
            });
          });
          setCardStates(newCardStates);
          break;
        case ActionType.ChangeTurns:
          const { payload: changeTurnsPayload } = action as IResponseAction<ActionType.ChangeTurns>;
          setCurrentPlayer(changeTurnsPayload.name);
          break;
        case ActionType.SetScores:
          const { payload: scores } = action as IResponseAction<ActionType.SetScores>;
          setScores(Map(scores));
          break;
        case ActionType.SetMembers:
          const { payload: membersPayload } = action as IResponseAction<ActionType.SetMembers>;
          setAllMembers && setAllMembers(List(membersPayload));
          break;
        case ActionType.EndGame:
          const { payload: winnersPayload } = action as IResponseAction<ActionType.EndGame>;
          setWinners(winnersPayload);
          setRoomState && setRoomState(RoomState.EndGame);
          break;
        default:
          throw Error(`Action ${action} is not recognizable`);
      }
    },
    [cardStates, setAllMembers, setRoomState],
  );

  const timeoutFunc = useCallback(
    (action: AllActionType, ms: number) => {
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
    (action: AllActionType) => {
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
    async (actions: AllActionType[]) => {
      return Promise.all(
        actions.map(async action => {
          await asyncAct(action);
        }),
      );
    },
    [asyncAct],
  );

  const implementCardActions = useCallback(
    async (actions: AllActionType[]) => {
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
        implementCardActions,
        startGame,
        currentPlayer,
        scores,
        winners,
        waitingForResponse,
        setWaitingForResponse,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
