import React, { FunctionComponent, useCallback, useState } from 'react';
import BaseInputBox, { IInputProps } from './BaseInputBox';

export enum CaseStyle {
  Upper,
  Lower,
  Free,
}

type ICaseDictatableInputBox = Pick<IInputProps, 'label' | 'onChange' | 'pattern' | 'title'> & {
  onSubmit?: (value: string) => void;
  caseStyle?: CaseStyle;
};

const CaseDictatableInputBox: FunctionComponent<ICaseDictatableInputBox> = ({
  onSubmit,
  onChange,
  caseStyle = CaseStyle.Free,
  ...props
}: ICaseDictatableInputBox) => {
  const [value, setValue] = useState<string>('');

  const handleChange = useCallback(
    (value: string) => {
      const convertedValue =
        caseStyle === CaseStyle.Upper
          ? value.toUpperCase()
          : caseStyle === CaseStyle.Lower
          ? value.toLowerCase()
          : value;
      setValue(convertedValue);
      onChange && onChange(convertedValue);
    },
    [setValue, onChange, caseStyle],
  );

  const handleSubmit = useCallback(() => {
    onSubmit && onSubmit(value);
  }, [value, onSubmit]);

  const style = {
    width: '300px',
    border: 0,
    padding: '7px',
    borderBottom: '1px solid #ccc',
    overflow: 'scroll',
    textTransform:
      caseStyle === CaseStyle.Upper
        ? ('uppercase' as const)
        : caseStyle === CaseStyle.Lower
        ? ('lowercase' as const)
        : ('none' as const),
  };
  return <BaseInputBox value={value} onChange={handleChange} onSubmit={handleSubmit} style={style} {...props} />;
};

export default CaseDictatableInputBox;
