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
        height: calc((100vh - 109px) * 0.95);
        width: calc((100vh - 109px) * 0.95);
        position: relative;
        margin-right: 200px;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
      `;
  }
};

export const Container = styled.div`
  position: absolute;
  padding-top: 109px;
  display: flex;
  flex-direction: row;
  align-items: center;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
`;

export const Board = styled.div`
  ${({ full, isMobile }) => setDimensions(full, isMobile)}
`;

export const Canvas = styled.canvas`
  background-color: white;
  width: 100%;
  height: 100%;
`;
