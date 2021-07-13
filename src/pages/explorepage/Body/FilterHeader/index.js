import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Skeleton from 'react-loading-skeleton';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {
  ExpandMore as ExpandMoreIcon,
  Close as CloseIcon,
} from '@material-ui/icons';

import { GroupFilters, SortByOptions } from 'constants/filter.constants';
import FilterActions from 'actions/filter.actions';
import { formatNumber } from 'utils';
import nftActiveIcon from 'assets/svgs/nft_active.svg';

import './styles.css';

const ExploreFilterHeader = ({ loading }) => {
  const dispatch = useDispatch();

  const { collections: collectionItems } = useSelector(
    state => state.Collections
  );
  const { count } = useSelector(state => state.Tokens);
  const { groupType, sortBy, collections } = useSelector(state => state.Filter);

  const selectedCollections = () => {
    const res = new Array(collections.length).fill(null);
    collectionItems.map(item => {
      const index = collections.findIndex(_item => _item === item.address);
      if (index > -1) {
        res[index] = item;
      }
    });
    return res.filter(item => !!item);
  };

  const handleGroupTypeChange = e => {
    const newGroupType = e.target.value;
    dispatch(FilterActions.updateGroupTypeFilter(newGroupType));
  };

  const handleSortByChange = e => {
    const newSortBy = e.target.value;
    dispatch(FilterActions.updateSortByFilter(newSortBy));
  };

  const handleDeselectCollection = addr => {
    let newCollections = [];
    newCollections = collections.filter(item => item !== addr);
    dispatch(FilterActions.updateCollectionsFilter(newCollections));
  };

  return (
    <div className="filterHeaderRoot">
      <div className="filterHeaderLeft">
        <label className="filterResultLabel">
          {loading ? (
            <Skeleton width={100} height={24} />
          ) : (
            `${formatNumber(count)} result${count !== 1 ? 's' : ''}`
          )}
        </label>
        {selectedCollections().map((item, idx) => (
          <div key={idx} className="filterCollectionItem">
            <img
              className="filterCollectionItemLogo"
              src={
                item.isVerified
                  ? `https://gateway.pinata.cloud/ipfs/${item.logoImageHash}`
                  : nftActiveIcon
              }
            />
            <span className="filterCollectionItemName">
              {item.name || item.collectionName}
            </span>
            <CloseIcon
              className="filterCollectionRemoveItem"
              onClick={() => handleDeselectCollection(item.address)}
            />
          </div>
        ))}
      </div>
      <div className="filterSelectGroup">
        <FormControl className="filterHeaderFormControl">
          <Select
            value={groupType}
            onChange={handleGroupTypeChange}
            className="selectBox"
            classes={{
              select: 'selectInner',
              selectMenu: 'selectMenu',
              icon: 'selectIcon',
            }}
            MenuProps={{
              classes: {
                paper: 'menuPropsPaper',
                list: 'menuItemList',
              },
            }}
            IconComponent={ExpandMoreIcon}
          >
            {GroupFilters.map((filter, idx) => {
              return (
                <MenuItem
                  value={filter.value}
                  key={idx}
                  className="menuItem"
                  classes={{ selected: 'menuItemSelected ' }}
                >
                  {filter.label}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <FormControl className="filterHeaderFormControl">
          <Select
            value={sortBy}
            onChange={handleSortByChange}
            className="selectBox"
            classes={{
              select: 'selectInner',
              selectMenu: 'selectMenu',
              icon: 'selectIcon',
            }}
            MenuProps={{
              classes: {
                paper: 'menuPropsPaper',
                list: 'menuItemList',
              },
            }}
            IconComponent={ExpandMoreIcon}
          >
            {SortByOptions.map((option, idx) => {
              return (
                <MenuItem
                  value={option.id}
                  key={idx}
                  className="menuItem"
                  classes={{ selected: 'menuItemSelected ' }}
                >
                  {option.label}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </div>
    </div>
  );
};

export default ExploreFilterHeader;
