import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Chart } from 'react-charts';
import axios from 'axios';
import cx from 'classnames';
import { ethers } from 'ethers';

import Panel from '../../components/Panel';
import ResizableBox from '../../components/ResizableBox';
import { fetchTokenURI, increaseViewCount } from '../../api';
import {
  getNFTContract,
  getListings,
  listItem,
  cancelListing,
  updateListing,
  buyItem,
  SALES_CONTRACT_ADDRESS,
} from 'contracts';
import { abbrAddress } from 'utils';
import SellModal from 'components/SellModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

import styles from './styles.module.scss';

const NFTItem = () => {
  const { addr: address, id: tokenID } = useParams();

  const [info, setInfo] = useState();
  const [owner, setOwner] = useState();
  const [sellModalVisible, setSellModalVisible] = useState(false);
  const [listings, setListings] = useState([]);
  const [views, setViews] = useState();

  const collections = useSelector(state => state.Collections);
  const myAddress = useSelector(state => state.ConnectWallet.address);

  const collection = collections.find(col => col.address === address);

  const getTokenURI = async () => {
    try {
      const { data: tokenURI } = await fetchTokenURI(address, tokenID);
      const { data } = await axios.get(tokenURI);
      setInfo(data);
    } catch {
      console.log('Token URI not available');
    }
  };

  const getTokenOwner = async () => {
    try {
      const [contract] = await getNFTContract(address);
      const res = await contract.ownerOf(tokenID);
      setOwner(res);
    } catch {
      setOwner(null);
    }
  };

  const getItemListings = async () => {
    try {
      const listings = await getListings(address, tokenID);
      setListings(listings);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getTokenURI();
    getTokenOwner();
    getItemListings();

    increaseViewCount(address, tokenID).then(({ data }) => {
      setViews(data);
    });
  }, [address, tokenID]);

  const isMine = owner === myAddress;

  const handleListItem = async _price => {
    try {
      const [contract, provider] = await getNFTContract(address);
      const approved = await contract.isApprovedForAll(
        myAddress,
        SALES_CONTRACT_ADDRESS
      );

      if (!approved) {
        const approveTx = await contract.setApprovalForAll(
          SALES_CONTRACT_ADDRESS,
          true
        );
        await provider.waitForTransaction(approveTx.hash);
      }

      const price = ethers.utils.parseEther(_price);
      const tx = await listItem(
        address,
        ethers.BigNumber.from(tokenID),
        ethers.BigNumber.from(1),
        price,
        ethers.BigNumber.from(Math.floor(new Date().getTime() / 1000)),
        '0x0000000000000000000000000000000000000000'
      );

      setSellModalVisible(false);

      await provider.waitForTransaction(tx.hash);

      getItemListings();
    } catch (e) {
      console.log('Error while listing item', e);
    }
  };

  const handleUpdatePrice = async _price => {
    try {
      const price = ethers.utils.parseEther(_price);
      const tx = await updateListing(address, tokenID, price);

      setSellModalVisible(false);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.waitForTransaction(tx.hash);

      getItemListings();
    } catch (e) {
      console.log('Error while updating listing price', e);
    }
  };

  const cancelList = async () => {
    await cancelListing(address, tokenID);
    setListings([]);
  };

  const handleBuyItem = async _price => {
    const [contract, provider] = await getNFTContract(address);
    const approved = await contract.isApprovedForAll(
      myAddress,
      SALES_CONTRACT_ADDRESS
    );

    if (!approved) {
      const approveTx = await contract.setApprovalForAll(
        SALES_CONTRACT_ADDRESS,
        true
      );
      await provider.waitForTransaction(approveTx.hash);
    }

    const price = ethers.utils.parseEther(_price.toString());
    const tx = await buyItem(
      address,
      ethers.BigNumber.from(tokenID),
      price,
      myAddress
    );
    await provider.waitForTransaction(tx.hash);
  };

  const series = useMemo(
    () => ({
      showPoints: false,
    }),
    []
  );

  const axes = useMemo(
    () => [
      {
        primary: true,
        type: 'time',
        position: 'bottom',
        show: [true, false],
      },
      { type: 'linear', position: 'left' },
    ],
    []
  );

  const startDate = new Date();
  const data = Array.from(Array(10), (_, i) => ({
    primary: new Date(startDate.getTime() + 60 * 1000 * 60 * 24 * i),
    // primary: i,
    secondary: Math.floor(Math.random() * 30),
    radius: undefined,
  }));

  return (
    <div className={cx(styles.container, isMine ? styles.withHeader : null)}>
      {isMine && (
        <div className={styles.header}>
          {listings.length ? (
            <div className={styles.headerButton} onClick={cancelList}>
              Cancel Listing
            </div>
          ) : null}
          <div
            className={styles.headerButton}
            onClick={() => setSellModalVisible(true)}
          >
            {listings.length ? 'Update Listing' : 'Sell'}
          </div>
        </div>
      )}
      <div className={styles.inner}>
        <div className={styles.topContainer}>
          <div className={styles.itemSummary}>
            <div className={styles.itemMedia}>
              <img src={info?.image} />
            </div>
            <div className={styles.itemInfoCont}>
              {info?.properties && (
                <Panel title="Properties">
                  <div className={styles.fakeBody} />
                </Panel>
              )}
              <Panel
                title={`About ${collection?.collectionName ||
                  collection?.name}`}
              >
                <div className={styles.panelBody}>
                  {collection?.description || 'Unverified Collection'}
                </div>
              </Panel>
              <Panel title="Chain Info">
                <div className={styles.panelBody}>
                  <div className={styles.panelLine}>
                    <div className={styles.panelLabel}>Collection</div>
                    <a
                      href={`https://ftmscan.com/token/${address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.panelValue}
                    >
                      {abbrAddress(address)}
                    </a>
                  </div>
                  <div className={styles.panelLine}>
                    <div className={styles.panelLabel}>Network</div>
                    <div className={styles.panelValue}>Fantom Opera</div>
                  </div>
                  <div className={styles.panelLine}>
                    <div className={styles.panelLabel}>Chain ID</div>
                    <div className={styles.panelValue}>250</div>
                  </div>
                </div>
              </Panel>
            </div>
          </div>
          <div className={styles.itemMain}>
            <div className={styles.wrapper}>
              <div className={styles.itemCategory}>
                {collection?.name || ''}
              </div>
              <div className={styles.itemName}>{info?.name || ''}</div>
              <div className={styles.itemViews}>
                <FontAwesomeIcon icon={faEye} color="#777" />
                &nbsp;{views} Views
              </div>
            </div>
            <div className={styles.panelWrapper}>
              <Panel title="Price History">
                <div className={styles.chartWrapper}>
                  <ResizableBox width="100%" height={250} resizable={false}>
                    <Chart
                      data={[{ label: 'Price', data }]}
                      series={series}
                      axes={axes}
                      tooltip
                    />
                  </ResizableBox>
                </div>
              </Panel>
            </div>
            <div className={styles.panelWrapper}>
              <Panel title="Listings">
                <div className={styles.listings}>
                  {listings.map((listing, idx) => (
                    <div className={styles.listing} key={idx}>
                      <div className={styles.owner}>
                        {abbrAddress(listing.owner)}
                      </div>
                      <div className={styles.price}>
                        {listing.pricePerItem} FTM
                      </div>
                      {!isMine && (
                        <div
                          className={styles.buyButton}
                          onClick={() => handleBuyItem(listing.pricePerItem)}
                        >
                          Buy
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Panel>
            </div>
            <div className={styles.panelWrapper}>
              <Panel title="Offers">
                <div className={styles.fakeBody} />
              </Panel>
            </div>
          </div>
        </div>
        <div className={styles.panelWrapper}>
          <Panel title="Trade History">
            <div className={styles.fakeBody} />
          </Panel>
        </div>
      </div>

      <SellModal
        visible={sellModalVisible}
        onClose={() => setSellModalVisible(false)}
        onSell={listings.length ? handleUpdatePrice : handleListItem}
        startPrice={listings.length ? listings[0].pricePerItem : 0}
      />
    </div>
  );
};

export default NFTItem;
