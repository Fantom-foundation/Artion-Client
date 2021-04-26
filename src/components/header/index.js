import React, { useEffect } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import cx from 'classnames';
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import {
  AccountCircle,
  Mail as MailIcon,
  Notifications as NotificationsIcon,
  More as MoreIcon,
  Search as SearchIcon,
  Warning as WarningIcon,
} from '@material-ui/icons';
import InputBase from '@material-ui/core/InputBase';
import { useDispatch, useSelector } from 'react-redux';
import FantomLogo from '../../assets/svgs/fantom_logo_white_new.svg';
import { ethers } from 'ethers';
import WalletConnectActions from '../../actions/walletconnect.actions';
import AuthActions from 'actions/auth.actions';
import ModalActions from '../../actions/modal.actions';
import { abbrAddress } from '../../utils';
import HeaderActions from '../../actions/header.actions';
import General from '../../utils/general';
import { getAccountDetails } from 'api';

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1,
    background: '#007bff',
    position: 'fixed',
    width: '100%',
    top: 0,
    left: 0,
    zIndex: 2,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  menu: {
    top: '72px !important',
    padding: 25,
    borderRadius: '8px !important',
  },
  menuList: {
    padding: 0,
  },
  menuItem: {
    padding: 0,
    fontSize: 18,
    lineHeight: '22px',
    color: '#8C8C8C',

    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  topItem: {
    marginBottom: 20,
  },
  menuSeparator: {
    width: '100%',
    height: 0.5,
    backgroundColor: '#8C8C8C',
    margin: '15px 0',
  },
  logoImg: {
    height: '36px',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(12),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '48ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    marginLeft: 'auto',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  address: {
    paddingTop: 2,
    marginRight: 10,
    display: 'flex',
    alignItems: 'center',
  },
  wrongNetwork: {
    display: 'flex',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#dc3545',
    padding: '0 15px',
    borderRadius: 6,
  },
  wrongIcon: {
    marginRight: 10,
  },
  avatar: {
    borderRadius: '50%',
  },
}));

const NiftyHeader = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  useEffect(() => {
    connect();
  }, []);

  const goToHomepage = () => {
    dispatch(HeaderActions.toggleSearchbar(false));
    history.push('/');
  };

  const { user } = useSelector(state => state.Auth);
  const { isConnected: isWalletConnected, chainId } = useSelector(
    state => state.ConnectWallet
  );
  let isSearchbarShown = useSelector(state => state.HeaderOptions.isShown);
  const address = useSelector(state => state.ConnectWallet.address);

  const handleProfileMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = event => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const connectWallet = async () => {
    await window.ethereum.enable();

    window.ethereum.on('chainChanged', _chainId => {
      const chainId = parseInt(_chainId);
      dispatch(WalletConnectActions.changeChainId(chainId));
      console.log('chainid is changed to ', chainId);
    });
    window.ethereum.on('disconnect', error => {
      dispatch(WalletConnectActions.disconnectWallet());
      dispatch(AuthActions.signOut());
      console.log('handler for disconnection', error);
    });
    window.ethereum.on('accountsChanged', accounts => {
      if (accounts.length == 0) {
        dispatch(WalletConnectActions.disconnectWallet());
        dispatch(AuthActions.signOut());
      }
    });

    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let chainId = (await provider.getNetwork()).chainId;
    if (chainId !== 250) {
      const params = {
        chainId: '0xfa',
        chainName: 'Fantom',
        nativeCurrency: {
          name: 'Fantom',
          symbol: 'FTM',
          decimals: 18,
        },
        rpcUrls: ['https://rpcapi.fantom.network'],
        blockExplorerUrls: ['https://ftmscan.com'],
      };

      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [params],
      });
      await window.ethereum.enable();
      provider = new ethers.providers.Web3Provider(window.ethereum);
      chainId = (await provider.getNetwork()).chainId;
    }
    let signer = provider.getSigner();
    console.log(signer);
    let accounts = await provider.listAccounts();
    let connectedAddress = accounts[0];
    // get auth token here & store

    let token = await General.getAuthToken(connectedAddress);
    console.log(token);
    return { connectedAddress, chainId, token };
  };

  const goToMyProfile = () => {
    history.push(`/account/${address}`);
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

  const connect = async () => {
    let { connectedAddress, chainId, token } = await connectWallet();
    if (connectedAddress) {
      console.log('connected');
      dispatch(
        WalletConnectActions.connectWallet(chainId, connectedAddress, token)
      );

      dispatch(AuthActions.fetchStart());
      try {
        const { data } = await getAccountDetails(token);
        dispatch(AuthActions.fetchSuccess(data));
      } catch {
        dispatch(AuthActions.fetchFailed());
      }
    }
  };

  const handleConnectWallet = () => {
    if (isWalletConnected) {
      dispatch(WalletConnectActions.disconnectWallet());
      dispatch(AuthActions.signOut());
    } else {
      connect();
    }
    handleMenuClose();
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      classes={{
        paper: classes.menu,
        list: classes.menuList,
      }}
    >
      {isWalletConnected && (
        <MenuItem
          classes={{ root: cx(classes.menuItem, classes.topItem) }}
          onClick={goToMyProfile}
        >
          My Profile
        </MenuItem>
      )}
      <MenuItem
        classes={{ root: cx(classes.menuItem, classes.topItem) }}
        onClick={openAccountSettings}
      >
        Account Settings
      </MenuItem>
      <MenuItem
        classes={{ root: classes.menuItem }}
        onClick={handleCreateCollection}
      >
        Create Collection
      </MenuItem>
      <div className={classes.menuSeparator} />
      <MenuItem
        classes={{ root: classes.menuItem }}
        onClick={handleConnectWallet}
      >
        {isWalletConnected ? 'Sign Out' : 'Sign In'}
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          {user.imageHash ? (
            <img src={`https://gateway.pinata.cloud/ipfs/${user.imageHash}`} />
          ) : (
            <AccountCircle />
          )}
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <div>
            <img
              className={classes.logoImg}
              src={FantomLogo}
              onClick={goToHomepage}
            ></img>
          </div>
          {isSearchbarShown && (
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search items ..."
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'search' }}
              />
            </div>
          )}
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            {isWalletConnected ? (
              chainId === 250 ? (
                <div className={classes.address}>{abbrAddress(address)}</div>
              ) : (
                <div className={classes.wrongNetwork}>
                  <WarningIcon className={classes.wrongIcon} />
                  Wrong Network
                </div>
              )
            ) : null}
            <IconButton aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={0} color="secondary">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton aria-label="show 17 new notifications" color="inherit">
              <Badge badgeContent={0} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              {user.imageHash ? (
                <img
                  src={`https://gateway.pinata.cloud/ipfs/${user.imageHash}`}
                  width="24"
                  height="24"
                  className={classes.avatar}
                />
              ) : (
                <AccountCircle />
              )}
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
};

export default withRouter(NiftyHeader);
