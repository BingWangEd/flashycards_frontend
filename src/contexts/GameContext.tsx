import { List, Map } from 'immutable';
import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';

enum CardSide {
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
  waitingForResponse: boolean;
  setWaitingForResponse: React.Dispatch<React.SetStateAction<boolean>>;
}

export type AllActionType =
  | IResponseAction<ActionType.Open>
  | IResponseAction<ActionType.Close>
  | IResponseAction<ActionType.Deactivate>
  | IResponseAction<ActionType.ChangeTurns>
  | IResponseAction<ActionType.ChangeScore>;

type IResponseAction<T extends ActionType> = {
  type: T;
  payload: T extends ActionType.ChangeTurns ? IMember : T extends ActionType.ChangeScore ? number : number[];
  player: string;
  timeout?: number;
};

export enum ActionType {
  Open = 'open card',
  Close = 'close card',
  Deactivate = 'deactivate card',
  ChangeTurns = 'change turns',
  ChangeScore = 'change score',
}

interface IMember {
  name: string;
  role: string;
  socketId: string;
}

export interface ICardAction {
  type: ActionType;
  position: number;
  player: string;
  roomCode: string;
}

export const GameContext = createContext<IGameContext>({
  cardWords: undefined,
  startGame: () => console.log('Calling dummy setCardWords'),
  cardStates: undefined,
  implementCardActions: () => console.log('Calling dummy implementCardActions'),
  currentPlayer: undefined,
  scores: undefined,
  waitingForResponse: false,
  setWaitingForResponse: () => console.log('Calling dummy setWaitingForResponse'),
});

export const useGame: () => IGameContext = () => useContext(GameContext);

export const GameContextProvider = ({ children }: { children: ReactNode }) => {
  const [cardWords, setCardWords] = useState<List<WordCard>>();
  const [cardStates, setCardStates] = useState<List<CardState> | undefined>();
  const [currentPlayer, setCurrentPlayer] = useState<string | undefined>();
  const [scores, setScores] = useState<Map<string, number> | undefined>();
  // Deactivate any interaction until received response to action
  const [waitingForResponse, setWaitingForResponse] = useState(false);

  const act = useCallback(
    <T extends ActionType>(action: IResponseAction<T>) => {
      // setWaitingForResponse(false);

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
        case ActionType.ChangeScore:
          const { player, payload: changeScorePayload } = action as IResponseAction<ActionType.ChangeScore>;
          setScores(scores?.set(player, changeScorePayload));
          break;
        default:
          throw Error(`Action ${action} is not recognizable`);
      }
    },
    [cardStates, scores],
  );

  const implementCardActions = useCallback(
    (actions: AllActionType[]): void => {
      actions.forEach(action => {
        const { timeout } = action;
        if (timeout) {
          setTimeout(() => act(action), timeout);
        } else {
          act(action);
        }
      });
    },
    [act],
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
        waitingForResponse,
        setWaitingForResponse,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
