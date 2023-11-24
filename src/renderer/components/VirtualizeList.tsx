import React, { useContext, useEffect, useRef } from 'react';
import { Grid, List, WindowScroller as WindowScroll } from 'react-virtualized';
import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import Image from './Image';
import File from './File';
import isImage from '../utils/isImage';
import isFolder from '../utils/isFolder';
import Folder from './Folder';
import isFile from '../utils/isFile';
import { LayoutContext } from '../pages/View';
import './Animation.css';

const options = {
  root: null, // Use the viewport as the root
  rootMargin: '0px',
  threshold: 1, // Fire the callback when 50% of the target is visible
};

interface Props {
  data: any;
  identity: string;
  type?: 'image' | 'file';
  smoothLoading?: boolean;
  onObserver?: (value: boolean) => void;
}

const VirtualizeList = ({
  data,
  onObserver,
  identity,
  smoothLoading = false,
  type,
}: Props) => {
  const variant = useContext(LayoutContext);
  const observerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, options);

    // Start observing the target element
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(observerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identity]);

  const handleIntersection = (entries: any) => {
    entries.forEach((entry: any) => {
      onObserver && onObserver(entry.isIntersecting);
    });
  };

  const rowRenderer = ({ index, key, style }: any) => {
    if (type === 'image' || isImage(data[index]))
      return (
        <div style={style} key={key} className={`item ${variant}`}>
          <Image {...(data[index] as any)} variant={variant} />
        </div>
      );

    if (isFolder(data[index]))
      return (
        <div style={style} key={key} className={`item ${variant}`}>
          <Folder {...(data[index] as any)} variant={variant} />
        </div>
      );

    if (type === 'file' || isFile(data[index]))
      return (
        <div style={style} key={key} className={`item ${variant}`}>
          <File {...(data[index] as any)} variant={variant} />
        </div>
      );

    return 'unknown';
  };

  const cellRenderer = ({ columnIndex, key, rowIndex, style }: any) => {
    const itemIndex = rowIndex * 4 + columnIndex;
    if (itemIndex < data.length) {
      const item = data[itemIndex];
      if (type === 'image' || isImage(item))
        return (
          <div style={style} key={key} className={`item ${variant}`}>
            <Image {...(item as any)} variant={variant} />
          </div>
        );

      if (isFolder(item))
        return (
          <div style={style} key={key} className={`item ${variant}`}>
            <Folder {...(item as any)} variant={variant} />
          </div>
        );

      if (type === 'file' || isFile(item))
        return (
          <div style={style} key={key} className={`item ${variant}`}>
            <File {...(item as any)} variant={variant} />
          </div>
        );

      return 'unknown';
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
      }}
    >
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
                  rowRenderer={rowRenderer}
                  scrollTop={scrollTop}
                  width={width}
                  overscanRowCount={5}
                  batchSize={10}
                />
              ) : (
                <Grid
                  columnCount={4}
                  scrollTop={scrollTop}
                  isScrolling={isScrolling}
                  onScroll={onChildScroll}
                  columnWidth={window.innerWidth / 4}
                  rowCount={Math.ceil(data.length / 4)}
                  rowHeight={window.innerWidth / 4}
                  cellRenderer={cellRenderer}
                  width={width}
                  // autoHeight
                  autoHeight
                  height={height}
                />
              )}
              <div ref={observerRef} />
            </>
          );
        }}
      </WindowScroll>
      {smoothLoading && (
        <Box
          sx={{
            textAlign: 'center',
            height: '32px',
            py: 2,
            color: '#000000b0',
          }}
        >
          <LoadingButton size="small" loading variant="text" />
          Loading ...
        </Box>
      )}
    </Box>
  );
};

export default VirtualizeList;
