import React, { useCallback } from 'react';
import { useWebSocketContext } from '../../contexts/WebSocketContext';
import InputBox from '../../UIUnits/InputBox';
import CreateRoom from './CreateRoom';

const GetGameRoom = () => {
  const { handleEnterRoom } = useWebSocketContext();

  const handleSubmit = useCallback((value: string) => {
    handleEnterRoom(value)
  }, [handleEnterRoom]);

  return (
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
