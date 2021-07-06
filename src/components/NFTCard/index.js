import React, { useState, useEffect, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import Skeleton from 'react-loading-skeleton';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import Loader from 'react-loader-spinner';
import Carousel, { Dots } from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';
import axios from 'axios';

import SuspenseImg from 'components/SuspenseImg';
import { formatNumber } from 'utils';
import { useApi } from 'api';

import styles from './styles.module.scss';

const BaseCard = ({ item, loading, style, create, onCreate }) => {
  const { storageUrl } = useApi();

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
    if (item && !item.name) {
      getTokenURI(item.tokenURI);
    }
  }, [item]);

  const renderSlides = () => {
    return item.items.map((v, idx) => (
      <div className={styles.imageBox} key={idx}>
        {v.imageURL && (
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
                v.thumbnailPath?.length > 10
                  ? `${storageUrl()}/image/${v.thumbnailPath}`
                  : v.imageURL
              }
              className={styles.media}
              alt={v.name}
            />
          </Suspense>
        )}
      </div>
    ));
  };

  const renderDots = () => {
    return item.items.map((v, idx) => (
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
            ) : item.items ? (
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
                  number={Math.min(item.items.length, 18)}
                  thumbnails={renderDots()}
                />
              </>
            ) : (
              <div className={styles.imageBox}>
                {(item?.imageURL || info?.image) && (
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
                        item.thumbnailPath?.length > 10
                          ? `${storageUrl()}/image/${item.thumbnailPath}`
                          : item?.imageURL || info?.image
                      }
                      className={styles.media}
                      alt={item.name}
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
              {item?.name || info?.name}
            </Typography>
          )}
          <div className={styles.alignBottom}>
            {loading || fetching ? (
              <Skeleton width={80} height={20} />
            ) : (
              <Typography component="h4" className={styles.label}>
                {item.items
                  ? `${item.items.length} item${
                      item.items.length > 1 ? 's' : ''
                    }`
                  : `${formatNumber(
                      item?.holderSupply || item?.supply || 1
                    )} of ${formatNumber(item?.supply || 1)}`}
              </Typography>
            )}
            <div className={styles.alignRight}>
              {!loading && (
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
                  {formatNumber(item?.price || 0)} FTM
                </Typography>
              )}
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div style={style} className={styles.root} onClick={onCreate}>
      <div className={styles.card}>
        {create ? (
          <div className={styles.createBtn}>
            <AddIcon className={styles.createIcon} />
          </div>
        ) : item ? (
          <Link
            to={
              item.items
                ? `/bundle/${item._id}`
                : `/explore/${item.contractAddress}/${item.tokenID}`
            }
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
