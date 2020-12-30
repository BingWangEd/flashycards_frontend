import React, { FunctionComponent, useCallback } from 'react';
import { useWebSocketContext } from '../../contexts/WebSocketContext';
import InputBox from '../../uiUnits/InputBox';
import Button from '../../uiUnits/Button';
import { List } from 'immutable';

const GetGameRoom: FunctionComponent = () => {
  const { enterRoom, createRoom } = useWebSocketContext();

  const handleEnterARoom = useCallback(
    (value: string) => {
      enterRoom(value);
    },
    [enterRoom],
  );

  const handleCreateNewRoom = useCallback(() => {
    createRoom();
  }, [createRoom]);

  return (
    <div>
      <InputBox label={'Enter A Room You Want to Join'} onSubmit={handleEnterARoom} />
      <h4>or</h4>
      <div>
        <Button onClick={handleCreateNewRoom} label="Create a New Room" />
      </div>
    </div>
  );
};

export default GetGameRoom;
