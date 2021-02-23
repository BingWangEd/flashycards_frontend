import React, { useCallback, FunctionComponent } from 'react';

export interface IInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'onSubmit'> {
  label: string;
  value: string;
  onSubmit?: () => void;
  onChange?: (value: string) => void;
  pattern?: string;
  title?: string;
  style?: React.CSSProperties;
}

const BaseInputBox: FunctionComponent<IInputProps> = ({ label, value, onSubmit, onChange, ...props }: IInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(e.target.value);
  };

  const handleEnter = useCallback(
    (e: React.KeyboardEvent) => {
      if (onSubmit && e.keyCode === 13) {
        onSubmit();
      }
    },
    [onSubmit],
  );

  return (
    <div>
      <input type="text" placeholder={label} onKeyDown={handleEnter} onChange={handleChange} {...props} />
    </div>
  );
};

export default BaseInputBox;
