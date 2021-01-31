import React, { FunctionComponent, useCallback, useState } from 'react';
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

enum Order {
  Randomized = 'randomized',
  InOrder = 'in order',
}

enum Grouping {
  SideBySideInOrder = 'Words next to their corresponding translations',
  SideBySideRandomized = 'Words next to random translation',
  WordTogetherTranslationTogether = 'Words on one side and their translations on the other side',
  Mixed = 'Mix words and translations together',
}

export type ICard = {
  id: number;
  faceUp: Content;
  faceDown: Content;
  isFaceUp: boolean;
  content: [string, string]; // [word, translation]
}

const DemoGameWords =[
  [CardColor.Red, `color: ${CardColor.Red}`],
  [CardColor.Green, `color: ${CardColor.Green}`],
  [CardColor.Blue, `color: ${CardColor.Blue}`],
  [CardColor.Yellow, `color: ${CardColor.Yellow}`],
];

const SetCardsLayout: FunctionComponent<{allWordNumber: number}> = ({allWordNumber}) => {
  const [wordSets, setWordSets] = useState<(ICard[])[]>([]);
  const [groupWordsBySet, setGroupWordsBySet] = useState(false);
  console.log('wordSets: ', wordSets);

  const add = useCallback((faceUpOption: Content, faceDownOption: Content, isRandomized: string) => {

    const wordCards: ICard[] = DemoGameWords.map(([word, translation], index) => ({
      id: index,
      faceUp: faceUpOption,
      faceDown: faceDownOption,
      isFaceUp: true,
      content: [word, translation]
    }));

    if (isRandomized === 'yes') {
      setWordSets(wordSets.concat([shuffle(wordCards, 1)]));
    } else {
      setWordSets(wordSets.concat([wordCards]));
    }
  }, [wordSets, setWordSets]);
  
  return (
    <div>
      {wordSets.length <= 1 && <AddCardSet add={add}/>}
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
          }}
        />
        <SquareButton 
          label={'Confirm Layout'}
          color={'red'}
          onClick={() => {
          }}
        />
      </div>
    </div>
  );
};

export default SetCardsLayout;
