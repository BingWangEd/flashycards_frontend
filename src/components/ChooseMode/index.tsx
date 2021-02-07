import React, { FunctionComponent, useCallback } from 'react';
import { Mode, RoomState, useRoomState } from '../../contexts/RoomStateContext';

const ChooseMode: FunctionComponent = () => {
  const { setMode, setRoomState } = useRoomState();

  const style = {
    modeContainer: {
      display: 'flex',
      flexDirection: 'row' as const,
      justifyContent: 'space-between',
    },
    modeBox: {
      width: '40%',
      maxWidth: '300px',
      minWidth: '150px',
      borderRadius: '15px',
      margin: '15px',
      border: '2px solid #ccc',
      paddingLeft: '50px',
      paddingRight: '50px',
      paddingBottom: '15px',
      cursor: 'pointer',
    },
    container: {
      width: '65%',
      maxWidth: '800px',
    },
    textContainer: {
      fontSize: '1.2em',
      fontWeight: 150,
      textAlign: 'left' as const,
    },
    symble: {
      fontSize: '4em',
    },
  };

  const handleChooseMode = useCallback(
    (mode: Mode) => {
      setMode(mode);
      setRoomState(RoomState.GetGameRoom);
    },
    [setMode, setRoomState],
  );

  return (
    <div style={style.container}>
      <h2>
        Let&apos;s play and learn with flash cards
        <br />
        Choose a mode to start
      </h2>
      <div style={style.modeContainer}>
        <div
          style={style.modeBox}
          onClick={e => {
            e.preventDefault();
            handleChooseMode(Mode.Free);
          }}
        >
          <h2 style={style.symble}>🃏</h2>
          <h2>Free Mode</h2>
          <div style={style.textContainer}>
            <p>Lay out flashcards the way you want</p>
            <p>Live interact with cards: Flip, move and play with all participants</p>
          </div>
        </div>
        <div
          style={style.modeBox}
          onClick={e => {
            e.preventDefault();
            handleChooseMode(Mode.Game);
          }}
        >
          <h2 style={style.symble}>🎲</h2>
          <h2>Game Mode</h2>
          <div style={style.textContainer}>
            <p>Learn from playing a card-matching game</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseMode;
