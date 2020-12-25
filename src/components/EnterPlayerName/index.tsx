import React, { useCallback } from 'react';
import InputBox from '../../UIUnits/InputBox';
import { useWebSocketContext } from '../../contexts/WebSocketContext';

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