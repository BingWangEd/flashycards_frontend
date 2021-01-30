import React, { FunctionComponent } from 'react';
import BaseButton, { IProps as IButtonProps } from './BaseButton'

const CircleButton: FunctionComponent<IButtonProps> = (props: IButtonProps) => {
  const style = {
    button: {
      width: '32px',
      height: '32px',
      font: '1.5em',
      backgroundColor: 'white',
      border: '1px solid #ccc',
      borderRadius: '50%',
    },
  };

  return (
    <BaseButton
      style={style.button}
      {...props}
    />
  );
};

export default CircleButton;