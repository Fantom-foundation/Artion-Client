import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';

import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import SearchIcon from '@material-ui/icons/Search';
const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexShrink: 0,
    paddingLeft: 20,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  onsaleinSvgDiv: {
    display: 'flex',
    alignItems: 'center',
  },
  collectionExpandDiv: {
    border: '1px solid gray',
    borderRadius: '8px',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    marginLeft: theme.spacing(1),
    flexGrow: 1,
  },
  iconButton: {
    padding: 10,
  },
}));

const ExploreOnSaleIn = () => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className={classes.root}>
      <Accordion
        expanded={expanded === 'panel1'}
        onChange={handleChange('panel1')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <div className={classes.onsaleinSvgDiv}>
            <LoyaltyIcon></LoyaltyIcon>
            <span className={classes.heading}>On Sale In</span>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div className={classes.collectionExpandDiv}>
            <InputBase
              className={classes.input}
              placeholder="Filter"
              inputProps={{ 'aria-label': 'Filter' }}
            />
            <IconButton
              type="submit"
              className={classes.iconButton}
              aria-label="search"
            >
              <SearchIcon />
            </IconButton>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default ExploreOnSaleIn;
