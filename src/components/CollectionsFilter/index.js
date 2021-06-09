import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import Skeleton from 'react-loading-skeleton';
import { makeStyles } from '@material-ui/core/styles';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Tooltip,
  InputBase,
} from '@material-ui/core';
import {
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
} from '@material-ui/icons';

import FilterActions from '../../actions/filter.actions';
import nftIcon from '../../assets/svgs/nft.svg';
import nftActiveIcon from '../../assets/svgs/nft_active.svg';

import iconCollections from 'assets/svgs/grid.svg';

import './styles.scss';

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
    marginBottom: 20,
    overflow: 'hidden',
  },
  wrapper: {
    boxShadow: 'none',
    borderRadius: '10px !important',
    border: '1px solid #2479FA77',
    overflow: 'hidden',
    maxHeight: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    height: 50,
    minHeight: '50px !important',
    backgroundColor: '#fff',
    boxShadow: 'none',
  },
  heading: {
    fontWeight: 500,
    fontSize: 18,
    paddingLeft: 20,
    flexShrink: 0,
    color: '#3D3D3D',
  },
  icon: {
    width: 22,
    height: 22,
  },
  arrowIcon: {
    color: '#3D3D3D',
    opacity: '0.6',
  },
  body: {
    padding: '6px 16px 20px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  collectionSvgDiv: {
    display: 'flex',
    alignItems: 'center',
  },
  collectionExpandDiv: {
    borderRadius: 5,
    width: '100%',
    flex: '0 0 50px',
    backgroundColor: 'rgba(190, 190, 190, .1)',
    padding: '0 14px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flexGrow: 1,
  },
  iconButton: {
    width: 22,
    height: 22,
    marginRight: 10,
    color: 'rgba(0, 0, 0, 0.5)',
  },
  collectionsList: {
    overflowY: 'auto',
    marginTop: 20,
    flexGrow: 1,
  },
  collection: {
    height: 40,
    padding: 4,
    margin: '14px 0',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    cursor: 'pointer',
  },
  selected: {
    color: '#007bff !important',
    opacity: '1 !important',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    marginRight: 14,
  },
  name: {
    fontWeight: 700,
    fontSize: 16,
    color: '#000',
    opacity: 0.6,
    marginRight: 4,
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

  const { collections: collectionItems, collectionsLoading } = useSelector(
    state => state.Collections
  );
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
    const selected = [];
    let unselected = [];
    collectionItems.map(item => {
      if (collections.includes(item.address)) {
        selected.push(item);
      } else {
        unselected.push(item);
      }
    });
    unselected = unselected.filter(
      item =>
        (item.name || item.collectionName || '')
          .toLowerCase()
          .indexOf(filter.toLowerCase()) > -1
    );
    return [...selected, ...unselected];
  };

  return (
    <div className={cx(classes.root, 'filter-root')}>
      <Accordion
        className={classes.wrapper}
        expanded={expanded}
        onChange={handleChange}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon className={classes.arrowIcon} />}
          className={classes.header}
        >
          <div className={classes.collectionSvgDiv}>
            <img src={iconCollections} className={classes.icon} />
            <span className={classes.heading}>Collections</span>
          </div>
        </AccordionSummary>
        <AccordionDetails className={classes.body}>
          <div className={classes.collectionExpandDiv}>
            <SearchIcon className={classes.iconButton} />
            <InputBase
              className={classes.input}
              placeholder="Filter"
              inputProps={{ 'aria-label': 'Filter' }}
              value={filter}
              onChange={e => setFilter(e.target.value)}
            />
          </div>
          <div className={classes.collectionsList}>
            {collectionsLoading &&
              new Array(8)
                .fill(0)
                .map((_, idx) => (
                  <Skeleton
                    key={idx}
                    width="100%"
                    height={40}
                    className={classes.collection}
                  />
                ))}
            {filteredCollections()
              .filter(item => item.isVerified)
              .map((item, idx) => (
                <div
                  key={idx}
                  className={classes.collection}
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
                  <span
                    className={cx(
                      classes.name,
                      collections.includes(item.address)
                        ? classes.selected
                        : null
                    )}
                  >
                    {item.name || item.collectionName}
                  </span>
                  {item.isVerified && (
                    <BootstrapTooltip
                      title="Verified Collection"
                      placement="top"
                    >
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
