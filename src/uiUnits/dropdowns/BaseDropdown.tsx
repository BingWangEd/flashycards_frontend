import React, { FunctionComponent } from 'react';

export interface IProps<T extends  React.SelectHTMLAttributes<HTMLSelectElement>['value']> {
  label?: string;
  labelStyle?: React.CSSProperties;
  options: T[];
  optionStyle?: React.CSSProperties;
  value: T;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

const BaseDropdown = <T extends  React.SelectHTMLAttributes<HTMLSelectElement>['value']>({ label, labelStyle, options, optionStyle, value, setValue }: IProps<T>) => {
  return (
    <div>
      {label && <p style={labelStyle}>{label}</p>}
      <select value={value} style={optionStyle} onChange={(event) => setValue(event.target.value)}>{
        options.map((option: T) => <option value={option}>{option}</option>)
      }</select>
    </div>
  );
};

export default BaseDropdown;