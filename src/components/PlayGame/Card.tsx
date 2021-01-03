import React, { FunctionComponent, memo, useCallback, useEffect } from 'react';
import { ActionType, ICardAction } from '../../contexts/GameContext';
import { useRoomState } from '../../contexts/RoomStateContext';

interface IProps {
  word: string;
  position: number;
  locked: boolean;
  isOpen: boolean;
  sendAction: (action: ICardAction) => void;
  //setwaitingForResponse: React.Dispatch<React.SetStateAction<boolean>>;
}

const Card: FunctionComponent<IProps> = memo<IProps>(({ word, position, locked, isOpen, sendAction }: IProps) => {
  const { playerName, roomCode } = useRoomState();
  const style = {
    card: {
      width: '150px',
      height: '150px',
      borderRadius: '15px',
      margin: '15px',
      alignSelf: 'center',
      display: 'flex',
      justifyContent: 'center',
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
    },
    cardCover: {
      transform: 'rotateY(180deg)',
      transition: '0.6s',
      transformStyle: 'preserve-3d' as const,
      position: 'relative' as const,
      border: '2px solid #ccc',
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
  };

  useEffect(() => {
    console.log(`card ${word} mounted`);
    return () => console.log(`card ${word} unmounted`);
  });

  const handleClick = useCallback(() => {
    if (locked || isOpen) return;
    // setwaitingForResponse(true);
    sendAction({
      type: ActionType.Open,
      position,
      player: playerName || '',
      roomCode: roomCode || '',
    });
  }, [locked, isOpen, playerName, position, roomCode, sendAction]);

  // return (
  //   <div style={style.card} onClick={handleClick}>
  //     <h2 style={style.text}>{cardContent}</h2>
  //   </div>
  // );

  return (
    <div style={{...style.flipContainer, ...style.card}}>
        <div style={{ ...style.card, ...style.cardContent, ...style.hideBack, transform: isOpen ? 'rotateY(0deg)' : 'rotateY(180deg)'}}>
          <h2 style={style.text}>{word}</h2>
        </div>
        <div style={{ ...style.card, ...style.cardCover, ...style.hideBack, transform: isOpen ? 'rotateY(-180deg)' : 'rotateY(0deg)'}} onClick={handleClick}>
          <h2 style={style.text}>♤</h2>
        </div>
      </div>
  )
});

Card.displayName = 'Card';

export default Card;
