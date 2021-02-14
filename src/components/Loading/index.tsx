import React, { FunctionComponent } from 'react';
import styled, { keyframes } from 'styled-components';

const AnimatedLoadingComponent = styled.div`
  animation: ${keyframes({
      '0%': { width: '0%' },
      '100%': { width: '100%' },
    })}
    1.5s infinite;
`;

const Loading: FunctionComponent = () => {
  const style = {
    word: {
      color: '#818181',
      letterSpacing: '8px',
    },
    loadingBar: {
      display: 'flex',
      height: '30px',
      width: '450px',
      boxShadow: 'inset 0px 0px 0px 1px #C8C8CD',
      borderRadius: '15px',
      overflow: 'hidden',
    },
    progressBar: {
      display: 'flex',
      height: '100%',
      width: '100%',
      background: '#ccc',
    },
  };

  return (
    <div>
      <h1 style={style.word}>LOADING</h1>
      <div style={style.loadingBar}>
        <AnimatedLoadingComponent>
          <span style={style.progressBar} />
        </AnimatedLoadingComponent>
      </div>
    </div>
  );
};

export default Loading;
