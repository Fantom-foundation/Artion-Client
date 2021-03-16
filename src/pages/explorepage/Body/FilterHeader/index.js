import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import {
  GroupFilters,
  SortByOptionsGlobal,
} from '../../../../constants/filter.constants';

import './styles.css';

const ExploreFilterHeader = () => {
  return (
    <div className="filterHeaderRoot">
      <label className="filterResultLabel">0 results</label>
      <div className="filterSelectGroup">
        <FormControl variant="outlined" className="filterHeaderFormControl">
          <InputLabel id="demo-simple-select-outlined-label">Group</InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={GroupFilters[0]}
            //   onChange={handleChange}
            label="Group"
          >
            {GroupFilters.map((filter, idx) => {
              return (
                <MenuItem value={filter} key={idx}>
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
            value={SortByOptionsGlobal[0]}
            //   onChange={handleChange}
            label="Sort By"
          >
            {SortByOptionsGlobal.map((option, idx) => {
              return (
                <MenuItem value={option} key={idx}>
                  {option}
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
