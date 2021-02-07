import React, { FunctionComponent, memo, useCallback } from 'react';
import { Content } from '../../components/SetCardsLayout';
import BaseCard, { IProps as IBaseCardProps } from './BaseCard';

interface IFreeModeCard extends Pick<IBaseCardProps, 'id' | 'isActive' | 'getRef'> {
  isFaceUp: boolean;
  content: [string, string];
  faceUp: Content;
  faceDown: Content;
  onFlipCard: () => void;
}

const CARD_WIDTH = 150;
const CARD_HEIGHT = 150;

const FreeModeCard: FunctionComponent<IFreeModeCard> = memo<IFreeModeCard>(
  ({ id, isActive, isFaceUp, content, faceDown, faceUp, onFlipCard }: IFreeModeCard) => {
    const [word, translation] = content;
    const getNode = (side: Content) =>
      side === Content.Translation ? Word(translation) : side === Content.Word ? Word(word) : Word(undefined);

    useCallback(() => {
      console.log(`Card ${content} mounted`);
      return () => console.log(`Card ${content} unmounting`);
    }, [content]);

    return (
      <BaseCard
        id={id}
        faceUp={getNode(faceUp)}
        faceDown={getNode(faceDown)}
        cardStyle={{
          width: `${CARD_WIDTH}px`,
          height: `${CARD_HEIGHT}px`,
        }}
        isFaceUp={isFaceUp}
        isActive={isActive}
        flipCard={onFlipCard}
      />
    );
  },
);

const Word = (word: string | undefined) => {
  return (
    <p
      style={{
        fontSize: '1.2em',
      }}
    >
      {word}
    </p>
  );
};

export default FreeModeCard;
