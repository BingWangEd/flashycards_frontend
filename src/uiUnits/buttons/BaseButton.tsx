import React, { ButtonHTMLAttributes, FunctionComponent } from 'react';

export interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const BaseButton: FunctionComponent<IProps> = ({ label, onClick, style, ...rest }: IProps) => {
  return (
    <button onClick={onClick} style={style} {...rest}>
      {label}
    </button>
  );
};

export default BaseButton;
