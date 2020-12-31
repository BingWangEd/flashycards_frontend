import React, { FunctionComponent, useCallback, useState } from 'react';

class FakeObj {
  public numberArray: number[];
  public numberValue: number;

  constructor(numberArray: number[], numberValue: number) {
    this.numberArray = numberArray;
    this.numberValue = numberValue;
  }

  public change = () => {
    // this.numberArray[0] = 100;
    this.numberArray = [100, 100];
    console.log('this.numberArray: ', this.numberArray);
  };
}

const NumberValue: FunctionComponent<{ value: number }> = ({ value }: { value: number }) => {
  return (
    <div>
      <h2>{value}</h2>
    </div>
  );
};

export const Container: FunctionComponent = () => {
  const [newObj] = useState(new FakeObj([0, 1], 1));

  const onClick = useCallback(() => {
    newObj.change();
  }, [newObj]);

  return (
    <div>
      {newObj.numberArray.map((value, index) => {
        return <NumberValue key={index} value={value} />;
      })}
      <button onClick={onClick}>click</button>
    </div>
  );
};
