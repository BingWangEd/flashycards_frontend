import React, { useCallback } from 'react';
import { useWebSocketContext } from '../../contexts/WebSocketContext';
import InputBox from '../../uiUnits/InputBox';

const EnterPlayerName = () => {
  const { submitName } = useWebSocketContext();

  const handleSubmit = useCallback((value: string) => {
    submitName(value)
  }, [submitName]);

  return (
    <div>
      <InputBox
        label={'Enter Your Name'}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export default EnterPlayerName;