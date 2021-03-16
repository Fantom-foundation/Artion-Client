import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    paddingBottom: '6px',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  statusFormGroup: {
    display: 'flex',
    flexDirection: 'row',
  },
  statusFormGroupSubDiv: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  formControl: {},
}));

const ExploreStatus = () => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [buyNow, setBuyNow] = useState(false);
  const [onAuction, setOnAuction] = useState(false);
  const [statusNew, setStatusNew] = useState(false);
  const [hasOffers, setHasOffers] = useState(false);

  const handleAccordionColElapse = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleCheckgroupChanges = event => {
    let name = event.target.name;
    switch (name) {
      case 'buynow':
        {
          setBuyNow(!buyNow);
        }
        break;
      case 'new':
        {
          setStatusNew(!statusNew);
        }
        break;
      case 'onauction':
        {
          setOnAuction(!onAuction);
        }
        break;
      case 'hasOffers':
        {
          setHasOffers(!hasOffers);
        }
        break;
      default: {
        console.log('nothing to change');
      }
    }
  };

  return (
    <div className={classes.root}>
      <Accordion
        expanded={expanded === 'panel1'}
        onChange={handleAccordionColElapse('panel1')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography className={classes.heading}>Status</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup className={classes.statusFormGroup}>
            <div className={classes.statusFormGroupSubDiv}>
              <FormControlLabel
                className={classes.formControl}
                control={
                  <Checkbox
                    checked={buyNow}
                    onChange={handleCheckgroupChanges}
                    name="buynow"
                  />
                }
                label="Buy Now"
              />
              <FormControlLabel
                className={classes.formControl}
                control={
                  <Checkbox
                    checked={statusNew}
                    onChange={handleCheckgroupChanges}
                    name="new"
                  />
                }
                label="New"
              />
            </div>
            <div className={classes.statusFormGroupSubDiv}>
              <FormControlLabel
                className={classes.formControl}
                control={
                  <Checkbox
                    checked={onAuction}
                    onChange={handleCheckgroupChanges}
                    name="onauction"
                  />
                }
                label="On Auction"
              />

              <FormControlLabel
                className={classes.formControl}
                control={
                  <Checkbox
                    checked={hasOffers}
                    onChange={handleCheckgroupChanges}
                    name="hasOffers"
                  />
                }
                label="Has Offers"
              />
            </div>
          </FormGroup>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default ExploreStatus;
