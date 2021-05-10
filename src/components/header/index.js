import React, { useEffect, useState } from 'react';
import { useHistory, withRouter, NavLink, Link } from 'react-router-dom';
import cx from 'classnames';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import {
  AccountCircle,
  ExpandMore,
  Search as SearchIcon,
} from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';

import WalletConnectActions from 'actions/walletconnect.actions';
import AuthActions from 'actions/auth.actions';
import ModalActions from 'actions/modal.actions';
import General from 'utils/general';
import { shortenAddress } from 'utils';
import { injected } from 'connectors';
import { getAccountDetails } from 'api';
import { NETWORK_LABEL } from 'constants/networks';
import WFTMModal from 'components/WFTMModal';

import logoWhite from 'assets/svgs/fantom_logo_white.svg';
import logoBlue from 'assets/svgs/fantom_logo.svg';
import iconUser from 'assets/svgs/user.svg';
import iconSettings from 'assets/svgs/settings.svg';
import iconAdd from 'assets/svgs/add.svg';
import iconExit from 'assets/svgs/exit.svg';

import styles from './styles.module.scss';

const NiftyHeader = ({ light }) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { account, chainId, activate } = useWeb3React();

  const { user } = useSelector(state => state.Auth);
  let isSearchbarShown = useSelector(state => state.HeaderOptions.isShown);
  const { isConnected: isWalletConnected } = useSelector(
    state => state.ConnectWallet
  );

  const [stationModalVisible, setStationModalVisible] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);

  const login = async () => {
    const token = await General.getAuthToken(account);

    dispatch(WalletConnectActions.connectWallet(token));
    dispatch(AuthActions.fetchStart());
    try {
      const { data } = await getAccountDetails(token);
      dispatch(AuthActions.fetchSuccess(data));
    } catch {
      dispatch(AuthActions.fetchFailed());
    }
  };

  const changeNetwork = async () => {
    if (chainId === 250) return;

    const params = {
      chainId: '0xfa',
      chainName: 'Fantom',
      nativeCurrency: {
        name: 'Fantom',
        symbol: 'FTM',
        decimals: 18,
      },
      rpcUrls: ['https://rpc.fantom.network'],
      blockExplorerUrls: ['https://ftmscan.com'],
    };

    const provider = await injected.getProvider();
    try {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [params],
      });
      handleConnectWallet();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (account) {
      changeNetwork();
      login();
    }
  }, [account]);

  const handleConnectWallet = () => {
    activate(injected, undefined, true)
      .then(() => {})
      .catch(async error => {
        if (error instanceof UnsupportedChainIdError) {
          await activate(injected);
        }
      });
  };

  useEffect(() => {
    handleConnectWallet();
  }, []);

  const handleSignOut = () => {
    dispatch(WalletConnectActions.disconnectWallet());
    dispatch(AuthActions.signOut());
    handleMenuClose();
  };

  const handleProfileMenuOpen = e => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const goToMyProfile = () => {
    history.push(`/account/${account}`);
    handleMenuClose();
  };

  const openAccountSettings = () => {
    dispatch(ModalActions.showAccountModal());
    handleMenuClose();
  };

  const handleCreateCollection = () => {
    history.push('/collection/create');
    handleMenuClose();
  };

  const openWrapStation = () => {
    setStationModalVisible(true);
    handleMenuClose();
  };

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      classes={{
        paper: styles.profilemenu,
        list: styles.menuList,
      }}
    >
      {isWalletConnected && (
        <MenuItem
          classes={{ root: cx(styles.menuItem, styles.topItem) }}
          onClick={goToMyProfile}
        >
          <img src={iconUser} className={styles.menuIcon} />
          My Profile
        </MenuItem>
      )}
      <MenuItem
        classes={{ root: cx(styles.menuItem, styles.topItem) }}
        onClick={openAccountSettings}
      >
        <img src={iconSettings} className={styles.menuIcon} />
        Account Settings
      </MenuItem>
      <MenuItem
        classes={{ root: styles.menuItem }}
        onClick={handleCreateCollection}
      >
        <img src={iconAdd} className={styles.menuIcon} />
        Create Collection
      </MenuItem>
      <MenuItem classes={{ root: styles.menuItem }} onClick={openWrapStation}>
        <img src={iconAdd} className={styles.menuIcon} />
        FTM / WFTM Station
      </MenuItem>
      <div className={styles.menuSeparator} />
      <MenuItem classes={{ root: styles.menuItem }} onClick={handleSignOut}>
        <img src={iconExit} className={styles.menuIcon} />
        Sign Out
      </MenuItem>
    </Menu>
  );

  return (
    <div className={cx(styles.header, light && styles.lightBg)}>
      <div className={styles.left}>
        <Link to="/">
          <img
            src={light ? logoBlue : logoWhite}
            alt="logo"
            className={styles.logo}
          />
        </Link>
        {isSearchbarShown && (
          <div className={styles.searchbar}>
            <SearchIcon className={styles.searchicon} />
            <input placeholder="Search" className={styles.searchinput} />
          </div>
        )}
      </div>
      <div className={styles.menu}>
        <NavLink
          to="/exploreall"
          className={styles.menuLink}
          activeClassName={styles.active}
        >
          Explore
        </NavLink>
        <NavLink
          to="/create"
          className={styles.menuLink}
          activeClassName={styles.active}
        >
          Create
        </NavLink>
        {isWalletConnected ? (
          <div
            className={cx(styles.account, styles.menuLink)}
            onClick={handleProfileMenuOpen}
          >
            {user.imageHash ? (
              <img
                src={`https://gateway.pinata.cloud/ipfs/${user.imageHash}`}
                width="24"
                height="24"
                className={styles.avatar}
              />
            ) : (
              <AccountCircle className={styles.avatar} />
            )}
            <div className={styles.profile}>
              <div className={styles.address}>
                {user.alias || shortenAddress(account)}
              </div>
              <div className={styles.network}>{NETWORK_LABEL[chainId]}</div>
            </div>

            <ExpandMore
              className={cx(styles.expand, isMenuOpen && styles.expanded)}
            />
          </div>
        ) : (
          <div
            className={cx(styles.connect, styles.menuLink)}
            onClick={handleConnectWallet}
          >
            Connect Wallet
          </div>
        )}
      </div>
      {renderMenu}
      <WFTMModal
        visible={stationModalVisible}
        onClose={() => setStationModalVisible(false)}
      />
    </div>
  );
};

export default withRouter(NiftyHeader);
