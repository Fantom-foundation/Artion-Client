import React, { useEffect } from 'react';

const PriceInput = ({ value, decimals = 0, onChange, ...rest }) => {
  useEffect(() => {
    onChange(checkDecimals(value));
  }, [decimals]);

  const handleKeyDown = e => {
    const key = e.keyCode;
    if (key >= '0'.charCodeAt(0) && key <= '9'.charCodeAt(0)) {
      if (value === '0' && key === '0'.charCodeAt(0)) e.preventDefault();
    } else if (key === 190) {
      if (value.length === 0 || value.includes('.') || decimals === 0)
        e.preventDefault();
    } else if (key !== 8) {
      e.preventDefault();
    }
  };

  const checkDecimals = val => {
    if (!val) return '';
    if (val.indexOf('.') > -1 && val.length - val.indexOf('.') - 1 > decimals) {
      const ret = Math.floor(+val * 10 ** decimals) / 10 ** decimals;
      return ret.toString();
    }
    return val;
  };

  const handleChange = e => {
    onChange(checkDecimals(e.target.value));
  };

  return (
    <input
      value={value}
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      {...rest}
    />
  );
};

export default PriceInput;
