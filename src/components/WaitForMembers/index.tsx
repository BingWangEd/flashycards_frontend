import React from 'react';
import { useGameState } from '../../contexts/GameStateContext';

const WaitForMembers = () => {
  // get all memebers
  const { allMembers, roomCode } = useGameState();

  return (
    <div>
      <h3>Room you are in {roomCode}</h3>
      You are joining following members in this game!
      {
        allMembers && allMembers.map((member: string) => <h4>{member}</h4>)
      }
    </div>
  )
}

export default WaitForMembers;
