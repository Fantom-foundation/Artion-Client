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
    'https://lh3.googleusercontent.com/z0IUzmnJ5aL5aHTh5lVBflJVGcRud6O0AGQFYyK2mKf81ejp_dgOOUzzeXcfMqKnZdz1qX2V_IMKmmbuDOJKS54CJbVQHO11eBkAYw=s992';
  let demoUrl1 =
    'https://lh3.googleusercontent.com/HDdx4boLtWWAus1Q5Z_2kbEBYmuSXc6I87An64u628-F8IK8lZ-VZN3O3p6r2nREapCaHYrsEN3iawXCZM5QwXdZFH78pu9LjhL4yA=s992';
  let demoUrl2 =
    'https://lh3.googleusercontent.com/y-5FEVInvwNmKT6pcXYqQilLMPDrezlNkxqe1cEAjY7PIbKbGvwzvpZtLQ3Gh8NKZsiz1X-BE0NLad76P4Ic7XgfZXNrPEAI1UdWsQ=s992';
  let demoUrl3 =
    'https://lh3.googleusercontent.com/zq6XbLmRM9hZIG3kNDRfxbpQIKh_CQJLwckAZWUK3_qbalr-oLfdfcl3p-DW3JLHTURfA81hD1vEfvZWJR4AzWkEWnBsoX5b_51gng=s992';
  let demoUrl4 =
    'https://lh3.googleusercontent.com/aQzrnteZrcwm5FR9zg03FXH66DMsNm0g-4eiJmabO3WTgAb_8yjSVLZ5i0u9oxj1gLM9iOdogKKb3J_f6Atr71Ti91fW-j8Ojz05s-U=s992';
  let demoUrl5 =
    'https://lh3.googleusercontent.com/Lc6QkUUhtkbGXLRSwvwQdGSovPfDIeBsyfjLmAoL28CY41h8h465yR-Jy1XS9UFASWPtg7hGou_grtkfrUNt-NQaGlDfi7ZafhTC2Ck=s992';

  let demoUrl6 =
    'https://lh3.googleusercontent.com/17vU_UNWeMOVi4XOAwo4nvAXpeg1dnKPBk8VnAhJcFHOFZ9UBBvSL5Spj0ytvyfII3rdp4gHMY0mMvbnSzjdOZ0=s992';

  let demoUrl7 =
    'https://lh3.googleusercontent.com/p9w7XABQskc1QLOiTaAsCmiealmr4LZZbTSL3MqwyDT6annJjL3YQZwcALfsLHAd1qEWBANza6A0U-fINRhf3uexmevTbJCHGIR2LQ=s992';

  let demoUrl8 =
    'https://lh3.googleusercontent.com/VR-avzd2YeD-W1wquFCsPpLmvkqRaP23qXBRJLt3eJtBK7srZC0aAW7qBzNE70t_s9J1C0ZHyYiA0zjRP0pWKrmwnnA8ll6_UJFo=s992';

  let demoUrl9 =
    'https://lh3.googleusercontent.com/t0WfHQil3DfcP0gY9vs-1W2TDxRSHz4LPxXC3cDs899othEGV2EA-VajZFgaHe6WWPWRO4JohFG5UXT5NL4zgZSOEf92fCcw0frd=s992';

  let name = 'Sample';
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
            ipfsUrl={demoUrl6}
            name={name}
            description={description}
          ></AdsCard>
        </div>
        <div>
          <AdsCard
            ipfsUrl={demoUrl7}
            name={name}
            description={description}
          ></AdsCard>
        </div>
        <div>
          <AdsCard
            ipfsUrl={demoUrl8}
            name={name}
            description={description}
          ></AdsCard>
        </div>
        <div>
          <AdsCard
            ipfsUrl={demoUrl9}
            name={name}
            description={description}
          ></AdsCard>
        </div>
      </Slider>
    </div>
  );
};

export default AdsCarousel;
