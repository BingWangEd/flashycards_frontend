import React, { useState, useCallback, FunctionComponent } from 'react';

export enum TextareaVariant {
  Small,
  Big,
}

interface IProps {
  label: string;
  onSubmit?: (value: string) => void;
  onChange?: (value: string) => void;
  variant?: TextareaVariant;
  pattern?: string;
  title?: string;
}

const Textarea: FunctionComponent<IProps> = ({ label, onSubmit, onChange, variant, ...props }: IProps) => {
  const [value, setValue] = useState<string>('');
  const styleByVariant =
    variant === TextareaVariant.Big
      ? {
          width: '500px',
          height: '500px',
        }
      : {
          width: '100%',
          height: '200px',
        };
  const style = {
    inputEffect: {
      border: 0,
      borderTop: '1px solid #ccc',
      borderLeft: '1px solid #ccc',
      overflow: 'scroll',
      padding: '7px',
      boxSizing: 'border-box' as const,
      ...styleByVariant,
    },
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
      <textarea
        style={style.inputEffect}
        placeholder={label}
        onKeyDown={handleEnter}
        onChange={handleChange}
        {...props}
      />
    </div>
  );
};

export default Textarea;
