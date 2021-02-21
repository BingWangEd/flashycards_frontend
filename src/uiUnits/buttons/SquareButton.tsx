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
      padding: '1.5em auto',
      margin: '1em auto',
      backgroundColor: backgroundColor ? backgroundColor : 'white',
      color: color ? color : 'black',
      border: '1px solid #ccc',
    },
  };

  return <BaseButton style={style.button} {...props} />;
};

export default SquareButton;
