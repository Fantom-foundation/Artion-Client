import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';

import PLACEHOLDER from 'assets/imgs/nft-placeholder.png';

const useStyles = makeStyles({
  root: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  card: {
    flexGrow: 1,
    cursor: 'pointer',
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
    borderRadius: 10,
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

const BaseCard = ({ item, style }) => {
  const classes = useStyles();

  const [info, setInfo] = useState(null);

  const collections = useSelector(state => state.Collections);

  const collection = collections.find(
    col => col.address === item.contractAddress
  );

  const getTokenURI = async tokenURI => {
    try {
      const res = await axios.get(tokenURI);
      setInfo(res.data);
    } catch {
      setInfo(null);
    }
  };

  useEffect(() => {
    getTokenURI(item.tokenURI);
  }, [item]);

  return (
    <Box style={style} className={classes.root}>
      <Card className={classes.card}>
        <Link
          to={`/explore/${item.contractAddress}/${item.tokenID}`}
          className={classes.link}
        >
          <div className={classes.mediaBox}>
            <CardMedia
              className={cx(classes.media, info?.image && classes.mediaMissing)}
              image={info?.image || PLACEHOLDER}
              title={info?.name}
            />
          </div>
          <CardContent className={classes.content}>
            <Typography component="h4" className={classes.collection}>
              {collection?.name}
            </Typography>
            <Typography component="h4" className={classes.name}>
              {info?.name}
            </Typography>
            <div className={classes.alignBottom}>
              <Typography component="h4" className={classes.label}>
                1 of 5
              </Typography>
              <div className={classes.alignRight}>
                <Typography component="h4" className={classes.label}>
                  Price
                </Typography>
                <Typography
                  component="h4"
                  className={cx(classes.label, classes.price)}
                >
                  Ξ {item.price}
                </Typography>
              </div>
            </div>
          </CardContent>
        </Link>
      </Card>
    </Box>
  );
};

export default React.memo(BaseCard);
