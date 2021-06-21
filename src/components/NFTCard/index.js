import React, { useEffect, useState, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import Skeleton from 'react-loading-skeleton';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import Loader from 'react-loader-spinner';
import Carousel, { Dots } from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';

import SuspenseImg from 'components/SuspenseImg';

import styles from './styles.module.scss';

const BaseCard = ({ item, loading, style }) => {
  const [fetching, setFetching] = useState(false);
  const [info, setInfo] = useState(null);
  const [index, setIndex] = useState(0);

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

  const renderSlides = () => {
    return [0, 1, 2].map((v, idx) => (
      <div className={styles.imageBox} key={idx}>
        {info?.image && (
          <Suspense
            fallback={
              <Loader
                type="Oval"
                color="#007BFF"
                height={32}
                width={32}
                className={styles.loader}
              />
            }
          >
            <SuspenseImg
              src={
                item.thumbnailPath?.startsWith('https')
                  ? item.thumbnailPath
                  : info.image
              }
              className={styles.media}
              alt={info?.name}
            />
          </Suspense>
        )}
      </div>
    ));
  };

  const renderDots = () => {
    return [0, 1, 2].map((v, idx) => (
      <div className={cx(styles.dot)} key={idx} />
    ));
  };

  const renderContent = () => {
    return (
      <>
        <div className={styles.mediaBox}>
          <div className={styles.mediaPanel}>
            {loading || fetching ? (
              <Skeleton
                width="100%"
                height="100%"
                className={styles.mediaLoading}
              />
            ) : item.isBundle ? (
              <>
                <Carousel
                  className={styles.carousel}
                  plugins={['fastSwipe']}
                  value={index}
                  onChange={_index =>
                    setIndex(Math.min(Math.max(_index, 0), 2))
                  }
                  slides={renderSlides()}
                  numberOfInfiniteClones={1}
                />
                <Dots
                  className={styles.dots}
                  value={index}
                  onChange={setIndex}
                  number={3}
                  thumbnails={renderDots()}
                />
              </>
            ) : (
              <div className={styles.imageBox}>
                {info?.image && (
                  <Suspense
                    fallback={
                      <Loader
                        type="Oval"
                        color="#007BFF"
                        height={32}
                        width={32}
                        className={styles.loader}
                      />
                    }
                  >
                    <SuspenseImg
                      src={
                        item.thumbnailPath?.startsWith('https')
                          ? item.thumbnailPath
                          : info.image
                      }
                      className={styles.media}
                      alt={info?.name}
                    />
                  </Suspense>
                )}
              </div>
            )}
          </div>
        </div>
        <div className={styles.content}>
          {loading || fetching ? (
            <Skeleton width="100%" height={20} />
          ) : (
            <Typography component="h4" className={styles.collection}>
              {collection?.collectionName || collection?.name}
            </Typography>
          )}
          {loading || fetching ? (
            <Skeleton width="100%" height={20} />
          ) : (
            <Typography component="h4" className={styles.name}>
              {info?.name}
            </Typography>
          )}
          <div className={styles.alignBottom}>
            {loading || fetching ? (
              <Skeleton width={80} height={20} />
            ) : (
              <Typography component="h4" className={styles.label}>
                {item?.holderSupply || item?.supply || 1} of {item?.supply || 1}
              </Typography>
            )}
            <div className={styles.alignRight}>
              {!(loading || fetching) && (
                <Typography component="h4" className={styles.label}>
                  Price
                </Typography>
              )}
              {loading || fetching ? (
                <Skeleton width={80} height={20} />
              ) : (
                <Typography
                  component="h4"
                  className={cx(styles.label, styles.price)}
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
    <div style={style} className={styles.root}>
      <div className={styles.card}>
        {item ? (
          <Link
            to={`/explore/${item.contractAddress}/${item.tokenID}`}
            className={styles.link}
          >
            {renderContent()}
          </Link>
        ) : (
          renderContent()
        )}
      </div>
      {item?.tokenType === 1155 && (
        <>
          <div className={styles.card} />
          <div className={styles.card} />
        </>
      )}
    </div>
  );
};

export default React.memo(BaseCard);
