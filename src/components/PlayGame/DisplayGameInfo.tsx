import React, { FunctionComponent } from 'react';
import { useGame } from '../../contexts/GameContext';

const DisplayGameInfo: FunctionComponent = () => {
  const { scores, currentPlayer } = useGame();

  return (
    <div>
      <h4>Current player: {currentPlayer}</h4>
      <div>
        {scores?.entrySeq().map(([player, score], index) => {
          return (
            <h4 key={index}>
              {player}: {score}
            </h4>
          );
        })}
      </div>
    </div>
  );
};

export default DisplayGameInfo;
