import React, { useEffect, useState, useRef } from 'react';
import { useHistory, withRouter, NavLink, Link } from 'react-router-dom';
import cx from 'classnames';
import Skeleton from 'react-loading-skeleton';
import { Menu } from '@material-ui/core';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { NoEthereumProviderError } from '@web3-react/injected-connector';
import { ExpandMore, Search as SearchIcon } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { ChainId } from '@sushiswap/sdk';

import WalletConnectActions from 'actions/walletconnect.actions';
import AuthActions from 'actions/auth.actions';
import ModalActions from 'actions/modal.actions';
import { shortenAddress } from 'utils';
import { injected } from 'connectors';
import { useApi } from 'api';
import { NETWORK_LABEL } from 'constants/networks';
import { ADMIN_ADDRESS } from 'constants/index';
import WFTMModal from 'components/WFTMModal';
import ModModal from 'components/ModModal';
import BanCollectionModal from 'components/BanCollectionModal';
import BanItemModal from 'components/BanItemModal';
import BoostCollectionModal from 'components/BoostCollectionModal';
import Identicon from 'components/Identicon';
import toast from 'utils/toast';

import logoWhite from 'assets/svgs/logo_white.svg';
import logoBlue from 'assets/svgs/logo_blue.svg';
import logoSmallWhite from 'assets/svgs/logo_small_white.svg';
import logoSmallBlue from 'assets/svgs/logo_small_blue.svg';
import iconUser from 'assets/svgs/user.svg';
import iconNotification from 'assets/svgs/notification.svg';
import iconAdd from 'assets/svgs/add.svg';
import iconEdit from 'assets/svgs/edit.svg';
import iconSwap from 'assets/svgs/swap.svg';

import styles from './styles.module.scss';

// eslint-disable-next-line no-undef
const ENV = process.env.REACT_APP_ENV;

const NiftyHeader = ({ light }) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const {
    apiUrl,
    storageUrl,
    getAuthToken,
    getAccountDetails,
    getIsModerator,
  } = useApi();
  const { account, chainId, activate } = useWeb3React();

  const { user } = useSelector(state => state.Auth);
  let isSearchbarShown = useSelector(state => state.HeaderOptions.isShown);
  const { isConnected: isWalletConnected, isModerator } = useSelector(
    state => state.ConnectWallet
  );
  const { wftmModalVisible } = useSelector(state => state.Modal);

  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchBarActive, setSearchBarActive] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [modModalVisible, setModModalVisible] = useState(false);
  const [isBan, setIsBan] = useState(false);
  const [banCollectionModalVisible, setBanCollectionModalVisible] = useState(
    false
  );
  const [banItemModalVisible, setBanItemModalVisible] = useState(false);
  const [
    boostCollectionModalVisible,
    setBoostCollectionModalVisible,
  ] = useState(false);

  const [keyword, setKeyword] = useState('');
  const [cancelSource, setCancelSource] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [bundles, setBundles] = useState([]);
  const [tokenDetailsLoading, setTokenDetailsLoading] = useState(false);
  const timer = useRef(null);

  const isMenuOpen = Boolean(anchorEl);

  const login = async () => {
    try {
      setLoading(true);
      const token = await getAuthToken(account);
      const isModerator = await getIsModerator(account);

      dispatch(WalletConnectActions.connectWallet(token, isModerator));
      dispatch(AuthActions.fetchStart());
      try {
        const { data } = await getAccountDetails(token);
        dispatch(AuthActions.fetchSuccess(data));
      } catch {
        dispatch(AuthActions.fetchFailed());
      }
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  const changeNetwork = async () => {
    if (
      (ENV === 'MAINNET' && chainId === ChainId.FANTOM) ||
      (ENV !== 'MAINNET' && chainId === ChainId.FANTOM_TESTNET)
    )
      return;

    history.push('/');

    const params =
      ENV === 'MAINNET'
        ? {
            chainId: '0xfa',
            chainName: 'Fantom Opera',
            nativeCurrency: {
              name: 'Fantom',
              symbol: 'FTM',
              decimals: 18,
            },
            rpcUrls: ['https://rpc.ftm.tools'],
            blockExplorerUrls: ['https://ftmscan.com'],
          }
        : {
            chainId: '0xfa2',
            chainName: 'Fantom Opera Testnet',
            nativeCurrency: {
              name: 'Fantom',
              symbol: 'FTM',
              decimals: 18,
            },
            rpcUrls: ['https://rpc.ftm.tools'],
            blockExplorerUrls: ['https://testnet.ftmscan.com'],
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
    changeNetwork();
    login();
  };

  useEffect(() => {
    if (account) {
      init();
    } else {
      handleSignOut();
    }
  }, [account, chainId]);

  const handleConnectWallet = (showError = true) => {
    console.log('===>', window.ethereum, window.web3.currentProvider);
    activate(injected, undefined, true)
      .then(() => {
        if (account) login();
      })
      .catch(async error => {
        if (error instanceof UnsupportedChainIdError) {
          await activate(injected);
          if (account) login();
        } else if (error instanceof NoEthereumProviderError) {
          if (showError) {
            toast(
              'error',
              'No Wallet Found!',
              'Please install Metamask or Coinbase Wallet on your browser to browse Artion.'
            );
          }
        }
      });
  };

  useEffect(() => {
    if (!isWalletConnected) {
      handleConnectWallet(false);
    }
  }, []);

  const resetResults = () => {
    setAccounts([]);
    setCollections([]);
    setTokens([]);
    setBundles([]);
  };

  useEffect(() => {
    resetResults();
  }, [isSearchbarShown]);

  const search = async word => {
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
      setCancelSource(cancelTokenSource);

      const {
        data: {
          data: { accounts, collections, tokens, bundles },
        },
      } = await axios({
        method: 'post',
        url: `${apiUrl()}/info/searchNames`,
        data: JSON.stringify({ name: word }),
        headers: {
          'Content-Type': 'application/json',
        },
        cancelToken: cancelTokenSource.token,
      });

      setAccounts(accounts);
      setCollections(collections);
      setTokenDetailsLoading(true);
      setTokens(tokens);
      setBundles(bundles);
      setTokenDetailsLoading(false);
    } catch (err) {
      console.log(err);
    } finally {
      setCancelSource(null);
    }
  };

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

  const handleSearch = word => {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = setTimeout(() => search(word), 500);
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

  const goToNotificationSettings = () => {
    history.push(`/settings/notification`);
    handleMenuClose();
  };

  const handleCreateCollection = () => {
    history.push('/collection/create');
    handleMenuClose();
  };

  const handleRegisterCollection = () => {
    history.push('/collection/register');
    handleMenuClose();
  };

  const openWrapStation = () => {
    dispatch(ModalActions.showWFTMModal());
    handleMenuClose();
  };

  const addMod = () => {
    setIsAdding(true);
    setModModalVisible(true);
    handleMenuClose();
  };

  const removeMod = () => {
    setIsAdding(false);
    setModModalVisible(true);
    handleMenuClose();
  };

  const reviewCollections = () => {
    history.push('/collection/review');
    handleMenuClose();
  };

  const banCollection = () => {
    setIsBan(true);
    setBanCollectionModalVisible(true);
    handleMenuClose();
  };

  const unbanCollection = () => {
    setIsBan(false);
    setBanCollectionModalVisible(true);
    handleMenuClose();
  };

  const banItems = () => {
    setBanItemModalVisible(true);
    handleMenuClose();
  };

  const boostCollection = () => {
    setBoostCollectionModalVisible(true);
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
        <div
          className={cx(styles.menuItem, styles.topItem)}
          onClick={goToMyProfile}
        >
          <img src={iconUser} className={styles.menuIcon} />
          My Profile
        </div>
      )}
      <div className={styles.menuItem} onClick={goToNotificationSettings}>
        <img src={iconNotification} className={styles.menuIcon} />
        Notification Settings
      </div>
      <div className={styles.menuItem} onClick={handleCreateCollection}>
        <img src={iconAdd} className={styles.menuIcon} />
        Create New Collection
      </div>
      <div className={styles.menuItem} onClick={handleRegisterCollection}>
        <img src={iconEdit} className={styles.menuIcon} />
        Register Existing Collection
      </div>
      <div className={styles.menuItem} onClick={openWrapStation}>
        <img src={iconSwap} className={styles.menuIcon} />
        FTM / WFTM Station
      </div>
      <div className={styles.menuSeparator} />
      {account?.toLowerCase() === ADMIN_ADDRESS.toLowerCase()
        ? [
            <div key={0} className={styles.menuItem} onClick={addMod}>
              Add Mod
            </div>,
            <div key={1} className={styles.menuItem} onClick={removeMod}>
              Remove Mod
            </div>,
            <div
              key={2}
              className={styles.menuItem}
              onClick={reviewCollections}
            >
              Review Collections
            </div>,
            <div key={3} className={styles.menuItem} onClick={banCollection}>
              Ban Collection
            </div>,
            <div key={4} className={styles.menuItem} onClick={unbanCollection}>
              Unban Collection
            </div>,
            <div key={5} className={styles.menuItem} onClick={banItems}>
              Ban Items
            </div>,
            <div key={6} className={styles.menuItem} onClick={boostCollection}>
              Boost Collection
            </div>,
            <div key={7} className={styles.menuSeparator} />,
          ]
        : isModerator
        ? [
            <div key={1} className={styles.menuItem} onClick={banCollection}>
              Ban Collection
            </div>,
            <div key={2} className={styles.menuItem} onClick={banItems}>
              Ban Items
            </div>,
            <div key={3} className={styles.menuSeparator} />,
          ]
        : null}
      <div className={styles.signOut} onClick={handleSignOut}>
        Sign Out
      </div>
    </Menu>
  );

  const renderSearchBox = () => (
    <div className={cx(styles.searchcont, searchBarActive && styles.active)}>
      <div className={styles.searchcontinner}>
        <div className={styles.searchbar}>
          <SearchIcon className={styles.searchicon} />
          <input
            placeholder="Search items, collections and accounts"
            className={styles.searchinput}
            onChange={e => handleSearch(e.target.value)}
            onFocus={() => setSearchBarActive(true)}
            onBlur={() => setTimeout(() => setSearchBarActive(false), 200)}
          />
        </div>
        {searchBarActive && (
          <div className={styles.resultcont}>
            {collections.length > 0 && (
              <div className={styles.resultsection}>
                <div className={styles.resultsectiontitle}>Collections</div>
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
                <div className={styles.resultsectiontitle}>Accounts</div>
                <div className={styles.separator} />
                <div className={styles.resultlist}>
                  {accounts.map((account, idx) => (
                    <Link
                      to={`/account/${account.address}`}
                      key={idx}
                      className={styles.result}
                    >
                      {account.imageHash ? (
                        <img
                          className={styles.resultimg}
                          src={`https://gateway.pinata.cloud/ipfs/${account.imageHash}`}
                        />
                      ) : (
                        <Identicon
                          className={styles.resultimg}
                          account={account.address}
                          size={40}
                        />
                      )}
                      <div className={styles.resulttitle}>{account.alias}</div>
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
                  {tokens.map((tk, idx) => (
                    <Link
                      to={`/explore/${tk.contractAddress}/${tk.tokenID}`}
                      key={idx}
                      className={styles.result}
                    >
                      <div className={styles.resultimg}>
                        {tokenDetailsLoading ? (
                          <Skeleton width={40} height={40} />
                        ) : (
                          tk.thumbnailPath &&
                          (tk.thumbnailPath.length > 10 ? (
                            <img
                              src={`${storageUrl()}/image/${tk.thumbnailPath}`}
                            />
                          ) : tk.thumbnailPath === '.' ? (
                            <img src={tk.imageURL} />
                          ) : null)
                        )}
                      </div>
                      <div className={styles.resulttitle}>{tk.name}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {bundles.length > 0 && (
              <div className={styles.resultsection}>
                <div className={styles.resultsectiontitle}>Bundles</div>
                <div className={styles.separator} />
                <div className={styles.resultlist}>
                  {bundles.map((bundle, idx) => (
                    <Link
                      to={`/bundle/${bundle._id}`}
                      key={idx}
                      className={styles.result}
                    >
                      <div className={styles.resultimg}></div>
                      <div className={styles.resulttitle}>{bundle.name}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {keyword.length > 0 &&
              collections.length === 0 &&
              accounts.length === 0 &&
              tokens.length === 0 &&
              bundles.length === 0 && (
                <div className={styles.noResults}>No Results</div>
              )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={cx(styles.header, light && styles.lightBg)}>
      <div className={styles.left}>
        <Link to="/" className={styles.logo}>
          <img
            src={light ? logoBlue : logoWhite}
            alt="logo"
            className={styles.logoBig}
          />
          <img
            src={light ? logoSmallBlue : logoSmallWhite}
            alt="logo"
            className={styles.logoSmall}
          />
        </Link>
        {isSearchbarShown && renderSearchBox()}
        <div className={styles.secondmenu}>
          <NavLink
            to="/exploreall"
            className={cx(styles.menuLink, styles.link)}
            activeClassName={styles.active}
            onClick={checkWallet}
          >
            Explore
          </NavLink>
          <NavLink
            to="/create"
            className={cx(styles.menuLink, styles.link)}
            activeClassName={styles.active}
            onClick={checkWallet}
          >
            Create
          </NavLink>
        </div>
      </div>
      <div className={styles.menu}>
        {isSearchbarShown && renderSearchBox()}
        <NavLink
          to="/exploreall"
          className={cx(styles.menuLink, styles.link)}
          activeClassName={styles.active}
          onClick={checkWallet}
        >
          Explore
        </NavLink>
        <NavLink
          to="/create"
          className={cx(styles.menuLink, styles.link)}
          activeClassName={styles.active}
          onClick={checkWallet}
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
        visible={wftmModalVisible}
        onClose={() => dispatch(ModalActions.hideWFTMModal())}
      />
      <ModModal
        isAdding={isAdding}
        visible={modModalVisible}
        onClose={() => setModModalVisible(false)}
      />
      <BanCollectionModal
        visible={banCollectionModalVisible}
        isBan={isBan}
        onClose={() => setBanCollectionModalVisible(false)}
      />
      <BanItemModal
        visible={banItemModalVisible}
        onClose={() => setBanItemModalVisible(false)}
      />
      <BoostCollectionModal
        visible={boostCollectionModalVisible}
        onClose={() => setBoostCollectionModalVisible(false)}
      />
    </div>
  );
};

export default withRouter(NiftyHeader);
