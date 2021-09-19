import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { ClipLoader } from 'react-spinners';
import Select from 'react-dropdown-select';
import Skeleton from 'react-loading-skeleton';
import { ethers } from 'ethers';

import { formatNumber } from 'utils';
import useTokens from 'hooks/useTokens';
import { useSalesContract } from 'contracts';
import PriceInput from 'components/PriceInput';

import Modal from '../Modal';
import styles from '../Modal/common.module.scss';
import InputError from '../InputError';

const BidModal = ({
  visible,
  onClose,
  onPlaceBid,
  minBidAmount,
  confirming,
  token,
}) => {
  const { tokens } = useTokens();
  const { getSalesContract } = useSalesContract();
  const [currentBid, setCurrentBid] = useState(0);
  const [price, setPrice] = useState('');
  const [focused, setFocused] = useState(false);
  const [options, setOptions] = useState([]);
  const [tokenPrice, setTokenPrice] = useState();
  const [tokenPriceInterval, setTokenPriceInterval] = useState();
  const [inputError, setInputError] = useState(null);

  useEffect(() => {
    setPrice(minBidAmount);
    setCurrentBid(parseFloat(minBidAmount));
  }, [visible]);

  useEffect(() => {
    if (tokens?.length) {
      setOptions(tokens);
    }
  }, [tokens]);

  const getTokenPrice = () => {
    if (tokenPriceInterval) clearInterval(tokenPriceInterval);
    const func = async () => {
      const tk = token.address || ethers.constants.AddressZero;
      try {
        const salesContract = await getSalesContract();
        const price = await salesContract.getPrice(tk);
        setTokenPrice(parseFloat(ethers.utils.formatUnits(price, 18)));
      } catch {
        setTokenPrice(null);
      }
    };
    func();
    setTokenPriceInterval(setInterval(func, 60 * 1000));
  };

  useEffect(() => {
    if (token) {
      getTokenPrice();
    }
  }, [token]);

  const validateInput = () => {
    return (
      price.length > 0 &&
      parseFloat(price) > 0 &&
      parseFloat(price) > currentBid
    );
  };

  return (
    <Modal
      visible={visible}
      title="Place Bid"
      onClose={onClose}
      submitDisabled={confirming || !validateInput() || inputError}
      submitLabel={confirming ? <ClipLoader color="#FFF" size={16} /> : 'Place'}
      onSubmit={() =>
        !confirming && validateInput() ? onPlaceBid(price) : null
      }
    >
      <div className={styles.formGroup}>
        <div className={styles.formLabel}>Price</div>
        <div className={cx(styles.formInputCont, focused && styles.focused)}>
          <Select
            options={options}
            disabled
            values={token ? [token] : []}
            className={styles.select}
            placeholder=""
            itemRenderer={({ item, itemIndex, methods }) => (
              <div
                key={itemIndex}
                className={styles.token}
                onClick={() => {
                  methods.clearAll();
                  methods.addItem(item);
                }}
              >
                <img src={item?.icon} className={styles.tokenIcon} />
                <div className={styles.tokenSymbol}>{item.symbol}</div>
              </div>
            )}
            contentRenderer={({ props: { values } }) =>
              values.length > 0 ? (
                <div className={styles.selectedToken}>
                  <img src={values[0]?.icon} className={styles.tokenIcon} />
                  <div className={styles.tokenSymbol}>{values[0].symbol}</div>
                </div>
              ) : (
                <div className={styles.selectedToken} />
              )
            }
          />
          <PriceInput
            className={styles.formInput}
            placeholder="0.00"
            decimals={token?.decimals || 0}
            value={'' + price}
            onChange={setPrice}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={confirming}
            onInputError={err => setInputError(err)}
          />
          <div className={styles.usdPrice}>
            {!isNaN(tokenPrice) && tokenPrice !== null ? (
              `$${formatNumber(
                ((parseFloat(price) || 0) * tokenPrice).toFixed(2)
              )}`
            ) : (
              <Skeleton width={100} height={24} />
            )}
          </div>
        </div>
        <InputError text={inputError} />
      </div>
    </Modal>
  );
};

export default BidModal;
