import styled from '@emotion/styled';
import { css } from '@emotion/core';

export const Container = styled.div`
  position: absolute;
  top: 50%;
  right: -20px;
  border: 1px solid #ededed;
  padding: 20px 14px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: -6px 0px 33px -8px rgba(207, 207, 207, 1);
  background-color: #f7f7f7;
  z-index: 10;
  cursor: pointer;
  transform: translate(100%, -50%);
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
  width: calc(100% - 16px);
  border-radius: 6px;
  background-color: #007bff;

  ${({ size }) => css`
    height: ${size}px;
  `}
`;
