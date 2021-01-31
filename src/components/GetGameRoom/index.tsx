import React, { FunctionComponent, useCallback } from 'react';
import { RoomState, useRoomState } from '../../contexts/RoomStateContext';
import { useWebSocketContext } from '../../contexts/WebSocketContext';
import SquareButton from '../../uiUnits/buttons/SquareButton';
import InputBox from '../../uiUnits/InputBox';

const GetGameRoom: FunctionComponent = () => {
  const { enterRoom, createRoom } = useWebSocketContext();
  const { setRoomState } = useRoomState();

  const handleEnterARoom = useCallback(
    (value: string) => {
      enterRoom(value);
      setRoomState && setRoomState(RoomState.Loading);
    },
    [enterRoom, setRoomState],
  );

  const handleCreateNewRoom = useCallback(() => {
    createRoom();
    setRoomState && setRoomState(RoomState.Loading);
  }, [createRoom, setRoomState]);

  return (
    <div>
      <InputBox label={'Enter A Room You Want to Join'} onSubmit={handleEnterARoom} />
      <h4>or</h4>
      <div>
        <SquareButton onClick={handleCreateNewRoom} label="Create a New Room" />
      </div>
    </div>
  );
};

export default GetGameRoom;
