import styled from '@emotion/styled';
import { css } from '@emotion/core';

const setDimensions = (full, isMobile) => {
  switch (true) {
    case isMobile:
      return css`
        height: 86vh;
        width: 100vw;
      `;
    case full:
      return css`
        height: 100vh;
        width: 100vw;
      `;
    default:
      return css`
        height: 100%;
        width: 100%;
      `;
  }
};

export const Container = styled.div`
  position: fixed;
  font-family: sans-serif;

  ${({ full, isMobile }) => setDimensions(full, isMobile)}
`;

export const Canvas = styled.canvas`
  background-color: white;
  width: 100%;
  height: 100%;
`;
