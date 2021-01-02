import React, { FunctionComponent } from 'react';
import { useGame } from '../../contexts/GameContext';
import { useRoomState } from '../../contexts/RoomStateContext';
import { useWebSocketContext } from '../../contexts/WebSocketContext';
import Card from './Card';

const LayCards: FunctionComponent = () => {
  const { playerName } = useRoomState();
  const { cardStates, cardWords, currentPlayer, waitingForResponse } = useGame();
  const { sendAction } = useWebSocketContext();

  const style = {
    cardContainer: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      width: '736px',
      height: '736px',
      alignSelf: 'center',
    },
  };

  return (
    <div style={style.cardContainer}>
      {cardWords?.map((word, index) => {
        const isActive = cardStates?.get(index)?.isActive || false;
        const locked = false;
        // const locked = !isActive || waitingForResponse || playerName !== currentPlayer;

        return (
          <Card
            key={index}
            word={(word && word.word) || ''}
            isOpen={cardStates?.get(index)?.isOpen || false}
            locked={locked}
            position={index}
            sendAction={sendAction}
            // setwaitingForResponse={setWaitingForResponse}
          />
        );
      })}
    </div>
  );
};

export default LayCards;
