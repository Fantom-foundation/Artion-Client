import React from 'react';
import { Range, Direction } from 'react-range';

const STEP = 1;
const MIN = 1;
const MAX = 18;

const Track = ({ props, children }) => (
  <div
    onMouseDown={props.onMouseDown}
    onTouchStart={props.onTouchStart}
    style={{
      ...props.style,
      padding: '20px 0',
      display: 'flex',
      justifyContent: 'center',
      height: '150px'
    }}
  >
    <div
      ref={props.ref}
      style={{
        width: '5px',
        height: '100%',
        borderRadius: '4px',
        background: 'grey'
      }}
    >
      {children}
    </div>
  </div>
);

const Thumb = ({ isDragged }) => (
  <div
    key='thumb'
    style={{
      height: '14px',
      width: '24px',
      borderRadius: '5px',
      backgroundColor: isDragged ? '#548BF4' : '#CCC'
    }}
  />
);

const RangeSlider = ({ value, setValue }) => (
  <Range
    values={[value]}
    direction={Direction.Up}
    step={STEP}
    min={MIN}
    max={MAX}
    onChange={values => setValue(values[0])}
    renderTrack={Track}
    renderThumb={Thumb}
  />
);

export default RangeSlider;
