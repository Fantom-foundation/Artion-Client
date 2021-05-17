import React from 'react';
import toast from 'react-hot-toast';

import iconInfo from 'assets/svgs/info.svg';

import styles from './styles.module.scss';

export default (type, title, body = '') => {
  toast(
    () => (
      <div>
        <div className={styles.header}>
          <img src={iconInfo} alt={type} className={styles.icon} />
          <span>{title}</span>
        </div>
        {body.length > 0 && <div className={styles.body}>{body}</div>}
      </div>
    ),
    {
      duration: 5000,
    }
  );
};
