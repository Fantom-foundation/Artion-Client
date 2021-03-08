import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FantomLogo from '../../assets/svgs/fantom_logo_white_new.svg';

const useStyles = makeStyles(() => ({
  grow: {
    position: 'fixed',
    width: '100%',
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '48px',
    background: '#007bff',
    color: 'white',
  },
  fantomlogo: {
    height: '20px',
  },
}));

export default function NiftyFooter() {
  const classes = useStyles();

  return (
    <div className={classes.grow}>
      Powered by &nbsp;
      <img src={FantomLogo} className={classes.fantomlogo}></img>
    </div>
  );
}
