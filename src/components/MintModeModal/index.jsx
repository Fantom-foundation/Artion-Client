import React from 'react';
import cx from 'classnames';

import styles from './styles.module.scss';

const MintModeModal = ({ visible, onModeSelect = () => {} }) => {
  const handleClick = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className={cx(styles.container, visible ? styles.visible : null)}>
      <div className={styles.modal} onClick={handleClick}>
        <div className={styles.title}>Create NFT</div>
        <div className={styles.body}>
          <div className={styles.button} onClick={() => onModeSelect(0)}>
            <div className={styles.buttonTitle}>Direct Upload</div>
            <div className={styles.buttonDesc}>(JPG, PNG, GIF, BMP)</div>
          </div>
          <div className={styles.button} onClick={() => onModeSelect(1)}>
            <div className={styles.buttonTitle}>Edit & Upload</div>
            <div className={styles.buttonDesc}>(JPG, PNG, BMP)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MintModeModal;
