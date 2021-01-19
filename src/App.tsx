import React, { FunctionComponent } from 'react';
import { WebSocketProvider } from './contexts/WebSocketContext';
import { RoomStateContextProvider } from './contexts/RoomStateContext';
import { GameContextProvider } from './contexts/GameContext';
import GameCoordinator from './components/GameCoordinator';
import './App.css';

const App: FunctionComponent = () => {
  return (
    <RoomStateContextProvider>
      <GameContextProvider>
        <WebSocketProvider>
          <div className="App">
            <GameCoordinator />
          </div>
        </WebSocketProvider>
      </GameContextProvider>
    </RoomStateContextProvider>
  );
};

export default App;
