import React, { FunctionComponent } from 'react';
import BaseButton, { IProps as IButtonProps } from './BaseButton';

const SquareButton: FunctionComponent<IButtonProps & { color?: string; backgroundColor?: string }> = ({
  color,
  backgroundColor,
  ...props
}: IButtonProps & { color?: string; backgroundColor?: string }) => {
  const style = {
    button: {
      height: '4em',
      width: '100%',
      maxWidth: '400px',
      padding: '1.5em auto',
      margin: '1em 0.5em 0 0.5em',
      backgroundColor: backgroundColor ? backgroundColor : 'white',
      color: color ? color : 'black',
      border: '1px solid #ccc',
    },
  };

  return <BaseButton style={style.button} {...props} />;
};

export default SquareButton;
