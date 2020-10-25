import React from 'react';
import { useWebSocketContext } from '../../contexts/WebSocketContext';
import InputBox from '../../UIUnits/InputBox';
import CreateRoom from './CreateRoom';
import { useGameState } from '../../contexts/GameStateContext';

const GetGameRoom = () => {
  const { handleEnterRoom } = useWebSocketContext();
  const { setGameState } = useGameState();

  const handleSubmit = (value: string) => {
    handleEnterRoom(value);
  }

  return(
    <div>
      <InputBox
        label={'Enter A Room You Want to Join'}
        onSubmit={handleSubmit}
      />
      <h4>or</h4>
      <CreateRoom />
    </div>
  )
}

export default GetGameRoom;
