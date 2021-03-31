import React, { useMemo } from 'react';
import { Chart } from 'react-charts';

import Panel from '../../components/Panel';
import ResizableBox from '../../components/ResizableBox';

import styles from './styles.module.scss';

const NFTItem = () => {
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
  console.log('====>', data);

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <div className={styles.topContainer}>
          <div className={styles.itemSummary}>
            <div className={styles.itemMedia}>
              <img src="https://lh3.googleusercontent.com/c2Y0zp4LpzETIMO6FL4unRHXrGuxt9_ifWmqzbzQ_oqvh4LCZhMrswzWiBttEr3J-kQ5d9AVoq7VTfY2UxPhwynY=s992" />
            </div>
            <div className={styles.itemInfoCont}>
              <Panel title="Properties">
                <div className={styles.fakeBody} />
              </Panel>
              <Panel title="About CryptoPunks">
                <div className={styles.fakeBody} />
              </Panel>
              <Panel title="Chain Info">
                <div className={styles.fakeBody} />
              </Panel>
            </div>
          </div>
          <div className={styles.itemMain}>
            <div className={styles.wrapper}>
              <div className={styles.itemCategory}>Category</div>
              <div className={styles.itemName}>CryptoPunks</div>
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
