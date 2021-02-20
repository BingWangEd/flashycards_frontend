import React, { FunctionComponent, memo, useCallback, useRef } from 'react';
import { Content } from '../../components/SetCardsLayout';
import BaseCard, { IProps as IBaseCardProps } from './BaseCard';
import { useWebSocketContext } from '../../contexts/WebSocketContext';
import { ClientActionType, ZindexLayer } from '../../contexts/GameContext';
import { useRoomState } from '../../contexts/RoomStateContext';

export type Position = {
  x: number;
  y: number;
};

interface IFreeModeCard extends Pick<IBaseCardProps, 'id' | 'isActive' | 'getRef'> {
  isFaceUp: boolean;
  content: [string, string];
  faceUp: Content;
  faceDown: Content;
  position: Position;
  zIndex: ZindexLayer;
  onFlipCard: () => void;
  setMovingCardIndex: () => void;
  setMoveStartPosition: (position: Position) => void;
}

const CARD_WIDTH = 150;
const CARD_HEIGHT = 150;

const FreeModeCard: FunctionComponent<IFreeModeCard> = ({
  id,
  isActive,
  isFaceUp,
  content,
  faceDown,
  faceUp,
  onFlipCard,
  zIndex,
  position,
  setMoveStartPosition,
  setMovingCardIndex,
}: IFreeModeCard) => {
  const { sendAction } = useWebSocketContext();
  const { roomCode, playerName } = useRoomState();

  const [word, translation] = content;
  const getNode = (side: Content) =>
    side === Content.Translation ? Word(translation) : side === Content.Word ? Word(word) : Word(undefined);

  const prevClientPosition = useRef(position);

  const startMoveCard = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.dataTransfer.effectAllowed = 'move';

      const { clientX, clientY } = e;

      prevClientPosition.current = {
        x: clientX,
        y: clientY,
      };

      setMoveStartPosition({
        x: clientX,
        y: clientY,
      });

      setMovingCardIndex();
    },
    [setMoveStartPosition, setMovingCardIndex],
  );

  // TODO: cancel throttle
  const moveCard = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.persist();
      e.preventDefault();

      // update server about moved distance:
      const { clientX, clientY } = e;
      if (clientX === null || clientY === null || !roomCode) return;
      const { x: prevX, y: prevY } = prevClientPosition.current;

      sendAction({
        type: ClientActionType.Move,
        position: id,
        payload: {
          x: clientX - prevX,
          y: clientY - prevY,
        },
        roomCode,
        player: playerName,
      });

      prevClientPosition.current = {
        x: clientX,
        y: clientY,
      };
    },
    [id, playerName, roomCode, sendAction],
  );

  return (
    <div
      key={id}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <BaseCard
        id={id}
        faceUp={getNode(faceUp)}
        faceDown={getNode(faceDown)}
        cardStyle={{
          width: `${CARD_WIDTH}px`,
          height: `${CARD_HEIGHT}px`,
          zIndex: zIndex,
        }}
        isFaceUp={isFaceUp}
        isActive={isActive}
        flipCard={onFlipCard}
        startMoveCard={startMoveCard}
        moveCard={moveCard}
        draggable
      />
    </div>
  );
};

const Word = (word: string | undefined) => {
  return (
    <p
      style={{
        fontSize: '1.2em',
      }}
    >
      {word}
    </p>
  );
};

export default memo<IFreeModeCard>(FreeModeCard);
