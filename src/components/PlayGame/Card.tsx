import React, { FunctionComponent, memo, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

interface IProps {
  word: string;
  position: number;
  isOpen: boolean;
  isActive: boolean;
  handleClick: (isOpen: boolean, position: number) => void;
}

const Card: FunctionComponent<IProps> = memo<IProps>(({ word, position, isActive, isOpen, handleClick }: IProps) => {
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
  });

  const style = {
    card: {
      width: '150px',
      height: '150px',
      borderRadius: '15px',
      margin: '15px',
      alignSelf: 'center',
      display: 'flex',
      justifyContent: 'center',
      position: 'relative' as const,
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
    text: {
      alignSelf: 'center',
      textAlign: 'center' as const,
    },
    result: {
      position: 'absolute' as const,
      fontSize: '2em',
      bottom: '-10px',
      left: '67px',
      zIndex: 20,
      width: '50px',
      opacity: 0,
    },
  };

  const AnimatedComponent = styled.div`
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
    <AnimatedComponent style={style.result}>
      <span>{renderAnimation}</span>
    </AnimatedComponent>
  );

  return (
    <div style={{ ...style.flipContainer, ...style.card }} onClick={() => handleClick(isOpen, position)}>
      {animation}
      <div
        style={{
          ...style.card,
          ...style.cardContent,
          ...style.hideBack,
          transform: isOpen ? 'rotateY(0deg)' : 'rotateY(180deg)',
        }}
      >
        <h2 style={style.text}>{word}</h2>
      </div>
      <div
        style={{
          ...style.card,
          ...style.cardCover,
          ...style.hideBack,
          transform: isOpen ? 'rotateY(-180deg)' : 'rotateY(0deg)',
        }}
      >
        <h2 style={style.text}>♤</h2>
      </div>
    </div>
  );
});

Card.displayName = 'Card';

export default Card;
