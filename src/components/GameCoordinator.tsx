import React from 'react';
import { useGameState, GameState } from '../contexts/GameStateContext';
import GetGameRoom from './GetGameRoom';
import EnterPlayerName from './EnterPlayerName';
import WaitForMembers from './WaitForMembers';

const GameCoordinator = () => {
  const { gameState } = useGameState();

  switch (gameState) {
    case GameState.GetGameRoom:
      return <GetGameRoom />;
    case GameState.SetPlayerName:
      return <EnterPlayerName />;
    case GameState.WaitForMembers:
      return <WaitForMembers />;
    default:
      return <div>something is wrong</div>;
  }
};

export default GameCoordinator;
