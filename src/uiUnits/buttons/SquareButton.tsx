import React, { FunctionComponent } from 'react';
import BaseButton, { IProps as IButtonProps } from './BaseButton'

const SquareButton: FunctionComponent<IButtonProps & { color?: string}> = (props: IButtonProps) => {
  const style = {
    button: {
      height: '4em',
      width: '100%',
      padding: '1.5em auto',
      margin: '1em auto',
      backgroundColor: props.color ? props.color: 'white',
      border: '1px solid #ccc',
    },
  };

  return (
    <BaseButton
      style={style.button}
      {...props}
    />
  );
};

export default SquareButton;
