import React, { FunctionComponent, memo, useCallback, useEffect, useRef, useState } from 'react';
import { Content } from '../../components/SetCardsLayout';
import BaseCard, { IProps as IBaseCardProps } from './BaseCard';
import throttle from 'lodash/throttle';

export type Position = {
  x: number,
  y: number,
}

interface IFreeModeCard extends Pick<IBaseCardProps, 'id' | 'isActive' | 'getRef'> {
  isFaceUp: boolean;
  content: [string, string];
  faceUp: Content;
  faceDown: Content;
  position: Position;
  onFlipCard: () => void;
  setMovingCardIndex: () => void;
  setMoveStartPosition: (position: Position) => void;
}

const CARD_WIDTH = 150;
const CARD_HEIGHT = 150;
const THROTTLED_MS = 500;

const FreeModeCard: FunctionComponent<IFreeModeCard> = memo<IFreeModeCard>(
  ({ id, isActive, isFaceUp, content, faceDown, faceUp, onFlipCard, position, setMoveStartPosition, setMovingCardIndex }: IFreeModeCard) => {
    const [word, translation] = content;
    const getNode = (side: Content) =>
      side === Content.Translation ? Word(translation) : side === Content.Word ? Word(word) : Word(undefined);
    
    const prevClientPosition = useRef(position);

    const startMoveCard = useCallback((e: React.DragEvent<HTMLDivElement>) => {
      e.dataTransfer.effectAllowed = "move";

      const {clientX, clientY} = e;
      
      prevClientPosition.current = {
        x: clientX,
        y: clientY,
      };

      setMoveStartPosition({
        x: clientX,
        y: clientY,
      })

      setMovingCardIndex();
    }, [setMoveStartPosition, setMovingCardIndex]);

    const moveCard = useCallback((e: React.DragEvent<HTMLDivElement>) => {
      e.persist();
      e.preventDefault();
      
      // update server about moved distance:
      const {clientX, clientY} = e;
      const {x: prevX, y: prevY} = prevClientPosition.current;
      console.log(`moved x: ${clientX-prevX}`);
      console.log(`moved y: ${clientY-prevY}`);
      prevClientPosition.current = {
        x: clientX,
        y: clientY,
      };
    }, []);

    useEffect(() => {
      console.log(`Card ${content} mounted`);
      return () => console.log(`Card ${content} unmounting`);
    }, [content]);

    return (
      <div
        key={id}
        style={{
          position: 'absolute',
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
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
          startMoveCard={startMoveCard}
          moveCard={moveCard}
          draggable
        />
      </div>
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
