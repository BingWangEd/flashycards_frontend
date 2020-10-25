import React from 'react';

interface IProps {
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const Button = ({ label, onClick }: IProps) => {
  const style = {
    button: {
      height: '4em',
      width: '10%',
      padding: '1.5em auto',
      margin: '1em auto',
      backgroundColor: 'white',
      border: '1px solid #ccc',
    },
  };

  return (
    <button onClick={onClick} style={style.button}>
      {label}
    </button>
  );
};

export default Button;
