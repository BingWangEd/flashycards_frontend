import React, { FunctionComponent, useCallback, useState } from 'react';
import { ICard } from '.';
import DemoCard, { CardColor } from '../../uiUnits/card/DemoCard';

type ICardSize = {
  width: number,
  height: number,
}

type ICardPosition = {
  x: number,
  y: number,
}

export enum CardCanvasVariant {
  Wide = 1,
  Medium = 2,
  Narrow = 3,
}

interface IProps {
  wordSets: ICard[][];
  variant?: CardCanvasVariant,
  groupWordsBySet: boolean;
  cardSize: ICardSize;
}

const MARGIN_PX = 15;
const SET_SPACE_PX = 15;

const CardDemoCanvas: FunctionComponent<IProps> = ({
  wordSets,
  variant = CardCanvasVariant.Medium,
  groupWordsBySet,
  cardSize,
}) => {
  const wordNumber = (wordSets[0] && wordSets[0].length) || 0;
  const {width: cardWidth, height: cardHeight} = cardSize;

  // When there's only one set of words, double the word count per row
  const setPerRow: number = wordSets.length === 1 ? variant * 2 : variant;

  let cardSetPositions: ICardPosition[][] = [];
  // There's only one set of cards
  if (wordSets.length === 1) {
    cardSetPositions[0] = (wordSets[0]).map((card, index) => {
      return {
        x: (index%setPerRow)*(cardWidth + MARGIN_PX),
        y: Math.floor(index/setPerRow)*(cardHeight + MARGIN_PX),
      }
    });
  }

  if (wordSets.length === 2) {
    if (groupWordsBySet) {
      wordSets.forEach((wordSet, index) => {
        cardSetPositions[index] = wordSet.map((word, i) => {
          return {
            x: index*(wordSets.length * (cardWidth + MARGIN_PX) + SET_SPACE_PX) + (i%variant)*(cardWidth + MARGIN_PX),
            y: Math.floor(i/(setPerRow))*(cardHeight + MARGIN_PX),
          }
        });
      });
    } else {
      const columnWidth = wordSets.length * (cardWidth + MARGIN_PX) + SET_SPACE_PX;
      wordSets.forEach((wordSet, index) => {
        cardSetPositions[index] = wordSet.map((word, i) => {
          return {
            x: index*(cardWidth + MARGIN_PX) + columnWidth*(i%setPerRow),
            y: Math.floor(i/setPerRow)*(cardHeight + MARGIN_PX),
          }
        });
      });
    }
  }

  console.log('cardSetPositions: ', cardSetPositions);
  
  return (
    <div>
      <h2>{wordSets.length === 0 ? 'Add a word set by clicking the ➕ sign' : 'See Example Below:'}</h2>
      <div style={{
        position: 'relative',
        margin: '50px',
        width: (setPerRow * wordSets.length)*(cardWidth + MARGIN_PX) + (setPerRow - 1)*SET_SPACE_PX,
        height: (wordNumber/setPerRow) * (cardHeight + MARGIN_PX),
      }}>{
        wordSets.map((wordSet, i) => wordSet.map((word, y) => {
          return (
            <div style={{
              position: 'absolute',
              left: `${cardSetPositions[i][y].x}px`,
              top: `${cardSetPositions[i][y].y}px`,
            }}>
              <DemoCard
                id={i*y}
                color={word.content[0] as CardColor}
                demoFaceUp={word.faceUp}
                demoFaceDown={word.faceDown}
              />
            </div>
          )
        }))
      }</div>
    </div>
  );
};

export default CardDemoCanvas;
