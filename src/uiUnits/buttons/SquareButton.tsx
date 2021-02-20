import React, { FunctionComponent } from 'react';
import BaseButton, { IProps as IButtonProps } from './BaseButton';

const SquareButton: FunctionComponent<IButtonProps & { color?: string; backgroundColor?: string }> = (
  props: IButtonProps & { color?: string; backgroundColor?: string },
) => {
  const style = {
    button: {
      height: '4em',
      width: '100%',
      padding: '1.5em auto',
      margin: '1em auto',
      backgroundColor: props.backgroundColor ? props.backgroundColor : 'white',
      color: props.color ? props.color : 'black',
      border: '1px solid #ccc',
    },
  };

  return <BaseButton style={style.button} {...props} />;
};

export default SquareButton;
