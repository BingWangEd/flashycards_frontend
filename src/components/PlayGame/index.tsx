import React, { FunctionComponent } from 'react';
import DisplayGameInfo from './DisplayGameInfo';
import LayCards from './LayCards';

const PlayGame: FunctionComponent = () => {
  return (
    <div>
      <DisplayGameInfo />
      <LayCards />
    </div>
  );
};

export default PlayGame;
