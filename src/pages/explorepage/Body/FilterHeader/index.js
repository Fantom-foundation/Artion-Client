import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import {
  GroupFilters,
  SortByOptions,
} from '../../../../constants/filter.constants';
import FilterActions from '../../../../actions/filter.actions';

import './styles.css';

const ExploreFilterHeader = () => {
  const dispatch = useDispatch();

  const { count } = useSelector(state => state.Tokens);
  const { groupType, sortBy } = useSelector(state => state.Filter);

  const handleGroupTypeChange = e => {
    const newGroupType = e.target.value;
    dispatch(FilterActions.updateGroupTypeFilter(newGroupType));
  };

  const handleSortByChange = e => {
    const newSortBy = e.target.value;
    dispatch(FilterActions.updateSortByFilter(newSortBy));
  };

  return (
    <div className="filterHeaderRoot">
      <label className="filterResultLabel">{count} results</label>
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
                  value={idx}
                  key={idx}
                  className="menuItem"
                  classes={{ selected: 'menuItemSelected ' }}
                >
                  {filter}
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
