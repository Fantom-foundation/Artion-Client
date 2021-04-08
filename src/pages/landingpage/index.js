import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { register } from './styles';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';

import HeaderActions from '../../actions/header.actions';
import { useDispatch } from 'react-redux';

const LandingPage = ({ classes }) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const goToCreate = () => {
    dispatch(HeaderActions.toggleSearchbar(false));
    history.push('/create');
  };
  const goToExploreAll = () => {
    dispatch(HeaderActions.toggleSearchbar(true));
    history.push('/exploreall');
  };
  return (
    <div className={classes.main}>
      <div className={classes.buttonsContainer}>
        <Button
          variant="contained"
          color="primary"
          component="span"
          className={classes.landingPageButton}
          onClick={goToExploreAll}
        >
          Explore
        </Button>
        <Button
          variant="contained"
          color="primary"
          component="span"
          className={classes.landingPageButton}
          onClick={goToCreate}
        >
          Create
        </Button>
      </div>
    </div>
  );
};

export default withStyles(register)(LandingPage);
