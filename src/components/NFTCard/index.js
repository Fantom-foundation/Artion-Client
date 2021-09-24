import React, { useState, useEffect, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import { ethers } from 'ethers';
import Skeleton from 'react-loading-skeleton';
import {
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  CheckCircle as CheckCircleIcon,
} from '@material-ui/icons';
import Loader from 'react-loader-spinner';
import Carousel, { Dots } from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';
import axios from 'axios';
import ReactPlayer from 'react-player';

import SuspenseImg from 'components/SuspenseImg';
import BootstrapTooltip from 'components/BootstrapTooltip';
import { formatNumber } from 'utils';
import { useApi } from 'api';
import { useAuctionContract } from 'contracts';
import useTokens from 'hooks/useTokens';

import iconPlus from 'assets/svgs/plus.svg';
import wFTMLogo from 'assets/imgs/wftm.png';

import styles from './styles.module.scss';

const ONE_MIN = 60;
const ONE_HOUR = ONE_MIN * 60;
const ONE_DAY = ONE_HOUR * 24;
const ONE_MONTH = ONE_DAY * 30;

const BaseCard = ({ item, loading, style, create, onCreate, onLike }) => {
  const { storageUrl, likeItem, likeBundle } = useApi();
  const { getAuction } = useAuctionContract();
  const { getTokenByAddress } = useTokens();

  const [now, setNow] = useState(new Date());
  const [fetching, setFetching] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [info, setInfo] = useState(null);
  const [index, setIndex] = useState(0);
  const [isLike, setIsLike] = useState(false);
  const [liked, setLiked] = useState(0);
  const [auction, setAuction] = useState(null);

  const { collections } = useSelector(state => state.Collections);
  const { authToken } = useSelector(state => state.ConnectWallet);

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

  const getCurrentAuction = async () => {
    try {
      const _auction = await getAuction(item.contractAddress, item.tokenID);
      if (_auction.endTime !== 0) {
        const token = getTokenByAddress(_auction.payToken);
        _auction.reservePrice = parseFloat(
          ethers.utils.formatUnits(_auction.reservePrice, token.decimals)
        );
        _auction.token = token;
        setAuction(_auction);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (item && !item.name) {
      getTokenURI(item.tokenURI);
    }
    if (item) {
      setLiked(item.liked);
      if (item.items) {
        setAuction(null);
      } else {
        getCurrentAuction();
      }
    }
  }, [item]);

  useEffect(() => {
    if (item?.isLiked !== undefined) {
      setIsLike(item.isLiked);
    }
  }, [item?.isLiked]);

  useEffect(() => {
    setInterval(() => {
      setNow(new Date());
    }, 1000);
  }, []);

  const auctionStarted = now.getTime() / 1000 >= auction?.startTime;

  const auctionEnded = auction?.endTime <= now.getTime() / 1000;

  const auctionActive = auctionStarted && !auctionEnded;

  const toggleFavorite = async e => {
    e.preventDefault();
    if (isLiking) return;

    setIsLiking(true);
    try {
      if (item.items) {
        const { data } = await likeBundle(item._id, authToken);
        setLiked(data);
      } else {
        const { data } = await likeItem(
          item.contractAddress,
          item.tokenID,
          authToken
        );
        setLiked(data);
      }
    } catch (err) {
      console.log(err);
    }
    setIsLike(!isLike);
    setIsLiking(false);

    onLike && onLike();
  };

  const formatDiff = diff => {
    if (diff >= ONE_MONTH) {
      const m = Math.ceil(diff / ONE_MONTH);
      return `${m} Month${m > 1 ? 's' : ''}`;
    }
    if (diff >= ONE_DAY) {
      const d = Math.ceil(diff / ONE_DAY);
      return `${d} Day${d > 1 ? 's' : ''}`;
    }
    if (diff >= ONE_HOUR) {
      const h = Math.ceil(diff / ONE_HOUR);
      return `${h} Hour${h > 1 ? 's' : ''}`;
    }
    if (diff >= ONE_MIN) {
      const h = Math.ceil(diff / ONE_MIN);
      return `${h} Min${h > 1 ? 's' : ''}`;
    }
    return `${diff} Second${diff > 1 ? 's' : ''}`;
  };

  const formatDuration = endTime => {
    const diff = endTime - Math.floor(now.getTime() / 1000);
    return formatDiff(diff);
  };

  const renderSlides = () => {
    return item.items.map((v, idx) => (
      <div className={styles.imageBox} key={idx}>
        {(v.imageURL || v.thumbnailPath?.length > 10) &&
          (v.imageURL?.includes('youtube') ? (
            <ReactPlayer
              className={styles.media}
              url={v.imageURL}
              controls={true}
              width="100%"
              height="100%"
            />
          ) : (
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
                    ? `${storageUrl}/image/${v.thumbnailPath}`
                    : v.imageURL
                }
                className={styles.media}
                alt={v.name}
              />
            </Suspense>
          ))}
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
        <div className={cx(styles.cardHeader, isLike && styles.liking)}>
          {!item ? (
            <Skeleton width={80} height={20} />
          ) : (
            <>
              {isLike ? (
                <FavoriteIcon
                  className={styles.favIcon}
                  onClick={toggleFavorite}
                />
              ) : (
                <FavoriteBorderIcon
                  className={styles.favIcon}
                  onClick={toggleFavorite}
                />
              )}
              <span className={styles.favLabel}>{liked || 0}</span>
            </>
          )}
        </div>
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
                {(item?.imageURL ||
                  info?.image ||
                  item?.thumbnailPath?.length > 10 ||
                  item?.thumbnailPath === 'embed') &&
                  (item?.thumbnailPath === 'embed' ? (
                    <iframe src={item?.imageURL} className={styles.media} />
                  ) : (item?.imageURL || info?.image)?.includes('youtube') ? (
                    <ReactPlayer
                      className={styles.media}
                      url={item?.imageURL || info?.image}
                      controls={true}
                      width="100%"
                      height="100%"
                    />
                  ) : (
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
                            ? `${storageUrl}/image/${item.thumbnailPath}`
                            : item?.imageURL || info?.image
                        }
                        className={styles.media}
                        alt={item.name}
                      />
                    </Suspense>
                  ))}
              </div>
            )}
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.topLine}>
            <div className={styles.itemName}>
              {loading || fetching ? (
                <Skeleton width={100} height={20} />
              ) : (
                <div className={styles.label}>
                  {collection?.collectionName || collection?.name}
                  {collection?.isVerified && (
                    <BootstrapTooltip
                      title="Verified Collection"
                      placement="top"
                    >
                      <CheckCircleIcon className={styles.checkIcon} />
                    </BootstrapTooltip>
                  )}
                </div>
              )}
              {loading || fetching ? (
                <Skeleton width={100} height={20} />
              ) : (
                <div className={styles.name}>{item?.name || info?.name}</div>
              )}
            </div>
            {auction?.reservePrice || item?.price ? (
              <div className={styles.alignRight}>
                {!loading && (
                  <div className={styles.label}>
                    {auctionActive ? 'Auction' : 'Price'}
                  </div>
                )}
                {loading || fetching ? (
                  <Skeleton width={80} height={20} />
                ) : (
                  <div className={cx(styles.label, styles.price)}>
                    <img
                      src={
                        auctionActive
                          ? auction?.token?.icon
                          : getTokenByAddress(item?.paymentToken)?.icon ||
                            wFTMLogo
                      }
                    />
                    {formatNumber(
                      auctionActive
                        ? auction.reservePrice
                        : item.price.toFixed(2)
                    )}
                  </div>
                )}
              </div>
            ) : (
              ''
            )}
          </div>
          <div className={styles.alignBottom}>
            <div>
              {auctionActive && (
                <>
                  {!loading && <div className={styles.label2}>Time left</div>}
                  <div className={styles.name2}>
                    {formatDuration(auction.endTime)}
                  </div>
                </>
              )}
            </div>
            {item?.lastSalePrice > 0 && (
              <div className={styles.alignRight}>
                {!loading && <div className={styles.label2}>Last Price</div>}
                {loading || fetching ? (
                  <Skeleton width={80} height={20} />
                ) : (
                  <div className={cx(styles.label2, styles.price2)}>
                    <img
                      src={
                        getTokenByAddress(item?.lastSalePricePaymentToken)?.icon
                      }
                    />
                    {formatNumber(item.lastSalePrice)}
                  </div>
                )}
              </div>
            )}
            {/* {loading || fetching ? (
              <Skeleton width={80} height={20} />
            ) : (
              <div className={styles.label}>
                {item.items
                  ? `${item.items.length} item${
                      item.items.length !== 1 ? 's' : ''
                    }`
                  : `${formatNumber(
                      item?.holderSupply || item?.supply || 1
                    )} of ${formatNumber(item?.supply || 1)}`}
              </div>
            )} */}
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
            <div className={styles.createIcon}>
              <img src={iconPlus} />
            </div>
            <div className={styles.createLabel}>Create Bundle</div>
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
