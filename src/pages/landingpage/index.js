import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { Categories } from 'constants/filter.constants';
import HeaderActions from 'actions/header.actions';
import FilterActions from 'actions/filter.actions';
import Header from 'components/header';

import example from 'assets/imgs/example.png';
import logo from 'assets/svgs/logo_white.svg';
import card1 from 'assets/svgs/card1.svg';
import card2 from 'assets/svgs/card2.svg';
import card3 from 'assets/svgs/card3.svg';
import card4 from 'assets/svgs/card4.svg';
import search from 'assets/svgs/search.svg';

import styles from './styles.module.scss';

const cards = [
  {
    icon: card1,
    title: 'Set up your wallet',
    description:
      'Once you’ve set up your wallet of choice, connect it to Artion by clicking the wallet icon in the top right corner. Learn about the wallets we support.',
    path: '/',
  },
  {
    icon: card2,
    title: 'Create a collection',
    description:
      'Once you’ve connected your wallet with Artion you can create a new collection.',
    path: '/collection/create',
  },
  {
    icon: card3,
    title: 'Add your NFTs',
    description: 'Or create new NFTs',
    path: '/create',
  },
  {
    icon: card4,
    title: 'List them for sale',
    description: 'Or list your NFTs for sale',
    path: '/explore',
  },
];

const LandingPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(HeaderActions.toggleSearchbar(false));
  }, []);

  const handleViewCategory = id => {
    dispatch(FilterActions.updateCategoryFilter(id === 'all' ? null : id));
    history.push('/explore');
  };

  const renderAboutCard = (key, icon, title, desc, path) => (
    <div className={styles.aboutCard} key={key}>
      <NavLink to={path} className={styles.aboutCardLink}>
        <div className={styles.cardIconWrapper}>
          <img src={icon} />
        </div>
        <div className={styles.cardTitle}>{title}</div>
        <div className={styles.cardDesc}>{desc}</div>
      </NavLink>
    </div>
  );

  const renderCategoryCard = (key, icon, label, extra = false) => (
    <div
      className={styles.categoryCard}
      key={key}
      onClick={() => handleViewCategory(key)}
    >
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
            <Link to="/explore" className={styles.exploreButton}>
              Explore
            </Link>
          </div>
          <div className={styles.card}>
            <div className={styles.cardMedia}>
              <img src={example} />
            </div>
            <div className={styles.cardInfo}>
              <div className={styles.cardCategory}>ZooCoin Community NFT</div>
              <div className={styles.cardName}>
                {'Fountain "Farroupilha" Park'}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.about}>
          <div className={styles.aboutInner}>
            <div className={styles.aboutTitle}>Create and Sell your NFTs</div>
            <div className={styles.aboutCards}>
              {cards.map((card, key) =>
                renderAboutCard(
                  key,
                  card.icon,
                  card.title,
                  card.description,
                  card.path
                )
              )}
            </div>
            <div className={styles.aboutTitle}>Browse by category</div>
            <div className={styles.categories}>
              {Categories.map(cat =>
                renderCategoryCard(cat.id, cat.icon, cat.label)
              )}
              {renderCategoryCard('all', search, 'Explore All NFTs', true)}
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <img src={logo} alt="logo" className={styles.logo} />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
