import React from 'react';
import Button from '@material-ui/core/Button';
import ImageIcon from '@material-ui/icons/Image';
import DnsIcon from '@material-ui/icons/Dns';
import PublicIcon from '@material-ui/icons/Public';
import CardGiftcardIcon from '@material-ui/icons/CardGiftcard';
import CollectionsIcon from '@material-ui/icons/Collections';
import SportsTennisIcon from '@material-ui/icons/SportsTennis';
import BuildIcon from '@material-ui/icons/Build';
import FiberNewIcon from '@material-ui/icons/FiberNew';

import './styles.css';

const ExploreHeader = () => {
  return (
    <div className="exploreBodyRoot">
      <Button
        variant="contained"
        color="default"
        className="exploreBodyButton"
        startIcon={<ImageIcon />}
      >
        Art
      </Button>
      <Button
        variant="contained"
        color="default"
        className="exploreBodyButton"
        startIcon={<DnsIcon />}
      >
        Domain Names
      </Button>
      <Button
        variant="contained"
        color="default"
        className="exploreBodyButton"
        startIcon={<PublicIcon />}
      >
        Virtual Worlds
      </Button>
      <Button
        variant="contained"
        color="default"
        className="exploreBodyButton"
        startIcon={<CardGiftcardIcon />}
      >
        Trading Cards
      </Button>
      <Button
        variant="contained"
        color="default"
        className="exploreBodyButton"
        startIcon={<CollectionsIcon />}
      >
        Collectibles
      </Button>
      <Button
        variant="contained"
        color="default"
        className="exploreBodyButton"
        startIcon={<SportsTennisIcon />}
      >
        Sports
      </Button>
      <Button
        variant="contained"
        color="default"
        className="exploreBodyButton"
        startIcon={<BuildIcon />}
      >
        Utility
      </Button>
      <Button
        variant="contained"
        color="default"
        className="exploreBodyButton"
        startIcon={<FiberNewIcon />}
      >
        New
      </Button>
    </div>
  );
};

export default ExploreHeader;
