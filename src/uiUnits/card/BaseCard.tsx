import React, { FunctionComponent, memo, useCallback } from 'react';
import { CallbackRef } from '../../utils/utils';
import throttle from 'lodash/throttle';

export interface IProps {
  id: number;
  faceUp: React.ReactNode;
  faceDown: React.ReactNode;
  isFaceUp?: boolean;
  isActive?: boolean;
  flipCard: () => void;
  moveCard?: (e: React.DragEvent<HTMLDivElement>) => void;
  startMoveCard?: (e: React.DragEvent<HTMLDivElement>) => void;
  stopMoveCard?: () => void;
  draggable?: boolean;
  cardStyle?: React.CSSProperties;
  getRef?: CallbackRef;
}

const THROTTLED_MS = 200;

const BaseCard: FunctionComponent<IProps> = ({
  id,
  faceUp,
  faceDown,
  isFaceUp = true,
  isActive = true,
  flipCard,
  moveCard,
  startMoveCard,
  stopMoveCard,
  draggable = false,
  cardStyle = {
    width: '150px',
    height: '150px',
  },
  getRef,
}: IProps) => {
  const handleClick = useCallback(() => {
    if (!isActive) return;
    flipCard();
  }, [flipCard, isActive]);

  const throttledDragCard = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    if (!moveCard) return;
    const throttled = throttle(e => moveCard(e), THROTTLED_MS);

    return () => throttled.cancel();
  }, [moveCard]);

  const style = {
    card: {
      borderRadius: '15px',
      margin: '15px',
      alignSelf: 'center',
      display: 'flex',
      justifyContent: 'center',
      position: 'relative' as const,
      alignItems: 'center',
      ...cardStyle,
    },
    flipContainer: {
      perspective: '1000px',
    },
    cardContent: {
      transform: 'rotateY(0deg)',
      transition: '0.6s',
      zIndex: 2,
      transformStyle: 'preserve-3d' as const,
      position: 'relative' as const,
      border: '2px solid #ccc',
      background: 'white',
    },
    cardCover: {
      transform: 'rotateY(180deg)',
      transition: '0.6s',
      transformStyle: 'preserve-3d' as const,
      position: 'relative' as const,
      border: '2px solid #ccc',
      background: 'white',
    },
    hideBack: {
      backfaceVisibility: 'hidden' as const,
      position: 'absolute' as const,
      top: '0',
      left: '0',
    },
  };

  return (
    <div
      draggable={draggable}
      style={{
        ...style.flipContainer,
        ...style.card,
        ...cardStyle,
      }}
      onClick={handleClick}
      onDragStart={startMoveCard}
      onDrag={throttledDragCard}
      onDragEnd={stopMoveCard}
      ref={getRef}
    >
      <div
        style={{
          ...style.card,
          ...style.cardContent,
          ...style.hideBack,
          transform: isFaceUp ? 'rotateY(0deg)' : 'rotateY(180deg)',
        }}
      >
        {faceUp}
      </div>
      <div
        style={{
          ...style.card,
          ...style.cardCover,
          ...style.hideBack,
          transform: isFaceUp ? 'rotateY(-180deg)' : 'rotateY(0deg)',
        }}
      >
        {faceDown}
      </div>
    </div>
  );
};

export default memo<IProps>(BaseCard);
