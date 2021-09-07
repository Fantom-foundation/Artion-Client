import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { Categories } from 'constants/filter.constants';
import HeaderActions from 'actions/header.actions';
import Header from 'components/header';
import toast from 'utils/toast';

import fantomLogo from 'assets/svgs/fantom_logo_white.svg';
import card1 from 'assets/svgs/card1.svg';
import card2 from 'assets/svgs/card2.svg';
import card3 from 'assets/svgs/card3.svg';
import card4 from 'assets/svgs/card4.svg';

import styles from './styles.module.scss';

const cards = [
  {
    icon: card1,
    title: 'Set up your wallet',
    description:
      'Once you’ve set up your wallet of choice, connect it to OpenSea by clicking the wallet icon in the top right corner. Learn about the wallets we support.',
  },
  {
    icon: card2,
    title: 'Create a collection',
    description:
      'Once you’ve set up your wallet of choice, connect it to OpenSea by clicking the wallet icon in the top right corner. Learn about the wallets we support.',
  },
  {
    icon: card3,
    title: 'Add your NFTs',
    description:
      'Once you’ve set up your wallet of choice, connect it to OpenSea by clicking the wallet icon in the top right corner. Learn about the wallets we support.',
  },
  {
    icon: card4,
    title: 'List them for sale',
    description:
      'Once you’ve set up your wallet of choice, connect it to OpenSea by clicking the wallet icon in the top right corner. Learn about the wallets we support.',
  },
];

const LandingPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(HeaderActions.toggleSearchbar(false));
  }, []);

  const checkWallet = e => {
    if (!window.ethereum) {
      toast(
        'error',
        'No Wallet Found!',
        'Please install Metamask or Coinbase Wallet on your browser to browse Artion.'
      );
      e.preventDefault();
    }
  };

  const renderAboutCard = (key, icon, title, desc) => (
    <div className={styles.aboutCard} key={key}>
      <div className={styles.cardIconWrapper}>
        <img src={icon} />
      </div>
      <div className={styles.cardTitle}>{title}</div>
      <div className={styles.cardDesc}>{desc}</div>
    </div>
  );

  const renderCategoryCard = (key, icon, label, extra = false) => (
    <div className={styles.categoryCard} key={key}>
      <div className={styles.cardIconWrapper2}>
        <img src={icon} />
      </div>
      <div className={cx(styles.cardLabelWrapper, extra && styles.extraCard)}>
        <div className={styles.cardLabel}>{label}</div>
        <div className={styles.browseBtn}>
          <ChevronRightIcon className={styles.browseBtnIcon} />
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.body}>
        <div className={styles.main}>
          <div className={styles.mainLeft}>
            <div className={styles.title}>The largest NFT marketplace</div>
            <div className={styles.subtitle}>
              Create, Buy, Sell and Discover rare digital assets
            </div>
            <Link
              to="/exploreall"
              className={styles.exploreButton}
              onClick={checkWallet}
            >
              Explore
            </Link>
          </div>
          <div className={styles.card}>
            <div className={styles.cardMedia}>
              <img src={fantomLogo} />
            </div>
            <div className={styles.cardInfo}>
              <div className={styles.cardCategory}>Ancestral Umans</div>
              <div className={styles.cardName}>Shamanka - The Healer</div>
            </div>
          </div>
        </div>
        <div className={styles.about}>
          <div className={styles.aboutInner}>
            <div className={styles.aboutTitle}>Create and Sell your NFTs</div>
            <div className={styles.aboutCards}>
              {cards.map((card, key) =>
                renderAboutCard(key, card.icon, card.title, card.description)
              )}
            </div>
            <div className={styles.aboutTitle}>Browse by category</div>
            <div className={styles.categories}>
              {Categories.map(cat =>
                renderCategoryCard(cat.id, cat.icon, cat.label)
              )}
              {renderCategoryCard(
                'all',
                Categories[0].icon,
                'Explore All NFTs',
                true
              )}
            </div>
          </div>
        </div>
        <div className={styles.footer}>Footer</div>
      </div>
    </div>
  );
};

export default LandingPage;
