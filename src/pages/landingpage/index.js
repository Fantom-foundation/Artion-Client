import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { register } from './styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';

import AdsCarousel from '../../components/AdsCarousel';
// import NFTCarousel from '../../components/NFTCarousel';
// import FInfiniteLoader from '../../components/InfiniteLoader';

// import Image from 'material-ui-image';
// import BackgroundSeaImage from '../../assets/imgs/sea-background.jpeg';

const LandingPage = ({ classes }) => {
  const history = useHistory();

  const goToCreate = () => {
    history.push('/create');
  };
  const goToExplore = () => {};
  return (
    <div className={classes.main}>
      <Paper className={classes.paper}>
        <div className={classes.text}>
          <span className={classes.largeFont}>
            The largest NFT marketplace on Fantom
          </span>
          <span className={classes.smallFont}>
            Buy, Sell and Discover rare digital assets
          </span>
        </div>
        {/* <Image src={BackgroundSeaImage} className={classes.image}></Image> */}
      </Paper>
      <AdsCarousel className={classes.carouselContainer}></AdsCarousel>
      <div className={classes.buttonsContainer}>
        <Button
          variant="contained"
          color="primary"
          component="span"
          className={classes.landingPageButton}
          onClick={goToExplore}
        >
          Explore
        </Button>
        <Button
          variant="contained"
          color="primary"
          component="span"
          className={classes.landingPageButton}
          onClick={goToCreate}
        >
          Create
        </Button>
      </div>
      {/* <NFTCarousel></NFTCarousel> */}
      {/* <FInfiniteLoader></FInfiniteLoader> */}
    </div>
  );
};

export default withStyles(register)(LandingPage);
