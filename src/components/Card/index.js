import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
// import CardActionArea from '@material-ui/core/CardActionArea';
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
  },
  card: {
    margin: '10px 12px',
    flexGrow: 1,
    cursor: 'pointer',
    boxShadow: 'none',
    border: '1px solid #ddd',
    transition: 'transform ease 0.1s',
    display: 'flex',
    flexDirection: 'column',

    '&:hover': {
      boxShadow: '0 0 8px rgba(0, 0, 0, 0.2)',
      transform: 'translateY(-2px)',
    },
  },
  label: {
    fontSize: 14,
    margin: 0,
    color: '#999',
  },
  name: {
    fontSize: 16,
    margin: 0,
    color: '#333',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    margin: 0,
    color: '#333',
  },
  media: {
    width: '100%',
    height: 200,
    backgroundSize: 'contain',
  },
  mediaMissing: {
    width: '100%',
    height: 200,
    backgroundSize: 'cover',
  },
  content: {
    borderTop: '1px solid #ddd',
    padding: '12px !important',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  alignLeft: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  alignRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
});

const BaseCard = ({ item, style }) => {
  const classes = useStyles();
  const history = useHistory();

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

  const viewNFTDetails = () => {
    history.push(`/explore/${item.contractAddress}/${item.tokenID}`);
  };

  return (
    <Box style={style} className={classes.root}>
      <Card className={classes.card} onClick={viewNFTDetails}>
        <CardMedia
          className={info?.image ? classes.media : classes.mediaMissing}
          image={info?.image || PLACEHOLDER}
          title={info?.name}
        />
        <CardContent className={classes.content}>
          <div className={classes.alignLeft}>
            <Typography component="h4" className={classes.label}>
              {collection?.name || ''}
            </Typography>
            <Typography component="h4" className={classes.name}>
              {info?.name}
            </Typography>
          </div>
          <div className={classes.alignRight}>
            <Typography component="h4" className={classes.label}>
              Price
            </Typography>
            <Typography component="h4" className={classes.price}>
              Ξ {item.price}
            </Typography>
          </div>
        </CardContent>
      </Card>
    </Box>
  );
};

export default React.memo(BaseCard);
