import React, { FunctionComponent } from 'react';
import { useRoomState, RoomState } from '../contexts/RoomStateContext';
import GetGameRoom from './GetGameRoom';
import EnterPlayerName from './EnterPlayerName';
import WaitForMembers from './WaitForMembers';
import PlayGame from './PlayGame';
import GameOver from './GameOver';
import Loading from './Loading';

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
    case RoomState.Loading:
      return <Loading />;
    default:
      return <div>something is wrong</div>;
  }
};

export default GameCoordinator;
