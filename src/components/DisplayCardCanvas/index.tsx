import React, { FunctionComponent, useCallback, useRef } from 'react';
import { ClientActionType, FreeCardState, useGame } from '../../contexts/GameContext';
import { Mode, useRoomState } from '../../contexts/RoomStateContext';
import { useWebSocketContext } from '../../contexts/WebSocketContext';
import FreeModeCard, { Position } from '../../uiUnits/card/FreeModeCard';

const DisplayCardCanvas: FunctionComponent = () => {
  const { updateCardStates } = useGame<Mode.Free>();
  const { playerName, roomCode } = useRoomState();
  const { sendAction } = useWebSocketContext();
  const { cardWords, cardStates } = useGame<Mode.Free>();
  const movingCardIndex = useRef<number | undefined>();
  const moveStartPosition = useRef<Position | undefined>();

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
        payload: null,
      });

      updateCardStates([position], newState);
    },
    [updateCardStates, playerName, roomCode, sendAction],
  );

  const dropCard = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    const {clientX, clientY} = e;
    
    if (movingCardIndex.current === undefined || moveStartPosition.current === undefined) return;

    const cardIndex = movingCardIndex.current;
    movingCardIndex.current = undefined;

    const { x: moveStartX, y: moveStartY } = moveStartPosition.current;
    moveStartPosition.current = undefined;

    const currCardState = cardStates?.get(cardIndex);
    if (!currCardState) return;
    const { x: currX, y: currY } = currCardState.position;

    updateCardStates([cardIndex], {
      position: {
        x: currX + (clientX - moveStartX),
        y: currY + (clientY - moveStartY),
      }
    });

    if (!roomCode) return;

    sendAction({
      type: ClientActionType.Drop,
      position: cardIndex,
      payload: {
        x: currX + (clientX - moveStartX),
        y: currY + (clientY - moveStartY),
      },
      roomCode,
      player: playerName,
    });
  }, [updateCardStates, cardStates, sendAction]);

  return (
    <div
      style={style.container}
      // It seems you have to cancel these default actions in order to drop an element.
      // See https://www.quirksmode.org/blog/archives/2009/09/the_html5_drag.html
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={(e) => e.preventDefault()}
      // For Chrome, same effect could be reached via the `onDragEng` attached to each card,
      // but for Safari and FireFox `clientX` and `clientY` are only defined in `onDrop`
      onDrop={dropCard}
    >
      {cardWords &&
        cardWords.map((word, index) => {
          const currentCardState: FreeCardState | undefined = cardStates?.get(index);

          if (!currentCardState) return;
          const { isFaceUp, isActive, position } = currentCardState;
          const { faceUp, faceDown, content } = word;

          return (
            <FreeModeCard
              id={index}
              isActive={isActive}
              isFaceUp={isFaceUp}
              content={content}
              faceUp={faceUp}
              faceDown={faceDown}
              position={position}
              onFlipCard={() => flipCard(index, currentCardState)}
              setMovingCardIndex={() => movingCardIndex.current = index}
              setMoveStartPosition={(position: Position) => moveStartPosition.current = position}
            />
          )
        })
      }
    </div>
  );
};

export default DisplayCardCanvas;
