import React, { useState } from 'react';
import faker from 'faker';
// import { FixedSizeList as List } from 'react-window';
import { FixedSizeGrid as Grid } from 'react-window';

import InfiniteLoader from 'react-window-infinite-loader';
import AutoSizer from 'react-virtualized-auto-sizer';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Card from '../Card';

const useStyles = makeStyles({
  container: {
    position: 'relative',
  },
});

const ListContainer = props => {
  const classes = useStyles();
  return <Container maxWidth="sm" className={classes.container} {...props} />;
};

const FInfiniteLoader = () => {
  const [data, setData] = useState([]);

  if (data.length === 0) {
    setData(Array.from({ length: 500 }).map(() => null));
  }

  const isItemLoaded = index => index < data.length && data[index] !== null;
  const loadMoreItems = (startIndex, stopIndex) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const newData = [...data];
        for (let idx = startIndex; idx < stopIndex; idx++) {
          newData[idx] = faker.lorem.sentence();
        }
        setData(newData);
        resolve();
      }, 2000);
    });
  };

  if (ListContainer) console.log();

  const resizeLoaderOnScreenChange = width => {
    if (width >= 1200) return 5;
    else if (width >= 1000 && width < 1200) return 4;
    else if (width >= 600 && width < 1000) return 3;
    else if (width > 480 && width < 600) return 2;
    else return 1;
  };

  return (
    <AutoSizer>
      {({ height, width }) => (
        <InfiniteLoader
          isItemLoaded={isItemLoaded}
          itemCount={data.length}
          loadMoreItems={loadMoreItems}
        >
          {({ onItemsRendered, ref }) => (
            <Grid
              className="Grid"
              columnCount={resizeLoaderOnScreenChange(width)}
              columnWidth={(width - 17) / resizeLoaderOnScreenChange(width)}
              height={height}
              rowCount={1000}
              rowHeight={240}
              width={width}
              itemData={data}
              onItemsRendered={onItemsRendered}
              ref={ref}
            >
              {Card}
            </Grid>
          )}
        </InfiniteLoader>
      )}
    </AutoSizer>
  );
};

export default FInfiniteLoader;
