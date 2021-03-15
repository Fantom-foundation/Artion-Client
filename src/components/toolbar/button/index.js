import React, { useEffect } from 'react';
import mousetrap from 'mousetrap';

import Tooltip from '@material-ui/core/Tooltip';

import { Wrapper, Container, ActionPanel } from './style';

const preventDefault = event => {
  event.preventDefault();
  event.stopPropagation();
};

const Button = ({ id, icon, onClick, isOpen, children, keys, tip }) => {
  useEffect(() => {
    if (keys) {
      mousetrap.bind(keys, onClick);
      return () => mousetrap.unbind(keys, onClick);
    }
  }, [keys, onClick]);

  return (
    <Tooltip title={tip}>
      <Wrapper isActive={isOpen}>
        <Container id={id} onClick={onClick} isActive={isOpen}>
          {icon && icon}
        </Container>
        {children && (
          <ActionPanel onClick={preventDefault} isOpen={isOpen}>
            {children}
          </ActionPanel>
        )}
      </Wrapper>
    </Tooltip>
  );
};

export default Button;
