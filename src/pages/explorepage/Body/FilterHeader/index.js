import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import {
  GroupFilters,
  SortByOptions,
} from '../../../../constants/filter.constants';
import FilterActions from '../../../../actions/filter.actions';

import './styles.css';

const ExploreFilterHeader = () => {
  const dispatch = useDispatch();

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
      <label className="filterResultLabel">0 results</label>
      <div className="filterSelectGroup">
        <FormControl variant="outlined" className="filterHeaderFormControl">
          <InputLabel id="demo-simple-select-outlined-label">Group</InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={groupType}
            onChange={handleGroupTypeChange}
            label="Group"
            MenuProps={{
              classes: {
                paper: 'menuPropsPaper',
              },
            }}
          >
            {GroupFilters.map((filter, idx) => {
              return (
                <MenuItem value={idx} key={idx}>
                  {filter}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <FormControl variant="outlined" className="filterHeaderFormControl">
          <InputLabel id="demo-simple-select-outlined-label">
            Sort By
          </InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={sortBy}
            onChange={handleSortByChange}
            label="Sort By"
            MenuProps={{
              classes: {
                paper: 'menuPropsPaper',
              },
            }}
          >
            {SortByOptions.map((option, idx) => {
              return (
                <MenuItem value={option.id} key={idx}>
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
