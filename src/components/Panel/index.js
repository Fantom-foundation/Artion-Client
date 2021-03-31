import React, { useState } from 'react';
import cx from 'classnames';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

import styles from './styles.module.scss';

const Panel = ({ title, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.header} onClick={() => setOpen(!open)}>
        <span className={styles.title}>{title}</span>
        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </div>
      <div className={cx(styles.body, open ? styles.open : null)}>
        {children}
      </div>
    </div>
  );
};

export default Panel;
