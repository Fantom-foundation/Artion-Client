import ReactCSSTransitionGroup from 'react-transition-group';
import React, { useState } from 'react';
import './styles.scss';

const AdsCarousel = props => {
  const items = props.items;
  const [active, setActive] = useState(props.active);
  // const [intervalID, setIntervalID] = useState();

  // const adsCarouselAnimator = () => {
  //   let newIntervalId = setInterval(() => {
  //     setActive((active + 1) % items.length);
  //   }, 1000);
  //   setIntervalID(newIntervalId);
  // };

  // useEffect(() => {
  //   adsCarouselAnimator();
  //   return () => {
  //     clearInterval(intervalID);
  //   };
  // }, []);

  const generateItems = () => {
    let data = [];
    let level;
    for (let i = active - 2; i < active + 3; i++) {
      let index = i;
      if (i < 0) {
        index = items.length + i;
      } else if (i >= items.length) {
        index = i % items.length;
      }
      level = active - i;
      data.push(<Item key={index} id={items[index]} level={level} />);
    }
    return data;
  };

  const moveLeft = () => {
    let newActive = active;
    newActive--;

    setActive(newActive < 0 ? items.length - 1 : newActive);
  };

  const moveRight = () => {
    let newActive = active;

    setActive((newActive + 1) % items.length);
  };

  return (
    <div id="adscarousel" className="noselect">
      <div className="arrow arrow-left" onClick={moveLeft}>
        <i className="fi-arrow-left"></i>
      </div>
      <ReactCSSTransitionGroup.TransitionGroup>
        {generateItems()}
      </ReactCSSTransitionGroup.TransitionGroup>
      <div className="arrow arrow-right" onClick={moveRight}>
        <i className="fi-arrow-right"></i>
      </div>
    </div>
  );
};

const Item = props => {
  return <div className={'item level' + props.level}>{props.id}</div>;
};

export default AdsCarousel;
