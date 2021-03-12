import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { register } from './styles';
import Paper from '@material-ui/core/Paper';
import Image from 'material-ui-image';

import AdsCarousel from '../../components/AdsCarousel';
import NFTCarousel from '../../components/NFTCarousel';
import FInfiniteLoader from '../../components/InfiniteLoader';

import BackgroundSeaImage from '../../assets/imgs/sea-background.jpeg';

const LandingPage = ({ classes }) => {
  return (
    <div className={classes.main}>
      <Paper className={classes.paper}>
        <div className={classes.text}>
          <span className={classes.largeFont}>The largest NFT marketplace</span>
          <span className={classes.smallFont}>
            Buy, Sell and Discover rare digital assets
          </span>
        </div>
        <Image src={BackgroundSeaImage} className={classes.image}></Image>
      </Paper>
      <AdsCarousel className={classes.carouselContainer}></AdsCarousel>
      <NFTCarousel></NFTCarousel>
      <FInfiniteLoader></FInfiniteLoader>
    </div>
  );
};

export default withStyles(register)(LandingPage);
