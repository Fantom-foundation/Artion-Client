import React, { useEffect, useRef, useState, Suspense } from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';
import { ClipLoader } from 'react-spinners';
import Modal from '@material-ui/core/Modal';
import Skeleton from 'react-loading-skeleton';
import Loader from 'react-loader-spinner';

import SuspenseImg from 'components/SuspenseImg';
import { createBundle } from 'api';
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
  const rootRef = useRef(null);

  const selected = useRef([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [creating, setCreating] = useState(false);

  const { authToken } = useSelector(state => state.ConnectWallet);
  const { price: ftmPrice } = useSelector(state => state.Price);

  useEffect(() => {
    if (visible) {
      selected.current = [];
      setName('');
      setPrice('');
    }
  }, [visible]);

  const isValid = () => {
    return name && price && selected.current.length;
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

  const onCreate = async () => {
    if (creating) return;

    try {
      setCreating(true);

      const selectedItems = [];
      for (let i = 0; i < selected.current.length; i++) {
        const item = items[selected.current[i]];
        selectedItems.push({
          address: item.contractAddress,
          tokenID: item.tokenID,
          supply: item?.holderSupply || item?.supply || 1,
        });
      }
      await createBundle(name, parseFloat(price), selectedItems, authToken);
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
          <div className={styles.formGroup}>
            <p className={styles.formLabel}>Name</p>
            <div className={styles.formInputCont}>
              <input
                type="text"
                className={styles.formInput}
                maxLength={20}
                placeholder="Bundle Name"
                value={name}
                onChange={e => setName(e.target.value)}
                disabled={creating}
              />
            </div>
            <div className={styles.lengthIndicator}>{name.length}/20</div>
          </div>
          <div className={styles.formGroup}>
            <div className={styles.formLabel}>Price</div>
            <div className={styles.formInputCont}>
              <input
                className={styles.formInput}
                placeholder="0.00"
                value={price}
                onChange={e =>
                  setPrice(isNaN(e.target.value) ? price : e.target.value)
                }
                disabled={creating}
              />
              <div className={styles.usdPrice}>
                ${((parseFloat(price) || 0) * ftmPrice).toFixed(2)}
              </div>
            </div>
          </div>
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
              onClick={isValid() ? onCreate : null}
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
        </div>
      </Modal>
    </div>
  );
};

export default NewBundleModal;
