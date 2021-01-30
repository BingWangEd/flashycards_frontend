import React, { FunctionComponent, useState } from 'react';
import { Content } from '.';
import CircleButton from '../../uiUnits/buttons/CircleButton';
import Dropdown from '../../uiUnits/dropdowns/Dropdown';

const AddCardSet: FunctionComponent = () => {
  const [faceUpOption, setFaceUpOption] = useState<string>(Content.Word);
  const [faceDownOption, setFaceDownOption] = useState<string>(Content.Translation);
  const style = {
    container: {
      display: 'flex',
      flexDirection: 'row' as const,
      justifyContent: 'flex-start',
    }
  }
  
  return (
    <div style={style.container}>
      <div>
        <CircleButton
          label='➕'
          onClick={() => {}}
        />
      </div>
      <div style={{marginLeft: '10px', textAlign: 'left'}}>
        <p style={{marginTop: '8px'}}>Add a new set of cards</p>
        <Dropdown
          label='Face up'
          options={Object.values(Content)}
          value={faceUpOption}
          setValue={setFaceUpOption}
        />
        <Dropdown
          label='Face down'
          options={Object.values(Content)}
          value={faceDownOption}
          setValue={setFaceDownOption}
        />
      </div>
    </div>
  );
};

export default AddCardSet;
