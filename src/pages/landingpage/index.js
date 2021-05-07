import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';

import HeaderActions from 'actions/header.actions';
import NFTCard from 'components/NFTCard';
import Header from 'components/header';

import bg1 from 'assets/svgs/bg1.svg';
import bg2 from 'assets/svgs/bg2.svg';

import styles from './styles.module.scss';

const LandingPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(HeaderActions.toggleSearchbar(false));
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <img src={bg1} className={styles.bg} />
        <img src={bg2} className={styles.bg} />
      </div>
      <Header />
      <div className={styles.body}>
        <div className={styles.title}>The Global NFT Marketplace on Fantom</div>
        <div className={styles.subtitle}>
          Create, Buy, Sell and Discover rare digital assets
        </div>
        <div className={styles.buttonsContainer}>
          <Link to="/exploreall" className={styles.exploreButton}>
            Explore
          </Link>
          <a hrf="/create" className={styles.createButton}>
            Create
          </a>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectiontitle}>Current Auctions</div>
        <Slider dots={false} infinite slidesToScroll={1}>
          {Array.from({ length: 10 }, (_, i) => i).map((_, idx) => (
            <div key={idx}>
              <NFTCard
                item={{
                  contractAddress: '0x76b03166c8ab1462b046d7745c77eaa83e656a8c',
                  tokenURI:
                    'https://gateway.pinata.cloud/ipfs/QmeeXHcqEtMj3sJCvrreTTAZnWBeEsTq2gv89ThKBwQFNJ',
                }}
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default LandingPage;
