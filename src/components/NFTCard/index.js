import React, { useEffect, useState, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import Skeleton from 'react-loading-skeleton';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import Loader from 'react-loader-spinner';

import SuspenseImg from 'components/SuspenseImg';
import PLACEHOLDER from 'assets/imgs/nft-placeholder.png';

const useStyles = makeStyles({
  root: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    position: 'relative',
  },
  card: {
    flexGrow: 1,
    cursor: 'pointer',
    borderRadius: 10,
    transition: 'transform ease 0.1s',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',

    '&:nth-child(n+2)': {
      position: 'absolute',
      height: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: -1,
    },
    '&:nth-child(2)': {
      width: '93%',
      top: 4,
    },
    '&:nth-child(3)': {
      width: '96%',
      top: 1,
    },
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
    color: '#000',
  },
  name: {
    flex: 1,
    fontWeight: 700,
    fontSize: 18,
    lineHeight: '18px',
    margin: 0,
    color: '#333',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': 2,
    '-webkit-box-orient': 'vertical',
  },
  mediaBox: {
    position: 'relative',
    paddingBottom: '100%',
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  media: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: '10px !important',
    backgroundSize: 'contain',
    objectFit: 'cover',
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
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': 2,
    '-webkit-box-orient': 'vertical',
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

const BaseCard = ({ item, loading, style }) => {
  const classes = useStyles();

  const [fetching, setFetching] = useState(false);
  const [info, setInfo] = useState(null);

  const { collections } = useSelector(state => state.Collections);

  const collection = collections.find(
    col => col.address === item?.contractAddress
  );

  const getTokenURI = async tokenURI => {
    setFetching(true);
    try {
      const { data } = await axios.get(tokenURI);
      setInfo(data);
    } catch {
      setInfo(null);
    }
    setFetching(false);
  };

  useEffect(() => {
    if (item) {
      getTokenURI(item.tokenURI);
    }
  }, [item]);

  const renderContent = () => {
    return (
      <>
        <div className={classes.mediaBox}>
          {loading || fetching ? (
            <Skeleton width="100%" height="100%" className={classes.media} />
          ) : (
            <Suspense
              fallback={
                <Loader
                  type="Oval"
                  color="#007BFF"
                  height={32}
                  width={32}
                  className={classes.loader}
                />
              }
            >
              <SuspenseImg
                src={info?.image || PLACEHOLDER}
                className={cx(
                  classes.media,
                  info?.image && classes.mediaMissing
                )}
                alt={info?.name}
              />
            </Suspense>
          )}
        </div>
        <div className={classes.content}>
          {loading || fetching ? (
            <Skeleton width="100%" height={20} />
          ) : (
            <Typography component="h4" className={classes.collection}>
              {collection?.name}
            </Typography>
          )}
          {loading || fetching ? (
            <Skeleton width="100%" height={20} />
          ) : (
            <Typography component="h4" className={classes.name}>
              {info?.name}
            </Typography>
          )}
          <div className={classes.alignBottom}>
            {loading || fetching ? (
              <Skeleton width={80} height={20} />
            ) : (
              <Typography component="h4" className={classes.label}>
                {item?.holderSupply || item?.supply || 1} of {item?.supply || 1}
              </Typography>
            )}
            <div className={classes.alignRight}>
              {!(loading || fetching) && (
                <Typography component="h4" className={classes.label}>
                  Price
                </Typography>
              )}
              {loading || fetching ? (
                <Skeleton width={80} height={20} />
              ) : (
                <Typography
                  component="h4"
                  className={cx(classes.label, classes.price)}
                >
                  {item?.price} FTM
                </Typography>
              )}
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div style={style} className={classes.root}>
      <div className={classes.card}>
        {item ? (
          <Link
            to={`/explore/${item.contractAddress}/${item.tokenID}`}
            className={classes.link}
          >
            {renderContent()}
          </Link>
        ) : (
          renderContent()
        )}
      </div>
      {item?.supply && (
        <>
          <div className={classes.card} />
          <div className={classes.card} />
        </>
      )}
    </div>
  );
};

export default React.memo(BaseCard);
