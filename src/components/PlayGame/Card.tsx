import React, { FunctionComponent, memo, useEffect } from 'react';
import { useRoomState } from '../../contexts/RoomStateContext';
import { ActionType, useWebSocketContext } from '../../contexts/WebSocketContext';

interface IProps {
  word: string;
  position: number;
  isActive: boolean;
  isOpen: boolean;
}

const isDeepEqual = (prevProps: IProps, currProps: IProps) => {
  const { word: prevWord, position: prevPosition, isActive: prevIsActive, isOpen: prevIsOpen } = prevProps;
  const { word, position, isActive, isOpen } = currProps;

  const result = prevWord === word && prevPosition === position && prevIsActive === isActive && prevIsOpen === isOpen;

  return result;
};

const Card: FunctionComponent<IProps> = memo<IProps>(({ word, position, isActive, isOpen }: IProps) => {
  const { sendAction } = useWebSocketContext();
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

  console.log(`card ${word} rendered`);

  useEffect(() => {
    console.log(`card ${word} mounted`);
    return () => console.log(`card ${word} unmounted`);
  });
  return (
    <div
      style={style.card}
      onClick={() => {
        if (isActive && !isOpen) {
          sendAction({
            type: ActionType.Flip,
            position,
            player: playerName || '',
            roomCode: roomCode || '',
          });
        }
      }}
    >
      <h2>{cardContent}</h2>
    </div>
  );
}, isDeepEqual);

Card.displayName = 'Card';

export default Card;
