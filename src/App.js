import React from 'react';
import { WebSocketProvider } from './contexts/WebSocketContext';
import { RoomStateContextProvider } from './contexts/RoomStateContext';
import GameCoordinator from './components/GameCoordinator';
import './App.css';

function App() {
  return (
    <RoomStateContextProvider>
      <WebSocketProvider>
        <div className="App">
          <GameCoordinator />
        </div>
      </WebSocketProvider>
    </RoomStateContextProvider>
  );
}

export default App;
