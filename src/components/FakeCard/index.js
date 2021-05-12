import React from 'react';
import cx from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  card: {
    flexGrow: 1,
    borderRadius: 10,
    transition: 'transform ease 0.1s',
    boxShadow: '0 4px 40px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
  },
  link: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    textDecoration: 'inherit',
  },
  label: {
    fontWeight: 500,
    fontSize: 14,
    lineHeight: '14px',
    margin: 0,
    color: 'rgba(61, 61, 61, .56)',
  },
  price: {
    marginTop: 9,
  },
  name: {
    flex: 1,
    fontWeight: 700,
    fontSize: 18,
    lineHeight: '18px',
    margin: 0,
    color: '#333',
  },
  mediaBox: {
    position: 'relative',
    paddingBottom: '100%',
  },
  media: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: '10px !important',
    backgroundSize: 'contain',
  },
  mediaMissing: {
    backgroundSize: 'cover',
  },
  content: {
    marginTop: 'auto',
    padding: '32px 24px 24px !important',
  },
  collection: {
    fontSize: 16,
    lineHeight: '16px',
    color: 'rgba(0, 0, 0, .56)',
  },
  alignBottom: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  alignRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
});

const BaseCard = ({ item }) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Card className={classes.card}>
        <div className={classes.mediaBox}>
          <CardMedia className={classes.media} image={item.image} />
        </div>
        <CardContent className={classes.content}>
          <Typography component="h4" className={classes.collection}>
            {item.category}
          </Typography>
          <Typography component="h4" className={classes.name}>
            {item.name}
          </Typography>
          <div className={classes.alignBottom}>
            <Typography component="h4" className={classes.label}>
              1 of 1
            </Typography>
            <div className={classes.alignRight}>
              <Typography component="h4" className={classes.label}>
                Price
              </Typography>
              <Typography
                component="h4"
                className={cx(classes.label, classes.price)}
              >
                {item.price} FTM
              </Typography>
            </div>
          </div>
        </CardContent>
      </Card>
    </Box>
  );
};

export default React.memo(BaseCard);
