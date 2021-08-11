import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import { ClipLoader } from 'react-spinners';
import Select from 'react-dropdown-select';
import Skeleton from 'react-loading-skeleton';
import axios from 'axios';

import { formatNumber } from 'utils';
import { FTM_TOTAL_SUPPLY } from 'constants/index';
import useTokens from 'hooks/useTokens';

import Modal from '../Modal';
import styles from '../Modal/common.module.scss';

const AuctionModal = ({
  visible,
  onClose,
  onStartAuction,
  auction,
  auctionStarted,
  confirming,
  approveContract,
  contractApproving,
  contractApproved,
}) => {
  const { tokens } = useTokens();

  const [now, setNow] = useState(new Date());
  const [reservePrice, setReservePrice] = useState('');
  const [startTime, setStartTime] = useState(
    new Date(new Date().getTime() + 2 * 60 * 1000)
  );
  const [endTime, setEndTime] = useState(
    new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
  );
  const [focused, setFocused] = useState(false);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [tokenPrice, setTokenPrice] = useState();
  const [tokenPriceInterval, setTokenPriceInterval] = useState();

  useEffect(() => {
    setInterval(() => setNow(new Date()), 1000);
  }, []);

  useEffect(() => {
    if (tokens?.length) {
      setOptions(tokens);
    }
  }, [tokens]);

  useEffect(() => {
    setReservePrice(auction?.reservePrice || '');
    setStartTime(
      auction?.startTime
        ? new Date(auction.startTime * 1000)
        : new Date(new Date().getTime() + 2 * 60 * 1000)
    );
    setEndTime(
      auction?.endTime
        ? new Date(auction.endTime * 1000)
        : new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
    );
  }, [visible, auction]);

  useEffect(() => {
    if (visible && tokens?.length) {
      setSelected([tokens[0]]);
    }
  }, [visible]);

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

  const validateInput = (() => {
    if (reservePrice.length === 0) return false;
    if (!auctionStarted && startTime.getTime() < now.getTime()) return false;
    return endTime.getTime() > startTime.getTime() + 1000 * 60 * 60;
  })();

  return (
    <Modal
      visible={visible}
      title={auction ? 'Update Auction' : 'Start Auction'}
      onClose={onClose}
      submitDisabled={
        contractApproving || confirming || (contractApproved && !validateInput)
      }
      submitLabel={
        contractApproved ? (
          confirming ? (
            <ClipLoader color="#FFF" size={16} />
          ) : auction ? (
            'Update Auction'
          ) : (
            'Start Auction'
          )
        ) : contractApproving ? (
          'Approving Item'
        ) : (
          'Approve Item'
        )
      }
      onSubmit={() =>
        contractApproved
          ? !confirming && validateInput
            ? onStartAuction(reservePrice, startTime, endTime)
            : null
          : approveContract()
      }
    >
      <div className={styles.formGroup}>
        <div className={styles.formLabel}>Reserve Price</div>
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
            value={reservePrice}
            onChange={e =>
              setReservePrice(
                isNaN(e.target.value)
                  ? reservePrice
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
                ((parseFloat(reservePrice) || 0) * tokenPrice).toFixed(2)
              )}`
            ) : (
              <Skeleton width={100} height={24} />
            )}
          </div>
        </div>
      </div>
      <div className={styles.formGroup}>
        <div className={styles.formLabel}>Start Time</div>
        <div className={styles.formInputCont}>
          <Datetime
            value={startTime}
            onChange={val => setStartTime(val.toDate())}
            inputProps={{
              className: styles.formInput,
              onKeyDown: e => e.preventDefault(),
              disabled: auctionStarted || contractApproving || confirming,
            }}
            closeOnSelect
            isValidDate={cur =>
              cur.valueOf() > now.getTime() - 1000 * 60 * 60 * 24
            }
          />
        </div>
      </div>
      <div className={styles.formGroup}>
        <div className={styles.formLabel}>Auction Expiration</div>
        <div className={styles.formInputCont}>
          <Datetime
            value={endTime}
            onChange={val => setEndTime(val.toDate())}
            inputProps={{
              className: styles.formInput,
              onKeyDown: e => e.preventDefault(),
              disabled: contractApproving || confirming,
            }}
            closeOnSelect
            isValidDate={cur =>
              cur.valueOf() > startTime.getTime() - 1000 * 60 * 60 * 23
            }
          />
        </div>
      </div>
    </Modal>
  );
};

export default AuctionModal;
