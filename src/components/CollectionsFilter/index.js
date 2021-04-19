import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Tooltip from '@material-ui/core/Tooltip';

import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PlaylistPlayIcon from '@material-ui/icons/PlaylistPlay';
import SearchIcon from '@material-ui/icons/Search';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import FilterActions from '../../actions/filter.actions';
import nftIcon from '../../assets/svgs/nft.svg';
import nftActiveIcon from '../../assets/svgs/nft_active.svg';

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

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    width: '100%',
  },
  wrapper: {
    boxShadow: 'none',
  },
  header: {
    height: 48,
    minHeight: '48px !important',
    borderRadius: 5,
    backgroundColor: '#fff',
    boxShadow: '0px 0px 5px 2px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    fontWeight: 500,
    fontSize: 18,
    paddingLeft: 20,
    flexShrink: 0,
    color: '#007BFF',
  },
  icon: {
    color: '#007BFF',
  },
  body: {
    backgroundColor: '#f8f8f8',
    padding: '14px 20px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  collectionSvgDiv: {
    display: 'flex',
    alignItems: 'center',
  },
  collectionExpandDiv: {
    borderRadius: 5,
    width: '100%',
    height: 40,
    backgroundColor: '#ECECEC',
    padding: '9px 12px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flexGrow: 1,
  },
  iconButton: {
    padding: 10,
  },
  collectionsList: {
    maxHeight: 300,
    overflowY: 'auto',
    marginTop: 20,
    flexGrow: 1,
  },
  collection: {
    height: 40,
    padding: 4,
    margin: '4px 0',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    cursor: 'pointer',
  },
  selected: {
    color: '#007bff',
  },
  logo: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  name: {
    fontSize: 18,
  },
  checkIcon: {
    fontSize: 18,
    color: '#007bff',
    marginLeft: 4,
  },
}));

const ExploreCollections = () => {
  const dispatch = useDispatch();

  const classes = useStyles();
  const [expanded, setExpanded] = useState(true);
  const [filter, setFilter] = useState('');

  const collectionItems = useSelector(state => state.Collections);
  const { collections } = useSelector(state => state.Filter);

  const handleChange = (_, isExpanded) => {
    setExpanded(isExpanded);
  };

  const handleSelectCollection = addr => {
    let newCollections = [];
    if (collections.includes(addr)) {
      newCollections = collections.filter(item => item !== addr);
    } else {
      newCollections = [...collections, addr];
    }
    dispatch(FilterActions.updateCollectionsFilter(newCollections));
  };

  const filteredCollections = () => {
    return collectionItems.filter(
      item =>
        (item.name || item.collectionName)
          .toLowerCase()
          .indexOf(filter.toLowerCase()) > -1
    );
  };

  return (
    <div className={classes.root}>
      <Accordion
        className={classes.wrapper}
        expanded={expanded}
        onChange={handleChange}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon className={classes.icon} />}
          className={classes.header}
        >
          <div className={classes.collectionSvgDiv}>
            <PlaylistPlayIcon className={classes.icon} />
            <span className={classes.heading}>Collections</span>
          </div>
        </AccordionSummary>
        <AccordionDetails className={classes.body}>
          <div className={classes.collectionExpandDiv}>
            <InputBase
              className={classes.input}
              placeholder="Filter"
              inputProps={{ 'aria-label': 'Filter' }}
              value={filter}
              onChange={e => setFilter(e.target.value)}
            />
            <IconButton
              type="submit"
              className={classes.iconButton}
              aria-label="search"
            >
              <SearchIcon />
            </IconButton>
          </div>

          <div className={classes.collectionsList}>
            {filteredCollections().map((item, idx) => (
              <div
                key={idx}
                className={cx(
                  classes.collection,
                  collections.includes(item.address) ? classes.selected : null
                )}
                onClick={() => handleSelectCollection(item.address)}
              >
                <img
                  className={classes.logo}
                  src={
                    item.isVerified
                      ? `https://gateway.pinata.cloud/ipfs/${item.logoImageHash}`
                      : collections.includes(item.address)
                      ? nftActiveIcon
                      : nftIcon
                  }
                />
                <span className={classes.name}>
                  {item.name || item.collectionName}
                </span>
                {item.isVerified && (
                  <BootstrapTooltip title="Verified Collection" placement="top">
                    <CheckCircleIcon className={classes.checkIcon} />
                  </BootstrapTooltip>
                )}
              </div>
            ))}
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default ExploreCollections;
