import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { ClipLoader } from 'react-spinners';
import Select from 'react-dropdown-select';
import Skeleton from 'react-loading-skeleton';
import axios from 'axios';

import { formatNumber } from 'utils';
import { FTM_TOTAL_SUPPLY } from 'constants/index';
import useTokens from 'hooks/useTokens';

import Modal from '../Modal';
import styles from '../Modal/common.module.scss';

const SellModal = ({
  visible,
  onClose,
  onSell,
  startPrice,
  confirming,
  approveContract,
  contractApproving,
  contractApproved,
  totalSupply,
}) => {
  const { tokens } = useTokens();

  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [focused, setFocused] = useState(false);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [tokenPrice, setTokenPrice] = useState();
  const [tokenPriceInterval, setTokenPriceInterval] = useState();

  useEffect(() => {
    setPrice(startPrice > 0 ? startPrice.toString() : '');
    setQuantity('1');
    if (visible && tokens?.length) {
      setSelected([tokens[0]]);
    }
  }, [visible]);

  useEffect(() => {
    if (tokens?.length) {
      setOptions(tokens);
    }
  }, [tokens]);

  const getTokenPrice = () => {
    if (tokenPriceInterval) clearInterval(tokenPriceInterval);
    const func = async () => {
      let tk = selected[0].symbol.toLowerCase();
      if (!tk.includes('ftm')) {
        tk = selected[0].address;
      }
      try {
        const { data } = await axios.get(
          `https://oapi.fantom.network/pricefeed/${tk}`
        );
        setTokenPrice(data.price);
      } catch {
        setTokenPrice(null);
      }
    };
    func();
    setTokenPriceInterval(setInterval(func, 60 * 1000));
  };

  useEffect(() => {
    if (selected.length === 0) return;

    getTokenPrice();
  }, [selected]);

  const handleQuantityChange = e => {
    const val = e.target.value;
    if (!val) {
      setQuantity('');
      return;
    }

    if (isNaN(val)) return;

    const _quantity = parseInt(val);
    setQuantity(Math.min(_quantity, totalSupply));
  };

  const handleSellItem = () => {
    let quant = 1;
    if (totalSupply > 1) {
      quant = parseInt(quantity);
    }
    onSell(price, quant);
  };

  const validateInput = () => {
    if (price.length === 0) return false;
    if (totalSupply > 1 && quantity.length === 0) return false;
    return true;
  };

  return (
    <Modal
      visible={visible}
      title={startPrice > 0 ? 'Update Your Listing' : 'Sell Your Item'}
      onClose={onClose}
      submitDisabled={
        contractApproving ||
        confirming ||
        (contractApproved && !validateInput())
      }
      submitLabel={
        contractApproved ? (
          confirming ? (
            <ClipLoader color="#FFF" size={16} />
          ) : startPrice > 0 ? (
            'Update Price'
          ) : (
            'List Item'
          )
        ) : contractApproving ? (
          'Approving Item'
        ) : (
          'Approve Item'
        )
      }
      onSubmit={() =>
        contractApproved
          ? !confirming && validateInput()
            ? handleSellItem()
            : null
          : approveContract()
      }
    >
      <div className={styles.formGroup}>
        <div className={styles.formLabel}>Price</div>
        <div className={cx(styles.formInputCont, focused && styles.focused)}>
          <Select
            options={options}
            disabled={confirming}
            values={selected}
            onChange={tk => {
              setSelected(tk);
            }}
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
                <img src={item.icon} className={styles.tokenIcon} />
                <div className={styles.tokenSymbol}>{item.symbol}</div>
              </div>
            )}
            contentRenderer={({ props: { values } }) =>
              values.length > 0 ? (
                <div className={styles.selectedToken}>
                  <img src={values[0].icon} className={styles.tokenIcon} />
                  <div className={styles.tokenSymbol}>{values[0].symbol}</div>
                </div>
              ) : (
                <div className={styles.selectedToken} />
              )
            }
          />
          <input
            className={styles.formInput}
            placeholder="0.00"
            value={price}
            onChange={e =>
              setPrice(
                isNaN(e.target.value)
                  ? price
                  : Math.min(e.target.value, FTM_TOTAL_SUPPLY).toString()
              )
            }
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={contractApproving || confirming}
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
      </div>
      {totalSupply !== null && (
        <div className={styles.formGroup}>
          <div className={styles.formLabel}>Quantity</div>
          <div className={styles.formInputCont}>
            <input
              className={styles.formInput}
              placeholder={totalSupply}
              value={quantity}
              onChange={handleQuantityChange}
              disabled={contractApproving || confirming || totalSupply === 1}
            />
          </div>
        </div>
      )}
    </Modal>
  );
};

export default SellModal;
