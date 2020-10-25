import React, { useRef, useState, useCallback } from 'react';

interface IProps {
  label: string;
  onSubmit: (value: string) => void;
}

const InputBox = ({ label, onSubmit }: IProps) => {
  const focused = useRef(false);
  const [value, setValue] = useState<string>('');
  const style = {
    inputEffect: {
      border: 0,
      padding: '7px',
      borderBottom: '1px solid #ccc',
      width: '300px',
      height: '20px',
    },
    border: focused.current
      ? {
          width: '100%',
          transition: '0.4s',
          left: 0,
        }
      : {
          position: 'absolute' as const,
          bottom: 0,
          left: '50%',
          width: 0,
          height: '2px',
          backgroundColor: '#3399FF',
          transition: '0.4s',
        },
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleEnter = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.keyCode === 13) {
        onSubmit(value);
      }
    },
    [onSubmit, value],
  );

  return (
    <div>
      <input
        style={style.inputEffect}
        type="text"
        placeholder={label}
        onFocus={() => focused.current === true}
        onBlur={() => focused.current === false}
        onKeyDown={handleEnter}
        onChange={handleChange}
      />
      <span style={style.border}></span>
    </div>
  );
};

export default InputBox;
