import React, { FunctionComponent } from 'react';
import { useGame } from '../../contexts/GameContext';
import Card from './Card';

const LayCards: FunctionComponent = () => {
  const { cardStates, cardWords } = useGame();
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
        return (
          <Card
            key={index}
            word={(word && word.word) || ''}
            isOpen={cardStates?.get(index)?.isOpen || false}
            isActive={cardStates?.get(index)?.isActive || false}
            position={index}
          />
        );
      })}
    </div>
  );
};

export default LayCards;
