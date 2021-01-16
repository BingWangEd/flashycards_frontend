import React, { FunctionComponent } from 'react';
import { useRoomState, RoomState } from '../contexts/RoomStateContext';
import GetGameRoom from './GetGameRoom';
import EnterPlayerName from './EnterPlayerName';
import WaitForMembers from './WaitForMembers';
import PlayGame from './PlayGame';
import GameOver from './GameOver';

const GameCoordinator: FunctionComponent = () => {
  const { roomState } = useRoomState();

  switch (roomState) {
    case RoomState.GetGameRoom:
      return <GetGameRoom />;
    case RoomState.SetPlayerName:
      return <EnterPlayerName />;
    case RoomState.WaitForMembers:
      return <WaitForMembers />;
    case RoomState.PlayGame:
      return <PlayGame />;
    case RoomState.EndGame:
      return <GameOver />;
    default:
      return <div>something is wrong</div>;
  }
};

export default GameCoordinator;
