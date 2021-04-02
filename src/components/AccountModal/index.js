import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import PublishIcon from '@material-ui/icons/Publish';

import ModalActions from '../../actions/modal.actions';

const useStyles = makeStyles({
  root: {
    position: 'fixed',
    width: '100vw',
    height: '100vh',
    top: 0,
    left: 0,
    zIndex: 9,
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
    padding: '64px 48px 48px',
    borderRadius: 20,
    boxSizing: 'border-box',
    backgroundColor: '#fff',
    outline: 'none',
    boxShadow: '0 0 30px rgba(0, 0, 0, 0.4)',
    color: '#333',
  },
  title: {
    fontSize: 32,
    margin: 0,
    marginBottom: 32,
  },
  formGroup: {
    marginBottom: 24,
  },
  formLabel: {
    margin: '0 0 12px',
    fontSize: 21,
    fontWeight: 600,
  },
  formInput: {
    width: '100%',
    outline: 'none',
    height: 40,
    borderRadius: 8,
    border: '1px solid #bbb',
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
    justifyContent: 'space-evenly',
  },
  button: {
    width: '140px',
    height: '40px',
    fontSize: 'large',
    backgroundColor: '#007bff',
  },
  avatarBox: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 100,
    border: '1px solid #bbb',
    overflow: 'hidden',
  },
  avatar: {
    width: 'calc(100% + 2px)',
    height: 'calc(100% + 2px)',
    objectFit: 'cover',
    marginTop: -1,
    marginLeft: -1,
  },
  upload: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    borderRadius: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity ease 200ms',
    cursor: 'pointer',

    '&:hover': {
      opacity: 1,
    },
  },
  uploadIcon: {
    width: 40,
    height: 40,
  },
});

const AccountModal = () => {
  const dispatch = useDispatch();

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

  useEffect(() => {
    if (accountModalVisible) {
      setAlias('');
      setEmail('');
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

  const onSave = () => {
    closeModal();
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
              <img src={avatar} className={classes.avatar} />
              <div
                className={classes.upload}
                onClick={() => inputRef.current?.click()}
              >
                <PublishIcon className={classes.uploadIcon} />
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
            />
          </div>

          <div className={classes.footer}>
            <Button
              variant="contained"
              color="primary"
              component="span"
              className={classes.button}
              onClick={onSave}
              disabled={!validate()}
            >
              Save
            </Button>

            <Button
              variant="contained"
              color="primary"
              component="span"
              className={classes.button}
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
