import React, { FunctionComponent, useCallback, useState } from 'react';
import { Content, SettingType } from '.';
import CircleButton from '../../uiUnits/buttons/CircleButton';
import Dropdown from '../../uiUnits/dropdowns/Dropdown';

interface IEditCardSet {
  update: (props: SettingType) => void;
  remove: () => void;
  cardSetAdded: boolean;
  updateLayoutRules: (props: SettingType) => void;
}

const EditCardSet: FunctionComponent<IEditCardSet> = ({
  update,
  remove,
  cardSetAdded,
  updateLayoutRules,
}: IEditCardSet) => {
  const [faceUpOption, setFaceUpOption] = useState<string>(Content.Word);
  const [faceDownOption, setFaceDownOption] = useState<string>(Content.Translation);
  const [isRandomized, setIsRandomized] = useState<boolean>(false);

  const style = {
    container: {
      display: 'flex',
      flexDirection: 'row' as const,
      justifyContent: 'flex-start',
      width: '300px',
      margin: '5px',
    },
  };

  const handleAdd = useCallback(() => {
    updateLayoutRules({
      faceDownOption: faceDownOption as Content,
      faceUpOption: faceUpOption as Content,
      isRandomized,
    });
    update({
      faceUpOption: faceUpOption as Content,
      faceDownOption: faceDownOption as Content,
      isRandomized,
    });
  }, [update, faceUpOption, faceDownOption, isRandomized, updateLayoutRules]);

  return (
    <div style={style.container}>
      <div>
        {cardSetAdded ? <CircleButton label="➖" onClick={remove} /> : <CircleButton label="➕" onClick={handleAdd} />}
      </div>
      <div style={{ marginLeft: '10px', textAlign: 'left' }}>
        <p style={{ marginTop: '8px' }}>{cardSetAdded ? 'Remove this set of cards' : 'Add a new set of cards'}</p>
        <Dropdown
          label="Face up"
          options={Object.values(Content)}
          value={faceUpOption}
          setValue={value => {
            setFaceUpOption(value);
            cardSetAdded &&
              updateLayoutRules({
                faceDownOption: faceDownOption as Content,
                faceUpOption: value as Content,
                isRandomized,
              });
            cardSetAdded &&
              update({
                faceUpOption: value as Content,
                faceDownOption: faceDownOption as Content,
                isRandomized,
              });
          }}
        />
        <Dropdown
          label="Face down"
          options={Object.values(Content)}
          value={faceDownOption}
          setValue={value => {
            setFaceDownOption(value);
            cardSetAdded &&
              updateLayoutRules({
                faceDownOption: value as Content,
                faceUpOption: faceUpOption as Content,
                isRandomized,
              });
            cardSetAdded &&
              update({
                faceUpOption: faceUpOption as Content,
                faceDownOption: value as Content,
                isRandomized,
              });
          }}
        />
        <Dropdown
          label="Randomize this set of cards"
          options={['yes', 'no']}
          value={isRandomized ? 'yes' : 'no'}
          setValue={value => {
            const newValue = value === 'yes' ? true : false;
            setIsRandomized(newValue);
            cardSetAdded &&
              updateLayoutRules({
                faceDownOption: faceDownOption as Content,
                faceUpOption: faceUpOption as Content,
                isRandomized: newValue,
              });
            cardSetAdded &&
              update({
                faceUpOption: faceUpOption as Content,
                faceDownOption: faceDownOption as Content,
                isRandomized: newValue,
              });
          }}
        />
      </div>
    </div>
  );
};

export default EditCardSet;
