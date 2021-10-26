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

import umansExample from 'assets/imgs/umans_example.png';
import logo from 'assets/svgs/logo_white.svg';
import fantomLogo from 'assets/svgs/fantom_logo_white.svg';
import card1 from 'assets/svgs/card1.svg';
import card2 from 'assets/svgs/card2.svg';
import card3 from 'assets/svgs/card3.svg';
import card4 from 'assets/svgs/card4.svg';
import search from 'assets/svgs/magnifier.svg';

import styles from './styles.module.scss';

const cards = [
  {
    icon: card1,
    title: 'Easy Connect',
    description:
      'Using Metamask or CoinBase Wallet. Just click "Connect Wallet" on the top right to start.',
    path: '/',
  },
  {
    icon: card2,
    title: 'Super Fast',
    description:
      'Since Artion runs on the Fantom Opera Network, transactions are usually confirmed within 1-2 seconds.',
    path: '/',
  },
  {
    icon: card3,
    title: 'Low Transaction Fees',
    description:
      'Transactions are usually just a few cents, allowing users to create and trade many NFTs without prohibitively high network fees.',
    path: '/',
  },
  {
    icon: card4,
    title: 'Zero Platform Fees',
    description:
      'Trade NFTs via auction or direct offer without any fees taken by Artion.',
    path: '/explore',
  },
];

const LandingPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(HeaderActions.toggleSearchbar(false));
    dispatch(FilterActions.updateCategoryFilter(null));
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
            <div
              className={styles.title}
            >{`Trade without platform fees on Artion`}</div>
            <div className={styles.subtitle}>
              Artion is an NFT marketplace built on Fantom. Create and trade
              NFTs instantly with low network costs.
            </div>
            <div className={styles.subtitle}>
              <strong>
                Warning: This is a beta version. Use at your own caution.
              </strong>
            </div>

            <Link to="/explore" className={styles.exploreButton}>
              Explore
            </Link>
          </div>
          <div className={styles.card}>
            <div className={styles.cardMedia}>
              <img src={umansExample} />
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div className={styles.cardInfo}>
                <div className={styles.cardCategory}>Shamanka: The Healer</div>
                <div className={styles.cardName}>{'World of Umans'}</div>
              </div>
              <Link
                to="/explore/0x972dd206a7c2d4ae46db1db700bc79de1bc59960/0"
                className={styles.exploreButton}
                style={{ margin: '0 24px' }}
              >
                Go to auction
              </Link>
            </div>
          </div>
        </div>
        <div className={styles.about}>
          <div className={styles.aboutInner}>
            <div className={styles.aboutTitle}>Why Artion</div>
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
          <a
            style={{ textDecoration: 'none', color: '#FFFFFF' }}
            target="_blank"
            rel="noopener noreferrer"
            href="https://app.termly.io/document/privacy-policy/7db4b9fc-aa5d-4f80-bfa1-27120ff982ba"
          >
            Privacy Policy
          </a>
          <a
            style={{ textDecoration: 'none', color: '#FFFFFF' }}
            target="_blank"
            rel="noopener noreferrer"
            href="https://app.termly.io/document/cookie-policy/c79f1a78-08a2-4da2-85f0-846a461cde81"
          >
            Cookie Policy
          </a>
          <a
            style={{ textDecoration: 'none', color: '#FFFFFF' }}
            target="_blank"
            rel="noopener noreferrer"
            href="https://app.termly.io/document/terms-of-use-for-online-marketplace/1f69b33f-65ba-40d9-bf63-b28e357f7c34"
          >
            Terms of Service
          </a>
          <a
            href="https://fantom.foundation/"
            target="_blank"
            rel="noopener noreferrer
            noreferrer"
          >
            <img src={fantomLogo} alt="fantom-logo" className={styles.logo} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
