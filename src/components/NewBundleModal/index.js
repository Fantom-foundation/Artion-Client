import React, { useEffect, useRef, useState, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import cx from 'classnames';
import { ClipLoader } from 'react-spinners';
import Modal from '@material-ui/core/Modal';
import Skeleton from 'react-loading-skeleton';
import Loader from 'react-loader-spinner';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import Select from 'react-dropdown-select';

import SuspenseImg from 'components/SuspenseImg';
import PriceInput from 'components/PriceInput';
import { useApi } from 'api';
import { useBundleSalesContract, useNFTContract } from 'contracts';
import { Contracts } from 'constants/networks';
import toast from 'utils/toast';
import useTokens from 'hooks/useTokens';
import { useSalesContract } from 'contracts';

import closeIcon from 'assets/svgs/close.svg';

import styles from './styles.module.scss';
import commonStyles from '../Modal/common.module.scss';

const NFTItem = ({ item, selected, onClick }) => {
  const { storageUrl } = useApi();

  return (
    <div
      className={cx(styles.item, selected && styles.selected)}
      onClick={onClick}
    >
      <div className={styles.imageBox}>
        {!item ? (
          <Skeleton
            width="100%"
            height="100%"
            className={styles.mediaLoading}
          />
        ) : (
          (item?.imageURL || item?.thumbnailPath?.length > 10) && (
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
                  item.thumbnailPath?.length > 10
                    ? `${storageUrl}/image/${item.thumbnailPath}`
                    : item.imageURL
                }
                className={styles.media}
                alt={item.name}
              />
            </Suspense>
          )
        )}
      </div>
      <div className={styles.itemName}>
        {item ? item.name : <Skeleton width={150} height={24} />}
      </div>
    </div>
  );
};

const NewBundleModal = ({ visible, onClose, onCreateSuccess = () => {} }) => {
  const { tokens: payTokens } = useTokens();
  const { account, chainId } = useWeb3React();
  const { getSalesContract } = useSalesContract();

  const { uid } = useParams();

  const { fetchTokens, createBundle, deleteBundle } = useApi();
  const { getERC721Contract } = useNFTContract();
  const { listBundle } = useBundleSalesContract();

  const rootRef = useRef(null);

  const selected = useRef([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [creating, setCreating] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [approved, setApproved] = useState(true);
  const [approving, setApproving] = useState(false);

  const [fetching, setFetching] = useState(false);
  const [page, setPage] = useState(0);
  const tokens = useRef([]);
  const [count, setCount] = useState(0);
  const [options, setOptions] = useState([]);
  const [paySelected, setPaySelected] = useState([]);
  const [tokenPrice, setTokenPrice] = useState();
  const [tokenPriceInterval, setTokenPriceInterval] = useState();

  const { authToken } = useSelector(state => state.ConnectWallet);

  const fetchNFTs = async step => {
    if (fetching) return;

    setFetching(true);
    setCount(0);

    try {
      const { data } = await fetchTokens(
        step * 18,
        18,
        'single',
        [],
        null,
        'createdAt',
        [],
        uid
      );
      setFetching(false);
      tokens.current.push(...data.tokens);
      setCount(data.total);
      setPage(step);
    } catch {
      setFetching(false);
    }
  };

  const loadNextPage = () => {
    if (fetching) return;
    if (tokens.current.length === count) return;

    fetchNFTs(page + 1);
  };

  useEffect(() => {
    if (visible) {
      selected.current = [];
      setName('');
      setPrice('');
      tokens.current = [];
      setCount(0);
      fetchNFTs(0);

      if (payTokens?.length) {
        setPaySelected([payTokens[0]]);
      }
    }
  }, [visible]);

  useEffect(() => {
    if (payTokens?.length) {
      setOptions(payTokens);
    }
  }, [payTokens]);

  const getTokenPrice = () => {
    if (tokenPriceInterval) clearInterval(tokenPriceInterval);
    const func = async () => {
      const tk = selected[0].address || ethers.constants.AddressZero;
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
    if (paySelected.length === 0) return;

    getTokenPrice();
  }, [paySelected]);

  const getContractApprovedStatus = async () => {
    setLoadingStatus(true);
    let contractAddresses = selected.current.map(
      idx => tokens.current[idx].contractAddress
    );
    contractAddresses = contractAddresses.filter(
      (addr, idx) => contractAddresses.indexOf(addr) === idx
    );
    let approved = true;
    try {
      await Promise.all(
        contractAddresses.map(async address => {
          const contract = await getERC721Contract(address);
          try {
            const _approved = await contract.isApprovedForAll(
              account,
              Contracts[chainId].bundleSales
            );
            approved = approved && _approved;
          } catch (e) {
            console.log(e);
          }
        })
      );
    } catch (e) {
      console.log(e);
    }
    setApproved(approved);
    setLoadingStatus(false);
  };

  const isValid = () => {
    return name && price && parseFloat(price) > 0 && selected.current.length;
  };

  const closeModal = () => {
    onClose();
  };

  const handleScroll = e => {
    const obj = e.currentTarget;
    if (obj.scrollHeight - obj.clientHeight - obj.scrollTop < 100) {
      loadNextPage();
    }
  };

  const handleItemClick = idx => {
    const index = selected.current.indexOf(idx);
    if (index > -1) {
      selected.current.splice(index, 1);
    } else {
      selected.current.push(idx);
    }
    getContractApprovedStatus();
  };

  const onApprove = async () => {
    setApproving(true);
    let contractAddresses = selected.current.map(
      idx => tokens.current[idx].contractAddress
    );
    contractAddresses = contractAddresses.filter(
      (addr, idx) => contractAddresses.indexOf(addr) === idx
    );
    try {
      await Promise.all(
        contractAddresses.map(async address => {
          const contract = await getERC721Contract(address);
          const _approved = await contract.isApprovedForAll(
            account,
            Contracts[chainId].bundleSales
          );
          if (!_approved) {
            const tx = await contract.setApprovalForAll(
              Contracts[chainId].bundleSales,
              true
            );
            await tx.wait();
          }
        })
      );
    } catch (e) {
      console.log(e);
    }
    setApproved(true);
    setApproving(false);
  };

  const onCreate = async () => {
    if (creating) return;

    let bundleID;
    const selectedItems = [];
    const token = paySelected[0];
    try {
      setCreating(true);

      for (let i = 0; i < selected.current.length; i++) {
        const item = tokens.current[selected.current[i]];
        selectedItems.push({
          address: item.contractAddress,
          tokenID: item.tokenID,
          supply: item?.holderSupply || item?.supply || 1,
        });
      }
      const { data } = await createBundle(
        name,
        token.address,
        parseFloat(price),
        selectedItems,
        authToken
      );
      bundleID = data;
    } catch {
      setCreating(false);
    }

    try {
      const _price = ethers.utils.parseUnits(price, token.decimals);
      const tx = await listBundle(
        bundleID,
        selectedItems.map(item => item.address),
        selectedItems.map(item => item.tokenID),
        selectedItems.map(item => item.supply),
        token.address === '' ? ethers.constants.AddressZero : token.address,
        _price,
        ethers.BigNumber.from(Math.floor(new Date().getTime() / 1000))
      );
      await tx.wait();

      toast('success', 'Bundle created successfully!');
      setCreating(false);

      closeModal();
      onCreateSuccess();
    } catch {
      setCreating(false);
      try {
        await deleteBundle(bundleID, authToken);
      } catch (e) {
        console.log(e);
      }
    }
  };

  if (!visible) return null;

  return (
    <div className={styles.root} ref={rootRef}>
      <Modal open className={styles.modal} container={() => rootRef.current}>
        <div className={styles.paper}>
          <div className={styles.header}>
            <div className={styles.title}>Create Bundle</div>
            <div className={styles.closeButton} onClick={onClose}>
              <img src={closeIcon} />
            </div>
          </div>
          <div className={styles.body}>
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
                <Select
                  options={options}
                  disabled={creating}
                  values={paySelected}
                  onChange={tk => {
                    setPaySelected(tk);
                  }}
                  className={commonStyles.select}
                  placeholder=""
                  itemRenderer={({ item, itemIndex, methods }) => (
                    <div
                      key={itemIndex}
                      className={commonStyles.token}
                      onClick={() => {
                        methods.clearAll();
                        methods.addItem(item);
                      }}
                    >
                      <img
                        src={item?.icon}
                        className={commonStyles.tokenIcon}
                      />
                      <div className={commonStyles.tokenSymbol}>
                        {item.symbol}
                      </div>
                    </div>
                  )}
                  contentRenderer={({ props: { values } }) =>
                    values.length > 0 ? (
                      <div className={commonStyles.selectedToken}>
                        <img
                          src={values[0]?.icon}
                          className={commonStyles.tokenIcon}
                        />
                        <div className={commonStyles.tokenSymbol}>
                          {values[0].symbol}
                        </div>
                      </div>
                    ) : (
                      <div className={commonStyles.selectedToken} />
                    )
                  }
                />
                <PriceInput
                  className={styles.formInput}
                  placeholder="0.00"
                  value={'' + price}
                  onChange={setPrice}
                  disabled={creating}
                />
                <div className={styles.usdPrice}>
                  {!isNaN(tokenPrice) && tokenPrice !== null ? (
                    `$${((parseFloat(price) || 0) * tokenPrice).toFixed(2)}`
                  ) : (
                    <Skeleton width={100} height={24} />
                  )}
                </div>
              </div>
            </div>
            <div className={styles.formGroup}>
              <p className={styles.formLabel}>Items</p>
              <div className={styles.itemList} onScroll={handleScroll}>
                {tokens.current.map((item, idx) => (
                  <NFTItem
                    key={idx}
                    item={item}
                    onClick={() => handleItemClick(idx)}
                    selected={selected.current.indexOf(idx) > -1}
                  />
                ))}
                {fetching &&
                  new Array(5)
                    .fill(null)
                    .map((item, idx) => <NFTItem key={idx} item={item} />)}
              </div>
            </div>
          </div>

          <div className={styles.footer}>
            <div
              className={cx(
                styles.button,
                styles.save,
                (creating || loadingStatus || approving || !isValid()) &&
                  styles.disabled
              )}
              onClick={
                isValid() && !creating && !loadingStatus && !approving
                  ? approved
                    ? onCreate
                    : onApprove
                  : null
              }
            >
              {creating || loadingStatus || approving ? (
                <ClipLoader color="#FFF" size={16} />
              ) : approved ? (
                'Create'
              ) : (
                'Approve Items'
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NewBundleModal;
