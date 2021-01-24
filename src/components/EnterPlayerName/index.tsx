import React, { FunctionComponent, useCallback } from 'react';
import { RoomState, useRoomState } from '../../contexts/RoomStateContext';
import { useWebSocketContext } from '../../contexts/WebSocketContext';
import InputBox from '../../uiUnits/InputBox';

const EnterPlayerName: FunctionComponent = () => {
  const { submitName } = useWebSocketContext();
  const { setRoomState } = useRoomState();

  const handleSubmit = useCallback(
    (value: string) => {
      submitName(value);
      setRoomState && setRoomState(RoomState.Loading);
    },
    [submitName, setRoomState],
  );

  return (
    <div>
      <InputBox label={'Enter Your Name'} onSubmit={handleSubmit} />
    </div>
  );
};

export default EnterPlayerName;
