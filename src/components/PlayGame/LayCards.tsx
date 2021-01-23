import React, { FunctionComponent, useCallback, useMemo } from 'react';
import { ClientActionType, useGame } from '../../contexts/GameContext';
import { useRoomState } from '../../contexts/RoomStateContext';
import { useWebSocketContext } from '../../contexts/WebSocketContext';
import Card from './Card';

const LayCards: FunctionComponent = () => {
  const { playerName, roomCode } = useRoomState();
  const {
    cardStates,
    updateCardStates,
    cardWords,
    currentPlayer,
    waitingForResponse,
    setWaitingForResponse,
    hasFlippedCard,
    setHasFlippedCard,
  } = useGame();
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

  const handleClick = useCallback(
    (isOpen, position) => {
      if (isOpen) return;
      if (!hasFlippedCard) {
        setHasFlippedCard(true); // can just be boolean
      } else {
        setWaitingForResponse(true);
        setHasFlippedCard(false);
      }

      sendAction({
        type: ClientActionType.Open,
        position,
        player: playerName || '',
        roomCode: roomCode || '',
      });

      updateCardStates([position], {
        isActive: true,
        isOpen: true,
      });
    },
    [hasFlippedCard, setHasFlippedCard, updateCardStates, playerName, roomCode, sendAction, setWaitingForResponse],
  );

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
            handleClick={handleClick}
          />
        );
      })}
    </div>
  );
};

export default LayCards;
