import { List } from 'immutable';
import React, { FunctionComponent, useCallback, useState } from 'react';
import { useRoomState } from '../../contexts/RoomStateContext';
import { useWebSocketContext } from '../../contexts/WebSocketContext';
import SquareButton from '../../uiUnits/buttons/SquareButton';
import { CardColor } from '../../uiUnits/card/DemoCard';
import { shuffle } from '../../utils/utils';
import CardDemoCanvas from './CardDemoCanvas';
import EditCardSet from './EditCardSet';

export enum CardsLayoutSettingPhase {
  Content, // what does the each side of the card has
  SideUp, // which side to show when cards are first layed out
  WordNumber, // how many words to be included
  Order, // randomized or in order
  Grouping, // only if the users choose translation and words being separated
}

export type IRule = Pick<ICard, 'faceUp' | 'faceDown'> & {
  isRandomized: boolean;
};

const DemoGameWords: [string, string][] = [
  [CardColor.Red, `color: ${CardColor.Red}`],
  [CardColor.Green, `color: ${CardColor.Green}`],
  [CardColor.Blue, `color: ${CardColor.Blue}`],
  [CardColor.Yellow, `color: ${CardColor.Yellow}`],
];

export enum Content {
  Word = 'word',
  Translation = 'translation',
  None = 'none',
}

export const DEFAULT_RULES: IRule = {
  faceUp: Content.Word,
  faceDown: Content.Translation,
  isRandomized: false,
}

const defaultSetting: SettingType = {
  faceUpOption: Content.Word,
  faceDownOption: Content.Translation,
  isRandomized: false,
};

export type ICard = {
  id: number;
  faceUp: Content;
  faceDown: Content;
  isFaceUp: boolean;
  content: [string, string];
};

export type SettingType = {
  faceUpOption: Content;
  faceDownOption: Content;
  isRandomized: boolean;
};

const SET_NUMBER = 2;

const createDefaultWordSets = (wordPool: [string, string][], setNumber: number): List<ICard[] | undefined> => {
  const newWordSets: (ICard[] | undefined)[] = [];
  Array(setNumber)
    .fill(0)
    .forEach((value, index) => {
      if (index === 0) {
        const newWordCards: ICard[] = wordPool.map(([word, translation], index) => ({
          id: index,
          faceUp: defaultSetting.faceUpOption,
          faceDown: defaultSetting.faceDownOption,
          isFaceUp: true,
          content: [word, translation],
        }));
        newWordSets[index] = newWordCards;
      } else {
        newWordSets[index] = undefined;
      }
    });
  return List(newWordSets);
};

const SetCardsLayout: FunctionComponent<{ allWordNumber: number }> = ({ allWordNumber }: { allWordNumber: number }) => {
  const { roomCode } = useRoomState();
  const [wordSets, setWordSets] = useState<List<ICard[] | undefined>>(() =>
    createDefaultWordSets(DemoGameWords, SET_NUMBER),
  );
  const [layoutRules, setLayoutRules] = useState<List<IRule | undefined>>(List([DEFAULT_RULES, undefined]));
  const [groupWordsBySet, setGroupWordsBySet] = useState(false);
  const { confirmCardsLayout } = useWebSocketContext();

  const updateSet = useCallback(
    (index: number, { faceUpOption, faceDownOption, isRandomized }: SettingType) => {
      const newWordCards: ICard[] = DemoGameWords.map(([word, translation], index) => ({
        id: index,
        faceUp: faceUpOption,
        faceDown: faceDownOption,
        isFaceUp: true,
        content: [word, translation],
      }));

      setWordSets(isRandomized ? wordSets.set(index, shuffle(newWordCards, 1)) : wordSets.set(index, newWordCards));
    },
    [setWordSets, wordSets],
  );

  const removeSet = useCallback(
    (index: number) => {
      setWordSets(wordSets.set(index, undefined));
      setLayoutRules(layoutRules.set(index, undefined));
    },
    [setWordSets, wordSets],
  );

  return (
    <div>
      <h2>You are in Room 🗝: {roomCode}</h2>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        {wordSets.map((wordSet, index) => {
          return (
            <EditCardSet
              key={index}
              update={(props: SettingType) => {
                updateSet(index, props);
              }}
              remove={() => removeSet(index)}
              updateLayoutRules={({ faceUpOption, faceDownOption, isRandomized }: SettingType) => {
                setLayoutRules(
                  layoutRules.set(index, {
                    faceUp: faceUpOption,
                    faceDown: faceDownOption,
                    isRandomized,
                  }),
                );
              }}
              cardSetAdded={wordSet === undefined ? false : true}
            />
          );
        })}
      </div>
      <CardDemoCanvas
        wordSets={
          wordSets.filter(set => {
            return set !== undefined;
          }) as List<ICard[]>
        }
        groupWordsBySet={groupWordsBySet}
        cardSize={{
          width: 75,
          height: 100,
        }}
      />
      <div>
        <SquareButton
          label={groupWordsBySet ? 'Lay words next to words from the other set' : 'Group words by set'}
          onClick={() => {
            setGroupWordsBySet(!groupWordsBySet);
          }}
        />
        <SquareButton
          label={'Confirm Layout'}
          color={'white'}
          backgroundColor={'red'}
          onClick={() => {
            confirmCardsLayout(layoutRules.filter((rule) => rule !== undefined) as List<IRule>, groupWordsBySet);
          }}
        />
      </div>
    </div>
  );
};

export default SetCardsLayout;
