import React, { useEffect, useState } from 'react';
import { useHistory, withRouter, NavLink, Link } from 'react-router-dom';
import cx from 'classnames';
import Skeleton from 'react-loading-skeleton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { ExpandMore, Search as SearchIcon } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import WalletConnectActions from 'actions/walletconnect.actions';
import AuthActions from 'actions/auth.actions';
import ModalActions from 'actions/modal.actions';
import { shortenAddress } from 'utils';
import { injected } from 'connectors';
import { getAuthToken, getAccountDetails } from 'api';
import { NETWORK_LABEL } from 'constants/networks';
import WFTMModal from 'components/WFTMModal';
import Identicon from 'components/Identicon';

import logoWhite from 'assets/svgs/logo_white.svg';
import logoBlue from 'assets/svgs/logo_blue.svg';
import iconUser from 'assets/svgs/user.svg';
import iconSettings from 'assets/svgs/settings.svg';
import iconAdd from 'assets/svgs/add.svg';
import iconSwap from 'assets/svgs/swap.svg';
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
  const [loading, setLoading] = useState(false);
  const [searchBarActive, setSearchBarActive] = useState(false);

  const [keyword, setKeyword] = useState('');
  const [cancelSource, setCancelSource] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [tokens, setTokens] = useState([]);

  const isMenuOpen = Boolean(anchorEl);

  const login = async () => {
    const token = await getAuthToken(account);

    dispatch(WalletConnectActions.connectWallet(token));
    dispatch(AuthActions.fetchStart());
    try {
      setLoading(true);
      const { data } = await getAccountDetails(token);
      dispatch(AuthActions.fetchSuccess(data));
    } catch {
      dispatch(AuthActions.fetchFailed());
    }
    setLoading(false);
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
      setTimeout(handleConnectWallet, 100);
    } catch (error) {
      console.log(error);
    }
  };

  const init = () => {
    if (isWalletConnected) return;

    changeNetwork();
    login();
  };

  useEffect(() => {
    if (account) {
      init();
    } else {
      handleSignOut();
    }
  }, [account]);

  const handleConnectWallet = () => {
    activate(injected, undefined, true)
      .then(() => {
        if (account) login();
      })
      .catch(async error => {
        if (error instanceof UnsupportedChainIdError) {
          await activate(injected);
          if (account) login();
        }
      });
  };

  useEffect(() => {
    if (isWalletConnected) return;

    handleConnectWallet();
  }, []);

  const resetResults = () => {
    setAccounts([]);
    setCollections([]);
    setTokens([]);
  };

  useEffect(() => {
    resetResults();
  }, [isSearchbarShown]);

  const handleSearch = async word => {
    setKeyword(word);

    if (cancelSource) {
      cancelSource.cancel();
    }

    if (word.length === 0) {
      resetResults();

      return;
    }

    try {
      const cancelTokenSource = axios.CancelToken.source();

      const promise = axios({
        method: 'post',
        url: `https://api1.artion.io/info/searchNames`,
        data: JSON.stringify({ name: word }),
        headers: {
          'Content-Type': 'application/json',
        },
        cancelToken: cancelTokenSource.token,
      });

      setCancelSource(cancelTokenSource);

      const {
        data: {
          data: { accounts, collections, tokens },
        },
      } = await promise;

      setAccounts(accounts);
      setCollections(collections);
      setTokens(tokens);

      setCancelSource(null);
    } catch (err) {
      console.log(err);
    }
  };

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
          My Items
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
        <img src={iconSwap} className={styles.menuIcon} />
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
        <Link to="/" className={styles.logo}>
          <img src={light ? logoBlue : logoWhite} alt="logo" />
        </Link>
        {isSearchbarShown && (
          <div
            className={cx(styles.searchcont, searchBarActive && styles.active)}
          >
            <div className={styles.searchcontinner}>
              <div className={styles.searchbar}>
                <SearchIcon className={styles.searchicon} />
                <input
                  placeholder="Search"
                  className={styles.searchinput}
                  onChange={e => handleSearch(e.target.value)}
                  onFocus={() => setSearchBarActive(true)}
                  onBlur={() =>
                    setTimeout(() => setSearchBarActive(false), 200)
                  }
                />
              </div>
              {searchBarActive && (
                <div className={styles.resultcont}>
                  {collections.length > 0 && (
                    <div className={styles.resultsection}>
                      <div className={styles.resultsectiontitle}>
                        Collections
                      </div>
                      <div className={styles.separator} />
                      <div className={styles.resultlist}>
                        {collections.map((collection, idx) => (
                          <div key={idx} className={styles.result}>
                            <img
                              className={styles.resultimg}
                              src={`https://gateway.pinata.cloud/ipfs/${collection.logoImageHash}`}
                            />
                            <div className={styles.resulttitle}>
                              {collection.collectionName}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {accounts.length > 0 && (
                    <div className={styles.resultsection}>
                      <div className={styles.resultsectiontitle}>Account</div>
                      <div className={styles.separator} />
                      <div className={styles.resultlist}>
                        {accounts.map((account, idx) => (
                          <Link
                            to={`/account/${account.address}`}
                            key={idx}
                            className={styles.result}
                          >
                            <img
                              className={styles.resultimg}
                              src={`https://gateway.pinata.cloud/ipfs/${account.imageHash}`}
                            />
                            <div className={styles.resulttitle}>
                              {account.alias}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  {tokens.length > 0 && (
                    <div className={styles.resultsection}>
                      <div className={styles.resultsectiontitle}>Items</div>
                      <div className={styles.separator} />
                      <div className={styles.resultlist}>
                        {tokens.map((_, idx) => (
                          <div key={idx} className={styles.result}>
                            <img
                              className={styles.resultimg}
                              src="https://gateway.pinata.cloud/ipfs/QmSrHp7nzX5agJNGnrmEJE9MrY7t27fSRV9a27GzgkkbqM"
                            />
                            <div className={styles.resulttitle}>Bull Ther</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {keyword.length > 0 &&
                    collections.length === 0 &&
                    accounts.length === 0 &&
                    tokens.length === 0 && (
                      <div className={styles.noResults}>No Results</div>
                    )}
                </div>
              )}
            </div>
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
            {loading ? (
              <Skeleton className={styles.avatar} />
            ) : user.imageHash ? (
              <img
                src={`https://gateway.pinata.cloud/ipfs/${user.imageHash}`}
                width="24"
                height="24"
                className={styles.avatar}
              />
            ) : (
              <Identicon
                account={account}
                size={36}
                className={styles.avatar}
              />
            )}
            <div className={styles.profile}>
              <div className={styles.address}>
                {loading ? (
                  <Skeleton width={120} />
                ) : (
                  user.alias || shortenAddress(account)
                )}
              </div>
              <div className={styles.network}>
                {loading ? <Skeleton width={80} /> : NETWORK_LABEL[chainId]}
              </div>
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
