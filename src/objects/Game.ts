import { List } from 'immutable';

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

export class Game {
  shuffledWords: List<WordCard>;
  cardStates: List<CardState>;

  constructor(shuffledWords: List<WordCard>, cardStates: List<CardState>) {
    this.shuffledWords = shuffledWords;
    this.cardStates = cardStates;
  }
}
