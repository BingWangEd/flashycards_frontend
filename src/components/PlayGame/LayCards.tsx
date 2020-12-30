import React, { FunctionComponent } from 'react';
import { useGame } from '../../contexts/GameContext';
import { useWebSocketContext } from '../../contexts/WebSocketContext';
import Card from './Card';

const LayCards: FunctionComponent = () => {
  const { sendAction } = useWebSocketContext();
  const { game } = useGame();
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
      {game?.shuffledWords.map((word, index) => {
        return (
          <Card
            word={word.word}
            isOpen={game?.cardStates.get(index)?.isOpen || false}
            isActive={game?.cardStates.get(index)?.isActive || false}
            key={index}
          />
        );
      })}
    </div>
  );
};

export default LayCards;
