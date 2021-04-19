import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import CreateIcon from '@material-ui/icons/Create';

import ModalActions from '../../actions/modal.actions';
import AuthActions from 'actions/auth.actions';
import { updateAccountDetails } from 'api';

const useStyles = makeStyles({
  root: {
    position: 'fixed',
    width: '100vw',
    height: '100vh',
    top: 0,
    left: 0,
    zIndex: 1000,
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    width: '60%',
    maxWidth: 800,
    minWidth: 400,
    padding: 50,
    borderRadius: 25,
    boxSizing: 'border-box',
    backgroundColor: '#fff',
    outline: 'none',
    boxShadow: '0 0 8px rgba(0, 0, 0, 0.15)',
    color: '#333',
  },
  title: {
    fontSize: 36,
    margin: '0 0 30px',
  },
  formGroup: {
    marginBottom: 25,
  },
  formLabel: {
    margin: '0 0 10px',
    fontSize: 18,
    fontWeight: 500,
  },
  formInput: {
    width: '100%',
    outline: 'none',
    height: 40,
    borderRadius: 5,
    border: 'none',
    backgroundColor: '#FAFAFA',
    padding: '8px 12px',
    boxSizing: 'border-box',
    fontSize: 16,

    '&:focus': {
      boxShadow: '0 0 8px rgba(0, 0, 0, 0.3)',
    },
  },
  longInput: {
    resize: 'none',
    height: 100,
  },
  hasError: {
    border: '1px solid rgb(235, 87, 87)',
  },
  error: {
    margin: '6px 0 0 6px',
    color: 'rgb(235, 87, 87)',
  },
  footer: {
    display: 'flex',
    justifyContent: 'center',
  },
  button: {
    width: '140px',
    height: '40px',
    fontSize: 'large',
    backgroundColor: '#007bff',
    boxShadow: 'none',
  },
  save: {
    backgroundColor: '#007BFF',
    color: '#FFF',
    marginRight: 45,
  },
  cancel: {
    backgroundColor: '#FFF',
    border: '1px solid #007BFF',
    color: '#007BFF',
  },
  avatarBox: {
    position: 'relative',
    width: 100,
    height: 100,
    backgroundColor: '#F7F7F7',
    borderRadius: 100,
    border: '1px solid #8C8C8C',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: '100%',
    objectFit: 'cover',
  },
  upload: {
    position: 'absolute',
    width: 37,
    height: 37,
    bottom: 4,
    right: -4,
    border: '1px solid #939393',
    borderRadius: '100%',
    backgroundColor: '#FFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  uploadIcon: {
    width: 24,
    height: 24,
    color: '#007BFF',
  },
});

const AccountModal = () => {
  const dispatch = useDispatch();

  const { fetching, user } = useSelector(state => state.Auth);

  const classes = useStyles();
  const rootRef = useRef(null);
  const inputRef = useRef(null);

  const [alias, setAlias] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [aliasError, setAliasError] = useState(null);
  const [emailError, setEmailError] = useState(null);

  const { accountModalVisible } = useSelector(state => state.Modal);
  const { authToken } = useSelector(state => state.ConnectWallet);

  useEffect(() => {
    if (accountModalVisible) {
      if (user.imageHash) {
        setAvatar(`https://gateway.pinata.cloud/ipfs/${user.imageHash}`);
      } else {
        setAvatar(null);
      }
      setAlias(user.alias || '');
      setEmail(user.email || '');
      setBio(user.bio || '');
      setAliasError(null);
      setEmailError(null);
    }
  }, [accountModalVisible]);

  const validAlias = alias => {
    return alias.length > 0 && alias.length <= 20 && alias.indexOf(' ') === -1;
  };

  const validEmail = email => /(.+)@(.+){2,}\.(.+){2,}/.test(email);

  const validateAlias = () => {
    if (alias.length === 0) {
      return setAliasError('This field is required');
    }
    if (!validAlias(alias)) {
      return setAliasError('Invalid username.');
    }
    setAliasError(null);
  };

  const validateEmail = () => {
    if (email.length === 0) {
      return setEmailError('This field is required');
    }
    if (validEmail(email)) {
      setEmailError(null);
    } else {
      setEmailError('Invalid email address.');
    }
  };

  const handleFileSelect = e => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];

      const reader = new FileReader();

      reader.onload = function(e) {
        setAvatar(e.target.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    return avatar && validEmail(email) && validAlias(alias);
  };

  const closeModal = () => {
    dispatch(ModalActions.hideAccountModal());
  };

  const clipImage = (image, clipX, clipY, clipWidth, clipHeight, cb) => {
    const CANVAS_SIZE = Math.max(Math.min(512, clipWidth), 128);
    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(
      image,
      clipX,
      clipY,
      clipWidth,
      clipHeight,
      0,
      0,
      CANVAS_SIZE,
      CANVAS_SIZE
    );
    cb(canvas.toDataURL());
  };

  const onSave = async () => {
    if (avatar.startsWith('https')) {
      const res = await updateAccountDetails(
        alias,
        email,
        bio,
        avatar,
        authToken
      );
      dispatch(AuthActions.fetchSuccess(res.data));

      closeModal();
    } else {
      const img = new Image();
      img.onload = function() {
        const w = this.width;
        const h = this.height;
        const size = Math.min(w, h);
        const x = (w - size) / 2;
        const y = (h - size) / 2;
        clipImage(img, x, y, size, size, async data => {
          const res = await updateAccountDetails(
            alias,
            email,
            bio,
            data,
            authToken
          );
          dispatch(AuthActions.fetchSuccess(res.data));

          closeModal();
        });
      };
      img.src = avatar;
    }
  };

  const onCancel = () => {
    closeModal();
  };

  if (!accountModalVisible) return null;

  return (
    <div className={classes.root} ref={rootRef}>
      <Modal open className={classes.modal} container={() => rootRef.current}>
        <div className={classes.paper}>
          <h2 className={classes.title}>Account Settings</h2>
          <div className={classes.formGroup}>
            <p className={classes.formLabel}>User Avatar</p>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileSelect}
            />
            <div className={classes.avatarBox}>
              {avatar && <img src={avatar} className={classes.avatar} />}
              <div
                className={classes.upload}
                onClick={() => inputRef.current?.click()}
              >
                <CreateIcon className={classes.uploadIcon} />
              </div>
            </div>
          </div>
          <div className={classes.formGroup}>
            <p className={classes.formLabel}>Username</p>
            <input
              type="text"
              className={cx(
                classes.formInput,
                aliasError !== null ? classes.hasError : null
              )}
              placeholder="Enter Username"
              value={alias}
              onChange={e => setAlias(e.target.value)}
              onBlur={validateAlias}
              disabled={fetching}
            />
            {aliasError !== null && (
              <p className={classes.error}>{aliasError}</p>
            )}
          </div>
          <div className={classes.formGroup}>
            <p className={classes.formLabel}>Email Address</p>
            <input
              type="text"
              className={cx(
                classes.formInput,
                emailError !== null ? classes.hasError : null
              )}
              placeholder="Enter Email Address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onBlur={validateEmail}
              disabled={fetching}
            />
            {emailError !== null && (
              <p className={classes.error}>{emailError}</p>
            )}
          </div>
          <div className={classes.formGroup}>
            <p className={classes.formLabel}>Bio</p>
            <textarea
              className={cx(classes.formInput, classes.longInput)}
              placeholder="Bio"
              value={bio}
              onChange={e => setBio(e.target.value)}
              disabled={fetching}
            />
          </div>

          <div className={classes.footer}>
            <Button
              variant="contained"
              color="primary"
              component="span"
              className={cx(classes.button, classes.save)}
              onClick={onSave}
              disabled={!validate()}
            >
              Save
            </Button>

            <Button
              variant="contained"
              color="primary"
              component="span"
              className={cx(classes.button, classes.cancel)}
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AccountModal;
