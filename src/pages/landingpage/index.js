import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import HeaderActions from 'actions/header.actions';
import Header from 'components/header';
import FakeCard from 'components/FakeCard';

import fantomLogo from 'assets/svgs/fantom_logo_blue.svg';

import bg1 from 'assets/svgs/bg1.svg';
import bg2 from 'assets/svgs/bg2.svg';

import card1 from 'assets/imgs/cards/1.gif';
import card2 from 'assets/imgs/cards/2.png';
import card3 from 'assets/imgs/cards/3.png';
import card4 from 'assets/imgs/cards/4.png';
import card5 from 'assets/imgs/cards/5.png';

import styles from './styles.module.scss';

const LandingPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(HeaderActions.toggleSearchbar(false));
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <img src={bg1} className={styles.bg1} />
        <img src={bg2} className={styles.bg2} />
      </div>
      <Header />
      <div className={styles.body}>
        <div className={styles.title}>The largest NFT marketplace</div>
        <div className={styles.subtitle}>
          Create, Buy, Sell and Discover rare digital assets
        </div>
        <div className={styles.buttonsContainer}>
          <Link to="/exploreall" className={styles.exploreButton}>
            Explore
          </Link>
          <Link to="/create" className={styles.createButton}>
            Create
          </Link>
        </div>
        <div className={styles.subtitle2}>Zero % based fees on sales</div>
      </div>
      <div className={styles.footer}>
        Powered by&nbsp;
        <img src={fantomLogo} className={styles.logo} />
      </div>

      <div className={styles.cardsGroup}>
        <div className={styles.card1}>
          <FakeCard
            item={{
              image: card1,
              category: 'Anonymous',
              name: 'Bitcoin Doge',
              price: 600,
            }}
          />
        </div>
        <div className={styles.card2}>
          <FakeCard
            item={{
              image: card2,
              category: 'Anonymous',
              name: 'C-Princess',
              price: 150,
            }}
          />
        </div>
        <div className={styles.card3}>
          <FakeCard
            item={{
              image: card3,
              category: 'Anonymous',
              name: 'PunkG',
              price: 300,
            }}
          />
        </div>
        <div className={styles.card4}>
          <FakeCard
            item={{
              image: card4,
              category: 'Anonymous',
              name: 'TradingCard',
              price: 50,
            }}
          />
        </div>
        <div className={styles.card5}>
          <FakeCard
            item={{
              image: card5,
              category: 'Anonymous',
              name: 'fUni',
              price: 1000,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
