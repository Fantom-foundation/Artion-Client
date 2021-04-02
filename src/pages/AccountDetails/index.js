import React, { useState } from 'react';
import cx from 'classnames';

import NFTsGrid from '../../components/NFTsGrid';
import StatusFilter from '../../components/StatusFilter';
import CollectionsFilter from '../../components/CollectionsFilter';

import styles from './styles.module.scss';

const AccountDetails = () => {
  const [bundleIndex, setBundleIndex] = useState(null);

  const bundles = Array.from({ length: 10 }, (_, index) => ({
    logo:
      'https://lh3.googleusercontent.com/Cl3eJW9mEGZaSF0xxLIM0SzUx9HDi3Tgns5mHEKMtEokOmgtrrqLPZidxvM8BXBjzEWc03BNwzpXqEpc4w0sVOFnDlSeeFsh_ia6zg=s100',
    name: `Bundle ${index + 1}`,
  }));

  const onBundleSelect = index => {
    if (bundleIndex === index) {
      setBundleIndex(null);
    } else {
      setBundleIndex(index);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.profileWrapper}>
          <img
            src="https://lh3.googleusercontent.com/ojVpeYTZbASHsP-9z385kSIQSAHYaNFZkVMgiU4j6djSmRDtyc0psef3vy1LVoyREFDHSY7VzqQKiqYoJo9teMOxcvoCdlkatucflw=s0"
            className={styles.avatar}
          />
          <div className={styles.username}>username</div>
          <div className={styles.address}>0x12345678901234567890</div>
          <div className={styles.bio}>Crazy Crypto Fan, Bitcoin Trader</div>
        </div>
        <StatusFilter />
        <CollectionsFilter />
      </div>

      <div className={styles.body}>
        <div className={styles.bundleBox}>
          <div className={styles.bundleList}>
            {bundles.map((bundle, idx) => (
              <div
                className={cx(
                  styles.bundle,
                  idx === bundleIndex ? styles.selected : null
                )}
                key={idx}
                onClick={() => onBundleSelect(idx)}
              >
                <img src={bundle.logo} className={styles.bundleLogo} />
                {bundle.name}
              </div>
            ))}
          </div>
        </div>
        <NFTsGrid items={new Array(100).fill(0)} />
      </div>
    </div>
  );
};

export default AccountDetails;
