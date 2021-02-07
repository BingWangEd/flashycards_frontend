import React, { FunctionComponent, useCallback, useState } from 'react';
import { Content } from '.';
import CircleButton from '../../uiUnits/buttons/CircleButton';
import Dropdown from '../../uiUnits/dropdowns/Dropdown';

interface IAddCardSet {
  add: (faceUpOption: Content, faceDownOption: Content, isRandomized: string) => void;
}

const AddCardSet: FunctionComponent<IAddCardSet> = ({ add }: IAddCardSet) => {
  const [faceUpOption, setFaceUpOption] = useState<string>(Content.Word);
  const [faceDownOption, setFaceDownOption] = useState<string>(Content.Translation);
  const [isRandomized, setIsRandomized] = useState<string>('no');

  const style = {
    container: {
      display: 'flex',
      flexDirection: 'row' as const,
      justifyContent: 'flex-start',
    },
  };

  const handleSubmit = useCallback(() => {
    add(faceUpOption as Content, faceDownOption as Content, isRandomized);
  }, [add, faceUpOption, faceDownOption, isRandomized]);

  return (
    <div style={style.container}>
      <div>
        <CircleButton label="➕" onClick={handleSubmit} />
      </div>
      <div style={{ marginLeft: '10px', textAlign: 'left' }}>
        <p style={{ marginTop: '8px' }}>Add a new set of cards</p>
        <Dropdown label="Face up" options={Object.values(Content)} value={faceUpOption} setValue={setFaceUpOption} />
        <Dropdown
          label="Face down"
          options={Object.values(Content)}
          value={faceDownOption}
          setValue={setFaceDownOption}
        />
        <Dropdown
          label="Randomize this set of cards"
          options={['yes', 'no']}
          value={isRandomized}
          setValue={setIsRandomized}
        />
      </div>
    </div>
  );
};

export default AddCardSet;
