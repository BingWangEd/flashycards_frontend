import React, { FunctionComponent } from 'react';
import { useWebSocketContext } from '../../contexts/WebSocketContext';
import LayCards from './LayCards';

const PlayGame: FunctionComponent = () => {
  const { sendAction } = useWebSocketContext();

  return (
    <div>
      Playing game
      <LayCards />
    </div>
  );
};

export default PlayGame;
