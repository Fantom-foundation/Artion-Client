import React from 'react';
import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import AdsCard from '../AdsCard';

import './styles.scss';

const AdsCarousel = () => {
  let settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    draggable: true,
    swipe: false,
    // fade: true,
    pauseOnHover: true,
    centerMode: true,
    arrows: false,
  };

  let demoUrl =
    'https://gateway.pinata.cloud/ipfs/QmX5H8gghPgNgejpWhqPQeHbETo4AFj5x2TivcV18KhkNQ';
  let demoUrl1 =
    'https://images.unsplash.com/photo-1593642532009-6ba71e22f468?ixid=MXwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60';
  let demoUrl2 =
    'https://images.unsplash.com/photo-1614896777839-cdec1a580b0a?ixid=MXwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0M3x8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60';
  let demoUrl3 =
    'https://images.unsplash.com/photo-1615164280089-0f403961df96?ixid=MXwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzOXx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60';
  let demoUrl4 =
    'https://images.unsplash.com/photo-1603993097397-89c963e325c7?ixid=MXwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHw4NXx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60';
  let demoUrl5 =
    'https://images.unsplash.com/photo-1485217988980-11786ced9454?ixid=MXwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxMzN8fHxlbnwwfHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60';
  let name = "Tommy's Test";
  let description = 'This is the NFT Items powered on Fantom';

  return (
    <div className="carouselContainer">
      <Slider {...settings}>
        <div>
          <AdsCard
            ipfsUrl={demoUrl}
            name={name}
            description={description}
          ></AdsCard>
        </div>
        <div>
          <AdsCard
            ipfsUrl={demoUrl1}
            name={name}
            description={description}
          ></AdsCard>
        </div>
        <div>
          <AdsCard
            ipfsUrl={demoUrl2}
            name={name}
            description={description}
          ></AdsCard>
        </div>
        <div>
          <AdsCard
            ipfsUrl={demoUrl3}
            name={name}
            description={description}
          ></AdsCard>
        </div>
        <div>
          <AdsCard
            ipfsUrl={demoUrl4}
            name={name}
            description={description}
          ></AdsCard>
        </div>
        <div>
          <AdsCard
            ipfsUrl={demoUrl5}
            name={name}
            description={description}
          ></AdsCard>
        </div>
        <div>
          <AdsCard
            ipfsUrl={demoUrl3}
            name={name}
            description={description}
          ></AdsCard>
        </div>
        <div>
          <AdsCard
            ipfsUrl={demoUrl4}
            name={name}
            description={description}
          ></AdsCard>
        </div>
      </Slider>
    </div>
  );
};

export default AdsCarousel;
