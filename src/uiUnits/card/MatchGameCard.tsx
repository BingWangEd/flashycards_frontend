import React, { FunctionComponent, memo, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import BaseCard from './BaseCard';

interface IProps {
  word: string;
  position: number;
  isOpen: boolean;
  isActive: boolean;
  handleClick: (isOpen: boolean, position: number) => void;
}

const MatchGameCard: FunctionComponent<IProps> = ({ word, position, isActive, isOpen, handleClick }: IProps) => {
  const isPrevActive = useRef<boolean>();
  const isPrevOpen = useRef<boolean>();
  const renderAnimation =
    isActive === false && isPrevActive.current === true
      ? '🙆🏻‍♀️'
      : isOpen === false && isPrevOpen.current === true
      ? '🙅🏻‍♀️'
      : null;

  useEffect(() => {
    isPrevActive.current = isActive;
    isPrevOpen.current = isOpen;
  }, [isActive, isOpen]);

  const style = {
    card: {
      width: '150px',
      height: '150px',
    },
    text: {
      alignSelf: 'center',
      textAlign: 'center' as const,
    },
    result: {
      position: 'absolute' as const,
      fontSize: '2em',
      bottom: '5px',
      left: '84px',
      zIndex: 20,
      width: '50px',
      opacity: 0,
    },
  };

  const AnimatedCardComponent = styled.div`
    animation: 2s
      ${keyframes({
        '0%': { opacity: '0' },
        '25%': { opacity: '1' },
        '75%': { opacity: '1' },
        '100%': { opacity: '0' },
      })}
      ease-in;
  `;

  const animation = (
    <AnimatedCardComponent style={style.result}>
      <span>{renderAnimation}</span>
    </AnimatedCardComponent>
  );

  return (
    <div style={{ position: 'relative' }}>
      {animation}
      <BaseCard
        id={position}
        faceUp={CardFace(word, style.text)}
        faceDown={CardFace('♤', style.text)}
        isFaceUp={isOpen}
        isActive={isActive}
        flipCard={() => handleClick(isOpen, position)}
        draggable={false}
        cardStyle={style.card}
      />
    </div>
  );
};

const CardFace = (content: string, style: React.CSSProperties) => <h2 style={style}>{content}</h2>;

export default memo<IProps>(MatchGameCard);
