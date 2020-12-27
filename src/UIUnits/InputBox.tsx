import React, { useState, useCallback, FunctionComponent } from 'react';

export enum InputBoxVariant {
  Small,
  Big,
}

interface IProps {
  label: string;
  onSubmit?: (value: string) => void;
  onChange?: (value: string) => void;
  variant?: InputBoxVariant;
  pattern?: string;
  title?: string;
}

const InputBox: FunctionComponent<IProps> = ({ label, onSubmit, onChange, variant, ...props }: IProps) => {
  const [value, setValue] = useState<string>('');
  const styleByVariant =
    variant === InputBoxVariant.Big
      ? {
          width: '500px',
        }
      : {
          width: '300px',
        };
  const style = {
    inputEffect: {
      border: 0,
      padding: '7px',
      borderBottom: '1px solid #ccc',
      overflow: 'scroll',
      ...styleByVariant,
    },
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onChange && onChange(e.target.value);
  };

  const handleEnter = useCallback(
    (e: React.KeyboardEvent) => {
      if (onSubmit && e.keyCode === 13) {
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
        onKeyDown={handleEnter}
        onChange={handleChange}
        {...props}
      />
    </div>
  );
};

export default InputBox;
