import React from 'react';

import Header from '../Header';

import avatarBg from 'assets/imgs/avatar_bg.png';
import avatar from 'assets/imgs/gasly.png';
import sign from 'assets/imgs/sign.png';
import logo from 'assets/imgs/logo.png';
import textBg1 from 'assets/imgs/text_bg1.png';

import styles from './styles.module.scss';

const GaslyHomePage = () => {
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.main}>
        <div className={styles.top}>
          <div className={styles.avatarBox}>
            <img src={avatarBg} className={styles.avatarBg} />
            <img src={avatar} className={styles.avatar} />
          </div>
          <img src={sign} className={styles.sign} />
          <img src={logo} className={styles.logo} />
        </div>
        <div className={styles.info}>
          <img src={textBg1} className={styles.textBg1} />
          <div className={styles.infoContent}>
            <div className={styles.infoText}>
              A unique limited edition NFT drop redeemable for an original{' '}
              <span>Pierre Gasly helmet</span> and 2 “
              <span>Golden tickets</span>” redeemable for collectible physical
              items.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GaslyHomePage;
