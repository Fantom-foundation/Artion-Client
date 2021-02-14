import styled from '@emotion/styled';
import { css } from '@emotion/core';

export const Wrapper = styled.div`
  position: relative;
  z-index: 10;

  ${({ isActive }) =>
    isActive &&
    css`
      &:after {
        content: '';
        display: block;
        width: 0;
        height: 0;
        position: absolute;
        border-top: 8px solid transparent;
        border-bottom: 8px solid transparent;
        border-left: 8px solid white;
        left: -15px;
        top: 12px;
        z-index: 10;
      }
    `}
`;

export const Container = styled.div`
  position: relative;
  width: 30px;
  height: 30px;
  z-index: 10;
  background: white;
  margin: 5px 0;
  border-radius: 3px;
  transition: 150ms transform ease;

  & svg {
    width: 100% !important;
    height: 100% !important;
    padding: 6px;
  }

  ${({ isActive }) =>
    isActive &&
    css`
      transform: scale(1.1);
      background: #f5f5f5;
    `}

  &:hover {
    transform: scale(1.1);
  }
`;

export const ActionPanel = styled.div`
  position: absolute;
  top: 0;
  left: -65px;
  width: 50px;
  max-height: 0;
  overflow: hidden;
  background: white;
  z-index: 10;
  border-radius: 6px;
  opacity: 0;
  box-shadow: -6px 0px 33px -8px rgba(207, 207, 207, 1);
  transition: max-height 250ms ease, opacity 200ms ease;

  ${({ isOpen }) =>
    isOpen &&
    css`
      max-height: 240px;
      overflow-y: scroll;
      opacity: 1;
    `}
`;
