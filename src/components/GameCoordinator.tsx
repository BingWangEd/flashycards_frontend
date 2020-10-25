import React from 'react';
import { useGameState, GameState } from '../contexts/GameStateContext';
import GetGameRoom from './GetGameRoom/GetGameRoom';

const GameCoordinator = () => {
  const { gameState } = useGameState();

  switch (gameState) {
    case GameState.GetGameRoom:
      return <GetGameRoom />;
    case GameState.SetPlayerName:
      return <div>Set player name</div>;
    default:
      return <div>something is wrong</div>;
  }
};

export default GameCoordinator;
