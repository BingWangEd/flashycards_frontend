import React, { useCallback } from 'react';
import InputBox from '../../UIUnits/InputBox';
import { useWebSocketContext } from '../../contexts/WebSocketContext';

const EnterPlayerName = () => {
  const { handleSubmitName } = useWebSocketContext();

  const handleSubmit = useCallback((value: string) => {
    handleSubmitName(value)
  }, [handleSubmitName]);

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