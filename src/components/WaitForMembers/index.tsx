import React, { FunctionComponent, useCallback, useState } from 'react';
import { useRoomState, PlayerRole } from '../../contexts/RoomStateContext';
import { useWebSocketContext } from '../../contexts/WebSocketContext';
import Button from '../../uiUnits/Button';
import Textarea from '../../uiUnits/Textarea';
import { parseGameWords } from '../../utils/utils';

const WaitForMembers: FunctionComponent = () => {
  // get all memebers
  const { allMembers, roomCode, playerName, playerRole } = useRoomState();
  const { setWords: setGameWords } = useWebSocketContext();
  const [words, setWords] = useState<string>();

  const handleSubmitWordsStartGame = useCallback(() => {
    const regexPattern = /^(([^#\n]*#[^#\n]*)\n){7,}([^#\n]*#[^#\n]*)$/g;
    if (!words || !regexPattern.test(words)) {
      alert('Submitted text does not follow format');
      return;
    }

    const parsedWords = parseGameWords(words);
    setGameWords(parsedWords);
  }, [words, setGameWords]);

  const handleInputChange = useCallback(
    (value: string) => {
      setWords(value);
    },
    [setWords],
  );

  let wordsInput;
  if (playerRole === PlayerRole.Teacher) {
    wordsInput = (
      <div>
        <Textarea
          label={"Enter the words you'd like to practice"}
          onChange={handleInputChange}
          pattern="/^([^-\n]*-[^-\n]*)\n{7,}([^-\n]*-[^-\n]*)$/"
          title="To submit words for practice you need to follow the format"
        />
        <Button label={'Submit the Words and Start Game'} onClick={handleSubmitWordsStartGame} type="submit" />
      </div>
    );
  }

  return (
    <div>
      <h3>You are in Room {roomCode}</h3>
      You are joining following members in this game!
      {allMembers &&
        allMembers
          .filter((member: string) => member !== playerName)
          .map((member: string, index: number) => {
            return <h4 key={index}>{member}</h4>;
          })}
      {wordsInput}
    </div>
  );
};

export default WaitForMembers;
