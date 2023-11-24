/* eslint-disable no-undef */
import React, { useContext, useEffect, useState } from 'react';
import { Grid, List, WindowScroller as WindowScroll } from 'react-virtualized';
import Box from '@mui/material/Box';
import { LayoutContext } from '../pages/View';
import './Animation.css';
import { itemRenderer } from './rowRenderer';
import { useObserver } from '../hooks/useObserver';
import Ending from './Ending';
import Loading from './Loading';
import useItemLayout from '../hooks/useItemLayout';

interface Props {
  data: any;
  type?: 'image' | 'file';
  smoothLoading?: boolean;
  isEnd?: boolean;
  identity?: string;
  isLoading?: boolean;
  onObserver?: (value: boolean) => void;
}

const VirtualizeList = ({
  data,
  onObserver,
  smoothLoading = false,
  type,
  isLoading = false,
  isEnd = false,
  identity,
}: Props) => {
  const variant = useContext(LayoutContext);
  const observerRef = useObserver({ identity, onObserver });
  const itemPerRow = useItemLayout({ variant });

  return (
    <Box
      sx={{
        position: 'relative',
        paddingBottom: '70px',
      }}
    >
      <Box>
        <WindowScroll>
          {({ height, isScrolling, onChildScroll, scrollTop, width }) => {
            return (
              <>
                {variant === 'listView' ? (
                  <List
                    autoHeight
                    height={height}
                    isScrolling={isScrolling}
                    onScroll={onChildScroll}
                    rowCount={data.length}
                    rowHeight={60}
                    rowRenderer={({ index, key, style }) =>
                      itemRenderer({
                        index,
                        key,
                        style,
                        type,
                        item: data[index],
                        variant,
                      })
                    }
                    scrollTop={scrollTop}
                    width={width}
                    batchSize={10}
                  />
                ) : (
                  <Grid
                    columnCount={itemPerRow}
                    scrollTop={scrollTop}
                    isScrolling={isScrolling}
                    onScroll={onChildScroll}
                    columnWidth={window.innerWidth / itemPerRow}
                    rowCount={Math.ceil(data.length / itemPerRow)}
                    rowHeight={window.innerWidth / itemPerRow}
                    cellRenderer={({ columnIndex, key, rowIndex, style }) => {
                      const itemIndex = rowIndex * itemPerRow + columnIndex;
                      const item = data[itemIndex];
                      if (itemIndex < data.length) {
                        return itemRenderer({
                          key,
                          style,
                          item,
                          variant,
                          type,
                          index: itemIndex,
                        });
                      }
                    }}
                    width={width}
                    autoHeight
                    height={height}
                  />
                )}
              </>
            );
          }}
        </WindowScroll>
      </Box>
      <div ref={observerRef} />
      {smoothLoading && isLoading && <Loading />}
      {isEnd && <Ending />}
    </Box>
  );
};

export default VirtualizeList;
