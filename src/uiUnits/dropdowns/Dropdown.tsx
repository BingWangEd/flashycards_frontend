import React, { FunctionComponent } from 'react';
import BaseDropdown, { IProps as IBaseDropdownProps } from './BaseDropdown';

type IDropdown<T extends  React.SelectHTMLAttributes<HTMLSelectElement>['value'] > = Pick<IBaseDropdownProps<T>, 'label' | 'options' | 'setValue' | 'value'>;

const Dropdown = <T extends  React.SelectHTMLAttributes<HTMLSelectElement>['value'] >(props: IDropdown<T>) => {
  const style = {
    optionStyle: {
      width: '100px',
    },
    labelStyle: {
      width: '100px',
      display: 'inline-block',
      margin: '6px 0',
    }
  }
  return (
    <BaseDropdown optionStyle={style.optionStyle} labelStyle={style.labelStyle} {...props} />
  );
};

export default Dropdown;