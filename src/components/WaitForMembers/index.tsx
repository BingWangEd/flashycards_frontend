import React, { FunctionComponent, useCallback, useMemo, useState } from 'react';
import { useRoomState, PlayerRole, RoomState } from '../../contexts/RoomStateContext';
import { useWebSocketContext } from '../../contexts/WebSocketContext';
import SquareButton from '../../uiUnits/buttons/SquareButton';
import Textarea from '../../uiUnits/Textarea';
import { parseGameWords } from '../../utils/utils';

const sampleData =
  '成绩#grade\n表彰#praise, award\n成長#growth\n謙虚#humble\n副作用#side effect\n尊敬#respect\n資金#funding\n事故#accident';

const WaitForMembers: FunctionComponent = () => {
  // get all memebers
  const { allMembers, roomCode, playerName, playerRole, setRoomState } = useRoomState();
  const { setWords: setGameWords } = useWebSocketContext();
  const [words, setWords] = useState<string>('');
  const [ruleStates, setRuleStates] = useState([false, false, false]);

  const style = {
    text: {
      fontSize: '1.2em',
      fontWeight: 150,
    },
    members: {
      display: 'flex',
      alignItems: 'flext-start',
      flexDirection: 'column' as const,
    },
    inputWords: {
      marginTop: '50px',
    },
    ruleWrapper: {
      textAlign: 'left' as const,
    },
  };
  const rules: [string, RegExp][] = useMemo(
    () => [
      [
        'Have at least 8 lines. Each line is a word and its translation',
        // There needs to be at least 8 lines
        /^((.*\n){7,})(.*)$/g,
      ],
      [
        'The word and its translation are separated by one #️⃣',
        // Each line needs to have one and only one '#'
        /^((([^#\n]{1,})#([^#\n]{1,})\n)*)(([^#\n]{1,})#([^#\n]{1,}))$/g,
      ],
      [
        'Put the word itself first and then its translation. Eg. bonjour#hello',
        // There needs to be something before and after the '#'
        /^((([^#\n]{1,})#([^#\n]{1,})\n)*)(([^#\n]{1,})#([^#\n]{1,}))$/g,
      ],
    ],
    [],
  );

  const handleSubmitWordsStartGame = useCallback(() => {
    const regexPattern = /^(([^#\n]*#[^#\n]*)\n){7,}([^#\n]*#[^#\n]*)$/g;
    // remove the last newline
    if (!words || !regexPattern.test(words.replace(/[\r|\n|\r\n]$/, ''))) {
      alert('Submitted text does not follow format');
      return;
    }

    // remove the last newline
    const parsedWords = parseGameWords(words.replace(/[\r|\n|\r\n]$/, ''));
    setGameWords(parsedWords);

    setRoomState && setRoomState(RoomState.Loading);
  }, [words, setGameWords, setRoomState]);

  const handleInputChange = useCallback(
    (value: string) => {
      setWords(value);

      const currentRuleStates: boolean[] = [false, false, false];
      rules.forEach(([rule, regexPattern], index) => {
        // remove the last newline
        const convertedValue = value.replace(/[\r|\n|\r\n]$/, '');
        console.log('convertedValue: ', convertedValue);
        const isMatched = regexPattern.test(convertedValue);
        currentRuleStates[index] = isMatched;
      });

      setRuleStates(currentRuleStates);
    },
    [setWords, setRuleStates, rules],
  );

  let wordsInput;
  if (playerRole === PlayerRole.Teacher) {
    wordsInput = (
      <div style={style.inputWords}>
        <h2>You created the room</h2>
        <h2>Please enter words you&apos;d like to play with</h2>
        <div style={style.ruleWrapper}>
          {rules.map(([rule, regexPattern], index) => {
            return <p key={index} style={style.text}>{`${ruleStates[index] ? '✔︎' : '✗'} ${rule}`}</p>;
          })}
        </div>
        <Textarea
          label={
            "Enter the words you'd like to practice\nThey need to follow the rules above\n\nFor example:\nbon voyage#have a good trip\nbonjour#hello\n..."
          }
          value={words}
          onChange={handleInputChange}
          pattern="/^([^-\n]*-[^-\n]*)\n{7,}([^-\n]*-[^-\n]*)$/"
          title="To submit words for practice you need to follow the format"
        />
        <SquareButton label={'Input Sample Data'} onClick={() => handleInputChange(sampleData)} type="button" />
        <SquareButton
          color={'white'}
          backgroundColor={'red'}
          label={'Submit the Words and Start Game'}
          onClick={handleSubmitWordsStartGame}
          type="submit"
        />
      </div>
    );
  }

  let joinMembers;
  if (allMembers?.size === 1) {
    joinMembers = (
      <div>
        <p style={style.text}>No one is in the room yet ... please wait right here</p>
      </div>
    );
  } else {
    joinMembers = (
      <div style={style.members}>
        <p style={style.text}>You are joining following members in this game 🍻:</p>
        {allMembers &&
          allMembers
            .filter((member: string) => member !== playerName)
            .map((member: string, index: number) => {
              return (
                <p style={{ ...style.text }} key={index}>
                  🃏{member}
                </p>
              );
            })}
      </div>
    );
  }

  return (
    <div style={{ width: '60%' }}>
      <h2>You are in Room 🗝: {roomCode}</h2>
      {joinMembers}
      {wordsInput}
    </div>
  );
};

export default WaitForMembers;
