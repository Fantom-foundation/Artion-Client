import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Chart } from 'react-charts';
import axios from 'axios';
import { ethers } from 'ethers';

import Panel from '../../components/Panel';
import ResizableBox from '../../components/ResizableBox';
import { fetchTokenURI } from '../../api';
import { NFT_CONTRACT_ABI } from 'contracts';

import styles from './styles.module.scss';

const NFTItem = () => {
  const { addr: address, id: tokenID } = useParams();

  const [info, setInfo] = useState();
  const [owner, setOwner] = useState();

  const collections = useSelector(state => state.Collections);
  const myAddress = useSelector(state => state.ConnectWallet.address);

  const collection = collections.find(col => col.address === address);

  const getTokenURI = async (address, tokenID) => {
    try {
      const { data: tokenURI } = await fetchTokenURI(address, tokenID);
      const { data } = await axios.get(tokenURI);
      setInfo(data);
    } catch {
      console.log('Token URI not available');
    }
  };

  const getTokenOwner = async (address, tokenID) => {
    await window.ethereum.enable();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(address, NFT_CONTRACT_ABI, provider);
    const res = await contract.ownerOf(tokenID);
    setOwner(res);
  };

  useEffect(async () => {
    getTokenURI(address, tokenID);
    getTokenOwner(address, tokenID);
  }, [address, tokenID]);

  const isMine = owner === myAddress;
  console.log(isMine);

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
    <div className={styles.container}>
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
              <Panel title={`About ${collection?.name}`}>
                <div className={styles.fakeBody} />
              </Panel>
              <Panel title="Chain Info">
                <div className={styles.fakeBody} />
              </Panel>
            </div>
          </div>
          <div className={styles.itemMain}>
            <div className={styles.wrapper}>
              <div className={styles.itemCategory}>
                {collection?.name || ''}
              </div>
              <div className={styles.itemName}>{info?.name || ''}</div>
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
                <div className={styles.fakeBody} />
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
    </div>
  );
};

export default NFTItem;
