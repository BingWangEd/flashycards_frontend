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
  const cardContent = isOpen ? word : '♤';
  const { playerName, roomCode } = useRoomState();
  const style = {
    card: {
      width: '150px',
      height: '150px',
      borderRadius: '15px',
      margin: '15px',
      border: '2px solid #ccc',
      alignSelf: 'center',
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

  return (
    <div style={style.card} onClick={handleClick}>
      <h2>{cardContent}</h2>
    </div>
  );
});

Card.displayName = 'Card';

export default Card;
