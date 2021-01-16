import React, { FunctionComponent, useCallback } from 'react';
import { isExpressionWithTypeArguments } from 'typescript';
import { useGame } from '../../contexts/GameContext';
import { useRoomState } from '../../contexts/RoomStateContext';
import confetti from '../../assets/icons8-confetti-100.png';
import futurama_fry from '../../assets/icons8-futurama-fry-100.png';

const GameOver: FunctionComponent = () => {
  const winners = ['b'];
  const playerName = 'a';
  const isWinner = winners?.find(winner => winner === playerName);
  const otherWinners = winners?.filter(winner => winner !== playerName) || [];
  const lastWinner = otherWinners.pop();
  const startWinnerString = !isWinner ? '' : otherWinners.length > 0 ? 'You, ' : 'You ';
  const middleWinnerString = otherWinners.length > 0 ? `${otherWinners.join(', ')} ` : '';
  const lastWinnerString = !lastWinner
    ? ''
    : isWinner || otherWinners.length > 0
    ? `and ${lastWinner} `
    : `${lastWinner} `;

  const finalString = startWinnerString + middleWinnerString + lastWinnerString + 'won the game!';

  const style = {
    container: {
      height: '250px',
    },
  }

  return (
    <div style={style.container}>
      <h2>{isWinner ? `Goood-job 🙌🏽! ${finalString}` : `Hey loser 🤦🏻‍♀️, ${finalString}`}</h2>
      <div>
        <img src={isWinner ? confetti : futurama_fry} alt="" />
      </div>
    </div>
  );
};

export default GameOver;
