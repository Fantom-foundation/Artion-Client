import React, { useState } from 'react';
import cx from 'classnames';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import HelpIcon from '@material-ui/icons/Help';

import styles from './styles.module.scss';

const Panel = ({ title, fixed, children }) => {
  const [open, setOpen] = useState(!!fixed);

  const handleOpen = () => {
    if (!fixed) {
      setOpen(!open);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header} onClick={handleOpen}>
        <span className={styles.title}>{title}</span>
        {fixed ? (
          <HelpIcon className={styles.icon} />
        ) : open ? (
          <ExpandLessIcon className={styles.icon} />
        ) : (
          <ExpandMoreIcon className={styles.icon} />
        )}
      </div>
      <div className={cx(styles.body, open ? styles.open : null)}>
        {children}
      </div>
    </div>
  );
};

export default Panel;
