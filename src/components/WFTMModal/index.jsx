import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';
import { ethers } from 'ethers';
import { ClipLoader } from 'react-spinners';
import { useWeb3React } from '@web3-react/core';
import Skeleton from 'react-loading-skeleton';
import SwapVertIcon from '@material-ui/icons/SwapVert';
import toast from 'react-hot-toast';

import { getWFTMBalance, wrapFTM, unwrapFTM } from 'contracts';
import showToast from 'utils/toast';

import styles from './styles.module.scss';

const WFTMModal = ({ visible, onClose }) => {
  const { account } = useWeb3React();

  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [wrappedBalance, setWrappedBalance] = useState(0);
  const [confirming, setConfirming] = useState(false);
  const [wrap, setWrap] = useState(true);
  const [amount, setAmount] = useState('');

  const { price } = useSelector(state => state.Price);

  const getBalances = async () => {
    setLoading(true);

    await window.ethereum.enable();
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    let [ftmBal, wftmBal] = await Promise.all([
      await provider.getBalance(account),
      await getWFTMBalance(account),
    ]);
    setBalance(parseFloat(ftmBal.toString()) / 10 ** 18);
    setWrappedBalance(parseFloat(wftmBal.toString()) / 10 ** 18);

    setLoading(false);
  };

  useEffect(() => {
    if (visible) {
      setLoading(false);
      setConfirming(false);
      setWrap(true);
      setAmount('');
      getBalances();
    }
  }, [visible]);

  const handleClick = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  const parseBalance = bal => {
    return bal.toFixed(4);
  };

  const isMax = () => {
    if (wrap) {
      return amount === (balance - 0.01).toString();
    }
    return amount === wrappedBalance.toString();
  };

  const onMax = () => {
    if (wrap) {
      setAmount((balance - 0.01).toString());
    } else {
      setAmount(wrappedBalance.toString());
    }
  };

  const handleWrapFTM = async () => {
    if (confirming || loading) return;

    setConfirming(true);
    try {
      const price = ethers.utils.parseEther(amount);
      if (wrap) {
        const tx = await wrapFTM(price, account);
        await tx.wait();
        const toastId = showToast(
          'success',
          'Wrapped FTM successfully!',
          '',
          () => {
            toast.dismiss(toastId);
            window.open(`https://ftmscan.com/tx/${tx.hash}`, '_blank');
          }
        );
      } else {
        const tx = await unwrapFTM(price);
        await tx.wait();
        const toastId = showToast(
          'success',
          'Unwrap W-FTM successfully!',
          '',
          () => {
            toast.dismiss(toastId);
            window.open(`https://ftmscan.com/tx/${tx.hash}`, '_blank');
          }
        );
      }
      setAmount('');
    } catch (err) {
      console.log(err);
    } finally {
      setConfirming(false);
    }
    getBalances();
  };

  return (
    <div
      className={cx(styles.container, visible ? styles.visible : null)}
      onClick={onClose}
    >
      <div className={styles.modal} onClick={handleClick}>
        <div className={styles.header}>
          <div className={styles.title}>FTM / WFTM Station</div>
        </div>

        <div className={styles.body}>
          <div className={cx(styles.swapContainer, !wrap && styles.reverse)}>
            <div className={styles.swapBox}>
              <div className={styles.symbol}>FTM</div>
              <div className={styles.swapBoxInner}>
                <div className={styles.balance}>
                  Balance:{' '}
                  {loading ? (
                    <Skeleton width={60} height={20} />
                  ) : (
                    parseBalance(balance)
                  )}
                  {wrap && !isMax() && !loading && balance > 0 && (
                    <div className={styles.max} onClick={onMax}>
                      (Max)
                    </div>
                  )}
                </div>
                <div className={styles.rightBox}>
                  <input
                    className={styles.input}
                    placeholder="0.0"
                    value={amount}
                    onChange={e =>
                      setAmount(isNaN(e.target.value) ? amount : e.target.value)
                    }
                  />
                  <div className={styles.usdVal}>
                    ${((parseFloat(amount) || 0) * price).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.swapbtn} onClick={() => setWrap(!wrap)}>
              <SwapVertIcon className={styles.icon} />
            </div>
            <div className={styles.swapBox}>
              <div className={styles.symbol}>WFTM</div>
              <div className={styles.swapBoxInner}>
                <div className={styles.balance}>
                  Balance:{' '}
                  {loading ? (
                    <Skeleton width={60} height={20} />
                  ) : (
                    parseBalance(wrappedBalance)
                  )}
                  {!wrap && !isMax() && !loading && balance > 0 && (
                    <div className={styles.max} onClick={onMax}>
                      (Max)
                    </div>
                  )}
                </div>
                <div className={styles.rightBox}>
                  <input
                    className={styles.input}
                    placeholder="0.0"
                    value={amount}
                    onChange={e =>
                      setAmount(isNaN(e.target.value) ? amount : e.target.value)
                    }
                  />
                  <div className={styles.usdVal}>
                    ${((parseFloat(amount) || 0) * price).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <div
            className={cx(
              styles.listButton,
              (confirming ||
                loading ||
                amount.length === 0 ||
                parseFloat(amount) === 0 ||
                parseFloat(amount) >
                  (wrap ? balance - 0.01 : wrappedBalance)) &&
                styles.disabled
            )}
            onClick={() =>
              amount.length &&
              parseFloat(amount) > 0 &&
              parseFloat(amount) <= (wrap ? balance - 0.01 : wrappedBalance) &&
              handleWrapFTM()
            }
          >
            {confirming || loading ? (
              <ClipLoader color="#FFF" size={16} />
            ) : wrap ? (
              'Wrap'
            ) : (
              'Unwrap'
            )}
          </div>
          <div
            className={cx(styles.cancelButton, confirming && styles.disabled)}
            onClick={!confirming && onClose}
          >
            Cancel
          </div>
        </div>
      </div>
    </div>
  );
};

export default WFTMModal;
