import React, { FunctionComponent } from 'react';
import { useGame } from '../../contexts/GameContext';
import { useWebSocketContext } from '../../contexts/WebSocketContext';

interface IProps {
  word: string;
  key: number;
  isActive: boolean;
  isOpen: boolean;
}

const Card: FunctionComponent<IProps> = ({ word, key, isActive, isOpen }: IProps) => {
  const { sendAction } = useWebSocketContext();
  const cardContent = isOpen ? word : '♤';
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
  return (
    <div style={style.card}>
      <h2>{cardContent}</h2>
    </div>
  );
};

export default Card;
