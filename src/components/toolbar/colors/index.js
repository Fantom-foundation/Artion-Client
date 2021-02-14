import React from 'react';

import { Color } from './style';
import COLORS from 'constants/colors';

const Colors = ({ currentColor, setColor }) =>
  COLORS.map(color => (
    <Color
      key={color}
      color={color}
      active={currentColor === color}
      onClick={() => setColor(color)}
    />
  ));

export default Colors;
