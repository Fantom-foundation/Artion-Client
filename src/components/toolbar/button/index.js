import React, { useEffect } from 'react';
import mousetrap from 'mousetrap';

import { Wrapper, Container, ActionPanel } from './style';

const preventDefault = event => {
  event.preventDefault();
  event.stopPropagation();
};

const Button = ({ id, icon, onClick, isOpen, children, keys }) => {
  useEffect(() => {
    if (keys) {
      mousetrap.bind(keys, onClick);
      return () => mousetrap.unbind(keys, onClick);
    }
  }, [keys, onClick]);

  return (
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
  );
};

export default Button;
