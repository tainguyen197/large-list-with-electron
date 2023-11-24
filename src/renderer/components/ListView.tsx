import { useContext, useEffect, useRef } from 'react';
import { Box, Grid } from '@mui/material';
import isImage from '../utils/isImage';
import Image from './Image';
import File from './File';
import { LayoutContext } from '../pages/View';
import isFile from '../utils/isFile';
import isFolder from '../utils/isFolder';
import Folder from './Folder';
import './Animation.css';

interface Props {
  data: any;
  identity: string;
  type?: 'image' | 'file';
  smoothLoading?: boolean;
  onObserver?: (value: boolean) => void;
}

const renderItem = (item: any, { type, variant }: any) => {
  if (type === 'image' || isImage(item))
    return (
      <div className={`item ${variant}`}>
        <Image {...item} variant={variant} />
      </div>
    );

  if (isFolder(item))
    return (
      <div className={`item ${variant}`}>
        <Folder {...item} variant={variant} />
      </div>
    );

  if (type === 'file' || isFile(item))
    return (
      <div className={`item ${variant}`}>
        <File {...item} variant={variant} />
      </div>
    );

  return 'unknown';
};

const renderLoadingItem = (
  item: any,
  { type, variant }: { type: any; variant: any },
) => {
  return <Image.LoadingSkeleton variant={variant} />;
};

const options = {
  root: null, // Use the viewport as the root
  rootMargin: '0px',
  threshold: 0.5, // Fire the callback when 50% of the target is visible
};

const ListView = ({
  data = [],
  type,
  smoothLoading = false,
  identity,
  onObserver,
}: Props) => {
  const variant = useContext(LayoutContext);
  const observerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, options);

    // Start observing the target element
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    // Clean up the observer when the component unmounts
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

  return (
    <Grid container spacing={0}>
      {data.map((item: any, index: number) => (
        <Grid
          key={index}
          sx={{ height: '100%' }}
          item
          sm={variant === 'listView' ? 12 : 4}
          xs={variant === 'listView' ? 12 : 6}
          md={variant === 'listView' ? 12 : 3}
          xl={variant === 'listView' ? 12 : 2}
        >
          {renderItem(item, { variant, type })}
        </Grid>
      ))}
      <Box ref={observerRef} sx={{ height: ' 20px', width: '100%' }} />
      {smoothLoading &&
        [1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => (
          <Grid
            sx={{ height: '100%' }}
            item
            key={index}
            sm={variant === 'listView' ? 12 : 4}
            xs={variant === 'listView' ? 12 : 6}
            md={variant === 'listView' ? 12 : 3}
            xl={variant === 'listView' ? 12 : 2}
          >
            {renderLoadingItem(item, { type, variant })}
          </Grid>
        ))}
    </Grid>
  );
};

export default ListView;
