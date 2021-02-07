import React, { FunctionComponent, useCallback, useState } from 'react';
import { useWebSocketContext } from '../../contexts/WebSocketContext';
import SquareButton from '../../uiUnits/buttons/SquareButton';
import { CardColor } from '../../uiUnits/card/DemoCard';
import { shuffle } from '../../utils/utils';
import AddCardSet from './AddCardSet';
import CardDemoCanvas from './CardDemoCanvas';

export enum CardsLayoutSettingPhase {
  Content, // what does the each side of the card has
  SideUp, // which side to show when cards are first layed out
  WordNumber, // how many words to be included
  Order, // randomized or in order
  Grouping, // only if the users choose translation and words being separated
}

export enum Content {
  Word = 'word',
  Translation = 'translation',
  None = 'none',
}

export type ICard = {
  id: number;
  faceUp: Content;
  faceDown: Content;
  isFaceUp: boolean;
  content: [string, string]; // [word, translation]
};

export type IRule = Pick<ICard, 'faceUp' | 'faceDown'> & {
  isRandomized: boolean;
};

const DemoGameWords = [
  [CardColor.Red, `color: ${CardColor.Red}`],
  [CardColor.Green, `color: ${CardColor.Green}`],
  [CardColor.Blue, `color: ${CardColor.Blue}`],
  [CardColor.Yellow, `color: ${CardColor.Yellow}`],
];

const SetCardsLayout: FunctionComponent<{ allWordNumber: number }> = ({ allWordNumber }) => {
  const [wordSets, setWordSets] = useState<ICard[][]>([]);
  const [layoutRules, setLayoutRules] = useState<IRule[]>([]);
  const [groupWordsBySet, setGroupWordsBySet] = useState(false);
  const { confirmCardsLayout } = useWebSocketContext();

  const add = useCallback(
    (faceUpOption: Content, faceDownOption: Content, isRandomized: string) => {
      const wordCards: ICard[] = DemoGameWords.map(([word, translation], index) => ({
        id: index,
        faceUp: faceUpOption,
        faceDown: faceDownOption,
        isFaceUp: true,
        content: [word, translation],
      }));

      if (isRandomized === 'yes') {
        setWordSets(wordSets.concat([shuffle(wordCards, 1)]));
      } else {
        setWordSets(wordSets.concat([wordCards]));
      }

      setLayoutRules(prevRules => {
        return prevRules.concat([
          {
            faceUp: faceUpOption,
            faceDown: faceDownOption,
            isRandomized: isRandomized === 'yes' ? true : false,
          },
        ]);
      });
    },
    [wordSets, setWordSets],
  );

  return (
    <div>
      {wordSets.length <= 1 && <AddCardSet add={add} />}
      <CardDemoCanvas
        wordSets={wordSets}
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
          label={'Clear all sets'}
          onClick={() => {
            setWordSets([]);
            setLayoutRules([]);
          }}
        />
        <SquareButton
          label={'Confirm Layout'}
          color={'red'}
          onClick={() => {
            confirmCardsLayout(layoutRules, groupWordsBySet);
          }}
        />
      </div>
    </div>
  );
};

export default SetCardsLayout;
