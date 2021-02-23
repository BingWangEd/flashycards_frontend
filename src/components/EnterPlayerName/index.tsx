import React, { FunctionComponent, useCallback } from 'react';
import { RoomState, useRoomState } from '../../contexts/RoomStateContext';
import { useWebSocketContext } from '../../contexts/WebSocketContext';
import CaseDictatableInputBox from '../../uiUnits/inputBox/CaseDictatableInputBox';

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
      <CaseDictatableInputBox label={'Enter Your Name'} onSubmit={handleSubmit} />
    </div>
  );
};

export default EnterPlayerName;
