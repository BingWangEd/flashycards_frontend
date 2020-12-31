import { List } from 'immutable';
import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { ActionType } from './WebSocketContext';

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
  setCardWords: React.Dispatch<React.SetStateAction<List<WordCard> | undefined>>;
  cardStates: List<CardState> | undefined;
  setCardStates: React.Dispatch<React.SetStateAction<List<CardState> | undefined>>;
  updateCardStates: (position: number, action: ActionType) => void;
}

export const GameContext = createContext<IGameContext>({
  cardWords: undefined,
  setCardWords: () => console.log('Calling dummy setCardWords'),
  cardStates: undefined,
  setCardStates: () => () => console.log('Calling dummy setCardStates'),
  updateCardStates: () => console.log('Calling dummy updateCardStates'),
});

export const useGame: () => IGameContext = () => useContext(GameContext);

export const GameContextProvider = ({ children }: { children: ReactNode }) => {
  const [cardWords, setCardWords] = useState<List<WordCard>>();
  const [cardStates, setCardStates] = useState<List<CardState> | undefined>();

  const updateCardStates = useCallback(
    (position: number, action: ActionType): void => {
      const currentState = cardStates && cardStates.get(position);
      if (!cardStates || !currentState || !currentState.isActive) return;

      switch (action) {
        case ActionType.Flip:
          setCardStates(
            cardStates.set(position, {
              isActive: true,
              isOpen: true,
            }),
          );
          break;
        case ActionType.Deactivate:
          setCardStates(
            cardStates.set(position, {
              isActive: false,
              isOpen: true,
            }),
          );
          break;
        default:
          console.log(`Action ${action} is not recognizable`);
      }
    },
    [cardStates, setCardStates],
  );

  return (
    <GameContext.Provider
      value={{
        cardWords,
        setCardWords,
        cardStates,
        setCardStates,
        updateCardStates,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
