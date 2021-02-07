import React, { FunctionComponent, useCallback } from 'react';
import { ClientActionType, FreeCardState, useGame } from '../../contexts/GameContext';
import { useRoomState } from '../../contexts/RoomStateContext';
import { useWebSocketContext } from '../../contexts/WebSocketContext';
import FreeModeCard from '../../uiUnits/card/FreeModeCard';

const DisplayCardCanvas: FunctionComponent = () => {
  const { updateCardStates } = useGame();
  const { playerName, roomCode } = useRoomState();
  const { sendAction } = useWebSocketContext();
  const { cardWords, cardStates } = useGame();
  const style = {
    container: {
      width: '100vw',
      height: '100vh',
      position: 'relative' as const,
    },
  };

  const flipCard = useCallback(
    (position: number, previousCardState: FreeCardState) => {
      const newState = {
        ...previousCardState,
        isFaceUp: !previousCardState.isFaceUp,
      };

      sendAction({
        type: ClientActionType.Open,
        position,
        player: playerName || '',
        roomCode: roomCode || '',
      });

      updateCardStates([position], newState);
    },
    [updateCardStates, playerName, roomCode, sendAction],
  );

  return (
    <div style={style.container}>
      {cardWords &&
        cardWords.map((word, index) => {
          // @ts-ignore
          const currentCardState: FreeCardState = cardStates?.get(index);
          // @ts-ignore
          const { x, y } = currentCardState && currentCardState.position;

          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: `${x}px`,
                top: `${y}px`,
              }}
            >
              {
                // @ts-ignore
                <FreeModeCard
                  {...currentCardState}
                  {...word}
                  id={index}
                  onFlipCard={() => flipCard(index, currentCardState)}
                />
              }
            </div>
          );
        })}
    </div>
  );
};

export default DisplayCardCanvas;
