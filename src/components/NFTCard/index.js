import React, { useState, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import Skeleton from 'react-loading-skeleton';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import Loader from 'react-loader-spinner';
import Carousel, { Dots } from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';

import SuspenseImg from 'components/SuspenseImg';

import styles from './styles.module.scss';

const BaseCard = ({ item, loading, style, create, onCreate }) => {
  const [index, setIndex] = useState(0);

  const { collections } = useSelector(state => state.Collections);

  const collection = collections.find(
    col => col.address === item?.contractAddress
  );

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
                  ? `https://storage.artion.io/image/${v.thumbnailPath}`
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
            {loading ? (
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
                  number={3}
                  thumbnails={renderDots()}
                />
              </>
            ) : (
              <div className={styles.imageBox}>
                {item?.imageURL && (
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
                          ? `https://storage.artion.io/image/${item.thumbnailPath}`
                          : item.imageURL
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
          {loading ? (
            <Skeleton width="100%" height={20} />
          ) : (
            <Typography component="h4" className={styles.collection}>
              {collection?.collectionName || collection?.name}
            </Typography>
          )}
          {loading ? (
            <Skeleton width="100%" height={20} />
          ) : (
            <Typography component="h4" className={styles.name}>
              {item?.name}
            </Typography>
          )}
          <div className={styles.alignBottom}>
            {loading ? (
              <Skeleton width={80} height={20} />
            ) : (
              <Typography component="h4" className={styles.label}>
                {item?.holderSupply || item?.supply || 1} of {item?.supply || 1}
              </Typography>
            )}
            <div className={styles.alignRight}>
              {!loading && (
                <Typography component="h4" className={styles.label}>
                  Price
                </Typography>
              )}
              {loading ? (
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
