import React, { useEffect, useRef, useState, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import { ClipLoader } from 'react-spinners';
import Modal from '@material-ui/core/Modal';
import Skeleton from 'react-loading-skeleton';
import Loader from 'react-loader-spinner';

import SuspenseImg from 'components/SuspenseImg';
import AuthActions from 'actions/auth.actions';
import { updateAccountDetails } from 'api';
import toast from 'utils/toast';
import axios from 'axios';

import styles from './styles.module.scss';

const NFTItem = ({ item, loading, selected, onClick }) => {
  const [fetching, setFetching] = useState(false);
  const [info, setInfo] = useState(null);

  const getTokenURI = async tokenURI => {
    setFetching(true);
    try {
      const { data } = await axios.get(tokenURI);
      setInfo(data);
    } catch {
      setInfo(null);
    }
    setFetching(false);
  };

  useEffect(() => {
    if (item) {
      getTokenURI(item.tokenURI);
    }
  }, [item]);

  return (
    <div
      className={cx(styles.item, selected && styles.selected)}
      onClick={onClick}
    >
      <div className={styles.imageBox}>
        {loading || fetching ? (
          <Skeleton
            width="100%"
            height="100%"
            className={styles.mediaLoading}
          />
        ) : (
          info?.image && (
            <Suspense
              fallback={
                <Loader
                  type="Oval"
                  color="#007BFF"
                  height={32}
                  width={32}
                  className={styles.loader}
                />
              }
            >
              <SuspenseImg
                src={
                  item.thumbnailPath?.startsWith('https')
                    ? item.thumbnailPath
                    : info.image
                }
                className={styles.media}
                alt={info?.name}
              />
            </Suspense>
          )
        )}
      </div>
      <div className={styles.itemName}>{item.name}</div>
    </div>
  );
};

const NewBundleModal = ({ visible, onClose, items, onLoadNext }) => {
  const dispatch = useDispatch();

  const rootRef = useRef(null);

  const selected = useRef([]);
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);

  const { authToken } = useSelector(state => state.ConnectWallet);

  useEffect(() => {
    if (visible) {
      selected.current = [];
      setStep(0);
      setName('');
      setDescription('');
    }
  }, [visible]);

  const isValid = () => {
    if (step === 0) return name;
    return true;
  };

  const closeModal = () => {
    onClose();
  };

  const handleScroll = e => {
    const obj = e.currentTarget;
    if (obj.scrollHeight - obj.clientHeight - obj.scrollTop < 100) {
      onLoadNext();
    }
  };

  const handleItemClick = idx => {
    const index = selected.current.indexOf(idx);
    if (index > -1) {
      selected.current.splice(index, 1);
    } else {
      selected.current.push(idx);
    }
  };

  const onNext = () => setStep(1);

  const onSave = async () => {
    if (creating) return;

    try {
      setCreating(true);

      const res = await updateAccountDetails(name, description, authToken);
      dispatch(AuthActions.fetchSuccess(res.data));
      toast('success', 'Account details saved!');
      setCreating(false);

      closeModal();
    } catch {
      setCreating(false);
    }
  };

  const onCancel = () => {
    closeModal();
  };

  if (!visible) return null;

  return (
    <div className={styles.root} ref={rootRef}>
      <Modal open className={styles.modal} container={() => rootRef.current}>
        <div className={styles.paper}>
          <h2 className={styles.title}>Create Bundle</h2>
          {step === 0 ? (
            <>
              <div className={styles.formGroup}>
                <p className={styles.formLabel}>Name</p>
                <input
                  type="text"
                  className={styles.formInput}
                  maxLength={20}
                  placeholder="Bundle Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  disabled={creating}
                />
                <div className={styles.lengthIndicator}>{name.length}/20</div>
              </div>
              <div className={styles.formGroup}>
                <p className={styles.formLabel}>Description</p>
                <textarea
                  className={cx(styles.formInput, styles.longInput)}
                  maxLength={120}
                  placeholder="Bundle Description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  disabled={creating}
                />
                <div className={styles.lengthIndicator}>
                  {description.length}/120
                </div>
              </div>

              <div className={styles.footer}>
                <div
                  className={cx(
                    styles.button,
                    styles.save,
                    (creating || !isValid()) && styles.disabled
                  )}
                  onClick={isValid() ? onNext : null}
                >
                  {creating ? <ClipLoader color="#FFF" size={16} /> : 'Next'}
                </div>

                <div
                  className={cx(
                    styles.button,
                    styles.cancel,
                    creating && styles.disabled
                  )}
                  onClick={!creating ? onCancel : null}
                >
                  Cancel
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={styles.formGroup}>
                <p className={styles.formLabel}>Items</p>
                <div className={styles.itemList} onScroll={handleScroll}>
                  {items.map((item, idx) => (
                    <NFTItem
                      key={idx}
                      item={item}
                      onClick={() => handleItemClick(idx)}
                      selected={selected.current.indexOf(idx) > -1}
                    />
                  ))}
                </div>
              </div>

              <div className={styles.footer}>
                <div
                  className={cx(
                    styles.button,
                    styles.save,
                    (creating || !isValid()) && styles.disabled
                  )}
                  onClick={isValid() ? onSave : null}
                >
                  {creating ? <ClipLoader color="#FFF" size={16} /> : 'Create'}
                </div>

                <div
                  className={cx(
                    styles.button,
                    styles.cancel,
                    creating && styles.disabled
                  )}
                  onClick={!creating ? onCancel : null}
                >
                  Cancel
                </div>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default NewBundleModal;
