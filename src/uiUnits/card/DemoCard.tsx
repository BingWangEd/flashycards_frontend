import React, { FunctionComponent, memo, useCallback, useState } from 'react';
import { Content } from '../../components/SetCardsLayout';
import BaseCard, { IProps as IBaseCardProps } from './BaseCard';

export enum CardColor {
  Red = 'red',
  Green = 'green',
  Blue = 'blue',
  Yellow = 'yellow',
}

interface IDemoCard extends Pick<IBaseCardProps, 'id' | 'isActive' | 'getRef'> {
  color: CardColor;
  demoFaceUp: Content;
  demoFaceDown: Content;
}

const DemoCard: FunctionComponent<IDemoCard> = ({ color, demoFaceUp, demoFaceDown, ...props }: IDemoCard) => {
  const [isFaceUp, setIsFaceUp] = useState(true);
  const getNode = useCallback(
    (type: string) => {
      switch (type) {
        case Content.Word:
          return WordSide(color);
        case Content.Translation:
          return ColorSide(color);
        default:
          return null;
      }
    },
    [color],
  );

  return (
    <BaseCard
      faceUp={getNode(demoFaceUp)}
      faceDown={getNode(demoFaceDown)}
      cardStyle={{
        width: '75px',
        height: '100px',
      }}
      isFaceUp={isFaceUp}
      flipCard={() => setIsFaceUp(prevValue => !prevValue)}
      {...props}
    />
  );
};

const WordSide = (color: CardColor) => {
  return (
    <p
      style={{
        fontSize: '1.2em',
      }}
    >
      {color}
    </p>
  );
};

const ColorSide = (color: CardColor) => {
  return (
    <div
      style={{
        height: '50px',
        width: '50px',
        backgroundColor: color,
      }}
    ></div>
  );
};

export default memo<IDemoCard>(DemoCard);
