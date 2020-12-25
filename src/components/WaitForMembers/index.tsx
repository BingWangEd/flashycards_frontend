import React from 'react';
import { useGameState } from '../../contexts/GameStateContext';

const WaitForMembers = () => {
  // get all memebers
  const { allMembers, roomCode, name } = useGameState();
  return (
    <div>
      <h3>You are in Room {roomCode}</h3>
      You are joining following members in this game!
      {
        allMembers && allMembers.map((member: string) => {
          if (member !== name)
        return (<h4>{member}</h4>)
      })}
    </div>
  )
}

export default WaitForMembers;
