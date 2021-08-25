import React, { useEffect, useState } from 'react';

const PriceInput = ({ decimals = 0, onChange, ...rest }) => {
  const [price, setPrice] = useState('');

  useEffect(() => {
    onChange(price);
  }, [price]);

  useEffect(() => {
    setPrice(checkDecimals(price));
  }, [decimals]);

  const handleKeyDown = e => {
    const key = e.keyCode;
    if (key >= '0'.charCodeAt(0) && key <= '9'.charCodeAt(0)) {
      return;
    } else if (key === 190) {
      if (price.includes('.') || decimals === 0) e.preventDefault();
    } else if (key !== 8) {
      e.preventDefault();
    }
  };

  const checkDecimals = val => {
    if (val.indexOf('.') > -1 && val.length - val.indexOf('.') - 1 > decimals) {
      const ret = Math.floor(+val * 10 ** decimals) / 10 ** decimals;
      return ret.toString();
    }
    return val;
  };

  const handleChange = e => {
    setPrice(checkDecimals(e.target.value));
  };

  return (
    <input
      value={price}
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      {...rest}
    />
  );
};

export default PriceInput;
