import React from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';

// import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FantomLogo from '../../assets/svgs/fantom_logo_white_new.svg';
// import AuthManager from '../../components/auth/authmanager';
// import AuthActions from '../auth/authmanager';
import { ethers } from 'ethers';
import WalletConnectActions from '../../actions/walletconnect.actions';

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1,
    background: '#007bff',
    position: 'fixed',
    width: '100%',
    top: 0,
    left: 0,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  logoImg: {
    height: '36px',
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
}));

export default function NiftyHeader() {
  // const history = useHistory();
  const dispatch = useDispatch();

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const isWalletConnected = useSelector(
    state => state.ConnectWallet.isConnected
  );

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

  // const signout = async () => {
  //   handleMenuClose();
  //   try {
  //     let _ifSignedout = AuthManager.signOut();
  //     if (_ifSignedout) {
  //       history.push('/signin');
  //       dispatch(AuthActions.signOut());
  //     } else {
  //       console.log('signout failed');
  //     }
  //   } catch (error) {
  //     console.log('signout failed try catch');
  //   }
  // };
  const connectWallet = async () => {
    await window.ethereum.enable();

    window.ethereum.on('chainChanged', _chainId => {
      dispatch(WalletConnectActions.changeChainId(_chainId));
      console.log('chainid is changed to ', _chainId);
    });
    window.ethereum.on('disconnect', error => {
      dispatch(WalletConnectActions.disconnectWallet());
      console.log('handler for disconnection', error);
    });
    window.ethereum.on('accountsChanged', accounts => {
      if (accounts.length == 0) {
        dispatch(WalletConnectActions.disconnectWallet());
      }
    });

    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let chainId = (await provider.getNetwork()).chainId;
    let signer = provider.getSigner();
    console.log(signer);
    let accounts = await provider.listAccounts();
    let connectedAddress = accounts[0];
    return { connectedAddress, chainId };
  };

  const handleConnectWallet = async () => {
    if (isWalletConnected) {
      dispatch(WalletConnectActions.disconnectWallet());
    } else {
      let { connectedAddress, chainId } = await connectWallet();
      if (connectedAddress) {
        console.log('connected');
        dispatch(WalletConnectActions.connectWallet(chainId));
      }
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
    >
      <MenuItem onClick={handleMenuClose}>Account</MenuItem>
      <MenuItem onClick={handleConnectWallet}>
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
          <AccountCircle />
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
            <img className={classes.logoImg} src={FantomLogo}></img>
          </div>
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
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
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
              <AccountCircle />
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
}
