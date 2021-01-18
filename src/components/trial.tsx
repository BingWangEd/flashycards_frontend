import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { List } from 'immutable';
import { ActionType, CardSide, useGame } from '../contexts/GameContext';
import Card from './PlayGame/Card';

const TestComp: FunctionComponent = () => {
  //const [list, setList] = useState(List([0, 1]));
  const { startGame, cardWords, cardStates, implementCardActions, setWaitingForResponse } = useGame();
  useState(() => {
    console.log('TestComp first renders');
  });
  useEffect(() => {
    console.log(`TestComp mounted`);
    return () => console.log(`TestComp unmounted`);
  });

  useEffect(() => {
    startGame(
      List([
        {
          word: 'apple',
          side: CardSide.Word,
          counterpart: 'リンゴ',
        },
        {
          word: 'リンゴ',
          side: CardSide.Translation,
          counterpart: 'apple',
        },
        {
          word: 'pear',
          side: CardSide.Word,
          counterpart: '桃',
        },
        {
          word: '桃',
          side: CardSide.Translation,
          counterpart: 'pear',
        },
      ]),
      List([
        {
          isActive: true,
          isOpen: false,
        },
        {
          isActive: true,
          isOpen: false,
        },
        {
          isActive: true,
          isOpen: false,
        },
        {
          isActive: true,
          isOpen: false,
        },
      ]),
    );
  }, [startGame]);

  const handleClick = useCallback(() => {
    implementCardActions([
      {
        type: ActionType.Open,
        payload: [0, 1],
        player: 'bee',
      },
    ]);
  }, [implementCardActions]);

  const handleClick2 = useCallback(() => {
    implementCardActions([
      {
        type: ActionType.Close,
        payload: [0, 1],
        player: 'bee',
      },
    ]);
  }, [implementCardActions]);

  return (
    <div>
      <button onClick={handleClick}>change</button>
      <button onClick={handleClick2}>change2</button>
      {cardWords?.map((word, index) => {
        const isActive = cardStates?.get(index)?.isActive || false;

        const locked = false;
        // const locked = !isActive || waitingForResponse || playerName !== currentPlayer;

        return (
          <Card
            key={index}
            word={(word && word.word) || ''}
            isOpen={cardStates?.get(index)?.isOpen || false}
            isActive={isActive}
            position={index}
            sendAction={action => {
              console.log('sendAction');
            }}
            setwaitingForResponse={setWaitingForResponse}
          />
        );
      })}
    </div>
  );
};

const PresentComp: FunctionComponent<{ value: number }> = ({ value }: { value: number }) => {
  useEffect(() => {
    console.log(`value: ${value} mounted`);
    return () => console.log(`value: ${value} unmounted`);
  }, []);

  return <h4>{value}</h4>;
};

export default TestComp;
