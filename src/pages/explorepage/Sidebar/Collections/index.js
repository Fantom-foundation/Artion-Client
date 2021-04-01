import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';

import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PlaylistPlayIcon from '@material-ui/icons/PlaylistPlay';
import SearchIcon from '@material-ui/icons/Search';

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
    maxHeight: 200,
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
  logo: {
    width: 32,
    height: 32,
    borderRadius: 32,
    marginRight: 8,
  },
  name: {
    fontSize: 18,
  },
}));

const ExploreCollections = () => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className={classes.root}>
      <Accordion
        className={classes.wrapper}
        expanded={expanded === 'panel1'}
        onChange={handleChange('panel1')}
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
            <div className={classes.collection}>
              <img className={classes.logo} />
              <span className={classes.name}>Collection 1</span>
            </div>
            <div className={classes.collection}>
              <img className={classes.logo} />
              <span className={classes.name}>Collection 1</span>
            </div>
            <div className={classes.collection}>
              <img className={classes.logo} />
              <span className={classes.name}>Collection 1</span>
            </div>
            <div className={classes.collection}>
              <img className={classes.logo} />
              <span className={classes.name}>Collection 1</span>
            </div>
            <div className={classes.collection}>
              <img className={classes.logo} />
              <span className={classes.name}>Collection 1</span>
            </div>
            <div className={classes.collection}>
              <img className={classes.logo} />
              <span className={classes.name}>Collection 1</span>
            </div>
            <div className={classes.collection}>
              <img className={classes.logo} />
              <span className={classes.name}>Collection 1</span>
            </div>
            <div className={classes.collection}>
              <img className={classes.logo} />
              <span className={classes.name}>Collection 1</span>
            </div>
            <div className={classes.collection}>
              <img className={classes.logo} />
              <span className={classes.name}>Collection 1</span>
            </div>
            <div className={classes.collection}>
              <img className={classes.logo} />
              <span className={classes.name}>Collection 1</span>
            </div>
            <div className={classes.collection}>
              <img className={classes.logo} />
              <span className={classes.name}>Collection 1</span>
            </div>
            <div className={classes.collection}>
              <img className={classes.logo} />
              <span className={classes.name}>Collection 1</span>
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default ExploreCollections;
