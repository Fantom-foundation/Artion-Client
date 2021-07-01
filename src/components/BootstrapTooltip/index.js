import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Tooltip } from '@material-ui/core';

const useStylesBootstrap = makeStyles(theme => ({
  arrow: {
    color: theme.palette.common.black,
  },
  tooltip: {
    backgroundColor: theme.palette.common.black,
    padding: '8px 16px',
    fontSize: 14,
  },
}));

function BootstrapTooltip(props) {
  const classes = useStylesBootstrap();

  return <Tooltip arrow classes={classes} {...props} />;
}

export default BootstrapTooltip;
