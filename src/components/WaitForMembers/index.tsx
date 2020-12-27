import React, { useCallback, useState } from 'react';
import { useGameState, PlayerRole } from '../../contexts/GameStateContext';
import Button from '../../uiUnits/Button';
import Textarea from '../../uiUnits/Textarea';
import { parseGameWords } from '../../utils/utils';

const WaitForMembers = () => {
  // get all memebers
  const { allMembers, roomCode, name, playerRole } = useGameState();
  const [words, setWords] = useState<string>();

  const handleSubmitWordsStartGame = useCallback(() => {
    const regexPattern = /^(([^#\n]*#[^#\n]*)\n){7,}([^#\n]*#[^#\n]*)$/g;
    if (!words || !regexPattern.test(words)) {
      alert('Submitted text does not follow format');
      return;
    }
    
    const parsedWords = parseGameWords(words);

    console.log(parsedWords);
  }, [words]);

  const handleInputChange = useCallback((value: string) => {
    setWords(value);
  }, [setWords]);

  let wordsInput; 
  if (playerRole === PlayerRole.Teacher) {
    wordsInput = (
      <div>
        <Textarea
          label={'Enter the words you\'d like to practice'}
          onChange={handleInputChange}
          pattern='/^([^-\n]*-[^-\n]*)\n{1,}([^-\n]*-[^-\n]*)$/'
          title='To submit words for practice you need to follow the format'
        />
        <Button
          label={'Submit the Words and Start Game'}
          onClick={handleSubmitWordsStartGame}
          type='submit'
        />
      </div>
    )
  }
  return (
    <div>
      <h3>You are in Room {roomCode}</h3>
      You are joining following members in this game!
      {
        allMembers && allMembers.map((member: string) => {
          if (member !== name)
        return (<h4>{member}</h4>)
      })}
      {wordsInput}
    </div>
  )
}

export default WaitForMembers;
