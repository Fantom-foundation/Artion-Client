import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import { ClipLoader } from 'react-spinners';
import Modal from '@material-ui/core/Modal';
import CreateIcon from '@material-ui/icons/Create';

import ModalActions from 'actions/modal.actions';
import AuthActions from 'actions/auth.actions';
import { useApi } from 'api';
import toast from 'utils/toast';

import styles from './styles.module.scss';

const AccountModal = () => {
  const { updateAccountDetails } = useApi();
  const dispatch = useDispatch();

  const { fetching, user } = useSelector(state => state.Auth);

  const rootRef = useRef(null);
  const inputRef = useRef(null);

  const [alias, setAlias] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [saving, setSaving] = useState(false);

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
      setEmailError(null);
    }
  }, [accountModalVisible]);

  const validEmail = email => /(.+)@(.+){2,}\.(.+){2,}/.test(email);

  const validateEmail = () => {
    if (email.length === 0 || validEmail(email)) {
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

  const isValid = emailError === null;

  const closeModal = () => {
    dispatch(ModalActions.hideAccountModal());
  };

  const clipImage = (image, clipX, clipY, clipWidth, clipHeight, cb) => {
    const CANVAS_SIZE = 128;
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
    if (saving) return;

    try {
      setSaving(true);

      if (!avatar || avatar.startsWith('https')) {
        const res = await updateAccountDetails(
          alias,
          email,
          bio,
          avatar,
          authToken
        );
        dispatch(AuthActions.fetchSuccess(res.data));
        toast('success', 'Account details saved!');
        setSaving(false);

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
            toast('success', 'Account details saved!');
            setSaving(false);

            closeModal();
          });
        };
        img.src = avatar;
      }
    } catch {
      setSaving(false);
    }
  };

  const onCancel = () => {
    closeModal();
  };

  if (!accountModalVisible) return null;

  return (
    <div className={styles.root} ref={rootRef}>
      <Modal open className={styles.modal} container={() => rootRef.current}>
        <div className={styles.paper}>
          <h2 className={styles.title}>Account Settings</h2>
          <div className={styles.formGroup}>
            <p className={styles.formLabel}>User Avatar</p>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileSelect}
            />
            <div className={styles.avatarBox}>
              {avatar && <img src={avatar} className={styles.avatar} />}
              <div
                className={styles.upload}
                onClick={() => !fetching && inputRef.current?.click()}
              >
                <CreateIcon className={styles.uploadIcon} />
              </div>
            </div>
          </div>
          <div className={styles.formGroup}>
            <p className={styles.formLabel}>Name</p>
            <input
              type="text"
              className={styles.formInput}
              maxLength={20}
              placeholder="Enter Username"
              value={alias}
              onChange={e => setAlias(e.target.value)}
              disabled={fetching}
            />
            <div className={styles.lengthIndicator}>{alias.length}/20</div>
          </div>
          <div className={styles.formGroup}>
            <p className={styles.formLabel}>Email Address</p>
            <input
              type="text"
              className={cx(
                styles.formInput,
                emailError !== null ? styles.hasError : null
              )}
              placeholder="Enter Email Address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onBlur={validateEmail}
              disabled={fetching}
            />
            {emailError !== null && (
              <p className={styles.error}>{emailError}</p>
            )}
          </div>
          <div className={styles.formGroup}>
            <p className={styles.formLabel}>Bio</p>
            <textarea
              className={cx(styles.formInput, styles.longInput)}
              maxLength={120}
              placeholder="Bio"
              value={bio}
              onChange={e => setBio(e.target.value)}
              disabled={fetching}
            />
            <div className={styles.lengthIndicator}>{bio.length}/120</div>
          </div>

          <div className={styles.footer}>
            <div
              className={cx(
                styles.button,
                styles.save,
                (saving || !isValid) && styles.disabled
              )}
              onClick={isValid ? onSave : null}
            >
              {saving ? <ClipLoader color="#FFF" size={16} /> : 'Save'}
            </div>

            <div
              className={cx(
                styles.button,
                styles.cancel,
                saving && styles.disabled
              )}
              onClick={!saving ? onCancel : null}
            >
              Cancel
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AccountModal;
