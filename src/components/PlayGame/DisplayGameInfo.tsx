import React, { FunctionComponent } from 'react';
import { useGame } from '../../contexts/GameContext';
import { useRoomState } from '../../contexts/RoomStateContext';

const DisplayGameInfo: FunctionComponent = () => {
  const { scores, currentPlayer } = useGame();
  const { playerName } = useRoomState();
  const isSelf = currentPlayer === playerName;

  return (
    <div>
      <h4>
        Current player: <span style={{ color: isSelf ? 'red' : 'black' }}>{isSelf ? 'YOU' : currentPlayer}</span>
      </h4>
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
