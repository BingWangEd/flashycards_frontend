import React from 'react';
import { WebSocketProvider } from './contexts/WebSocketContext';
import { GameStateContextProvider } from './contexts/GameStateContext';
import GameCoordinator from './components/GameCoordinator';
import './App.css';

function App() {
  return (
    <GameStateContextProvider>
      <WebSocketProvider>
        <div className="App">
          <GameCoordinator />
        </div>
      </WebSocketProvider>
    </GameStateContextProvider>
  );
}

export default App;
