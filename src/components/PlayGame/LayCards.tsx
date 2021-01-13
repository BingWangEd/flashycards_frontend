import React, { FunctionComponent, useMemo } from 'react';
import { useGame } from '../../contexts/GameContext';
import { useRoomState } from '../../contexts/RoomStateContext';
import { useWebSocketContext } from '../../contexts/WebSocketContext';
import Card from './Card';

const LayCards: FunctionComponent = () => {
  const { playerName } = useRoomState();
  const { cardStates, cardWords, currentPlayer, waitingForResponse, setWaitingForResponse } = useGame();
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

  const isLocked = useMemo(() => waitingForResponse || playerName !== currentPlayer, [
    waitingForResponse,
    playerName,
    currentPlayer,
  ]);

  return (
    <div
      style={{
        ...style.cardContainer,
        pointerEvents: isLocked ? 'none' : 'auto',
      }}
    >
      {cardWords?.map((word, index) => {
        const isActive = cardStates?.get(index)?.isActive || false;

        return (
          <Card
            key={index}
            word={(word && word.word) || ''}
            isOpen={cardStates?.get(index)?.isOpen || false}
            isActive={isActive}
            position={index}
            sendAction={sendAction}
            setwaitingForResponse={setWaitingForResponse}
          />
        );
      })}
    </div>
  );
};

export default LayCards;
