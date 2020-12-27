import React from "react";

interface IProps {
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
}

const Button = ({ label, onClick, ...props }: IProps) => {
  const style = {
    button: {
      height: '4em',
      width: '20%',
      padding: '1.5em auto',
      margin: '1em auto',
      backgroundColor: 'white',
      border: '1px solid #ccc',
    },
  };

  return (
    <button
      onClick={onClick}
      style={style.button}
      {...props}
    >
      {label}
    </button>
  );
};

export default Button;
