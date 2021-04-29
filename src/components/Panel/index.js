import React, { useState } from 'react';
import cx from 'classnames';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import HelpIcon from '@material-ui/icons/Help';

import styles from './styles.module.scss';

const Panel = ({ icon, title, fixed, children }) => {
  const [open, setOpen] = useState(!!fixed);

  const handleOpen = () => {
    if (!fixed) {
      setOpen(!open);
    }
  };

  const Icon = icon;

  return (
    <div className={styles.container}>
      <div className={styles.header} onClick={handleOpen}>
        <div className={styles.headerLeft}>
          {Icon && <Icon className={styles.icon} />}
          <span className={styles.title}>{title}</span>
        </div>
        {fixed ? <HelpIcon /> : open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </div>
      <div className={cx(styles.body, open ? styles.open : null)}>
        {children}
      </div>
    </div>
  );
};

export default Panel;
