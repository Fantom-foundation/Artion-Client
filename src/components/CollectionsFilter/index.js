import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import Skeleton from 'react-loading-skeleton';
import { makeStyles } from '@material-ui/core/styles';
import { InputBase } from '@material-ui/core';
import {
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
} from '@material-ui/icons';

import FilterWrapper from 'components/FilterWrapper';
import BootstrapTooltip from 'components/BootstrapTooltip';
import FilterActions from 'actions/filter.actions';
import nftIcon from 'assets/svgs/nft.svg';
import nftActiveIcon from 'assets/svgs/nft_active.svg';
import iconCheck from 'assets/svgs/check_blue.svg';

import './styles.scss';

const useStyles = makeStyles(() => ({
  body: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  collectionExpandDiv: {
    borderRadius: 10,
    width: '100%',
    flex: '0 0 48px',
    backgroundColor: '#FFF',
    border: '1px solid #EAEAF1',
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
    maxHeight: 260,
  },
  collection: {
    height: 40,
    padding: '0 8px',
    margin: '12px 0',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    cursor: 'pointer',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    marginRight: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    '& img': {
      width: 24,
      height: 24,
    },
  },
  withBorder: {
    boxSizing: 'border-box',
    border: '1px solid #D9E1EE',
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
  const [filter, setFilter] = useState('');

  const { collections: collectionItems, collectionsLoading } = useSelector(
    state => state.Collections
  );
  const { collections } = useSelector(state => state.Filter);

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
    <FilterWrapper title="Collections" classes={{ body: classes.body }}>
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
          collectionItems.length === 0 &&
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
          .filter(item => item.isVisible)
          .map((item, idx) => (
            <div
              key={idx}
              className={classes.collection}
              onClick={() => handleSelectCollection(item.address)}
            >
              {collections.includes(item.address) ? (
                <div className={cx(classes.logo, classes.withBorder)}>
                  <img src={iconCheck} />
                </div>
              ) : (
                <img
                  className={classes.logo}
                  src={
                    item.isVerified
                      ? `https://cloudflare-ipfs.com/ipfs/${item.logoImageHash}`
                      : collections.includes(item.address)
                      ? nftActiveIcon
                      : nftIcon
                  }
                />
              )}
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
    </FilterWrapper>
  );
};

export default ExploreCollections;
