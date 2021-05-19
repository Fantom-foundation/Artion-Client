import React, { useEffect, useRef } from 'react';
import Jazzicon from 'jazzicon';

const Identicon = ({ account, size, ...rest }) => {
  const ref = useRef();

  useEffect(() => {
    if (account && ref.current) {
      ref.current.innerHTML = '';
      ref.current.appendChild(
        Jazzicon(size || 16, parseInt(account.slice(2, 10), 16))
      );
    }
  }, [account]);

  return <div ref={ref} {...rest} />;
};

export default Identicon;
