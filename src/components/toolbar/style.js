import styled from '@emotion/styled';
import { css } from '@emotion/core';

export const Container = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  margin: 3px 3px 0 0;
  border: 1px solid #ededed;
  padding: 6px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  box-shadow: -6px 0px 33px -8px rgba(207, 207, 207, 1);
  background: white;
  z-index: 10;
  cursor: pointer;
  transform: translate(60px, 30px);
`;

export const Backdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9;
  background-color: grey;
  opacity: 0.1;
`;

export const BrushLine = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-45deg);
  width: 75%;
  border-radius: 6px;
  background-color: #007bff;

  ${({ size }) => css`
    height: ${size}px;
  `}
`;
