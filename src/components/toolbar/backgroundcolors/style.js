import styled from '@emotion/styled';
import { css } from '@emotion/core';

export const Color = styled.div`
  position: relative;
  width: 22px;
  height: 22px;
  margin: 4px;
  border: 1px solid grey;
  border-radius: 10%;
  transition: all 200ms;
  font-size: 17px;
  text-align: center;

  &:hover {
    opacity: 0.5;
  }

  ${({ color }) =>
    color &&
    css`
      background-color: ${color};
    `}

  ${({ active }) =>
    active &&
    css`
      width: 28px;
      height: 28px;
      border-width: 2px;
    `}
`;
