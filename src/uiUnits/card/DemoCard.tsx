import React, { FunctionComponent, memo } from 'react';
import BaseCard, { IProps as IBaseCardProps } from './BaseCard';

export enum CardColor {
  Red = 'red',
  Green = 'green',
  Blue = 'blue',
  Yellow = 'yellow',
}

interface IDemoCard extends Pick<IBaseCardProps, 'id' | 'isFaceUp' | 'isActive' | 'flipCard' | 'getRef'> {
  color: CardColor,
}

const DemoCard: FunctionComponent<IDemoCard> = memo<IDemoCard>(({ color, ...props}) => {
  return (
    <BaseCard
      faceUp={WordSide(color)}
      faceDown={ColorSide(color)}
      cardStyle = {{
        width: '75px',
        height: '100px',
      }}
      {...props}
    />
  )
})

const WordSide = (color: CardColor) => {
  return (
    <p style={{
      fontSize: '1.2em',
    }}>{color}</p>
  )
}

const ColorSide = (color: CardColor) => {
  return (
    <div style={{
      height: '50px',
      width: '50px',
      backgroundColor: color,
    }}></div>
  )
}

export default DemoCard;