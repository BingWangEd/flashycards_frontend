import React, { useCallback } from 'react';
import Button from '../../UIUnits/Button';
import { useWebSocketContext } from '../../contexts/WebSocketContext';

const CreateRoom = () => {
  const { handleCreateRoom } = useWebSocketContext();
  
  const handleClick = useCallback(() => {
    handleCreateRoom();
  }, [handleCreateRoom]);

  return (
    <div>
      <Button
        onClick={handleClick}
        label='Create a New Room'
      />
    </div>
  )
}

export default CreateRoom;
