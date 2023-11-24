import { useContext } from 'react';
import { Box, Grid } from '@mui/material';
import { LayoutContext } from '../pages/View';
import './Animation.css';
import { itemRenderer } from './rowRenderer';
import Loading from './Loading';
import Ending from './Ending';
import { useObserver } from '../hooks/useObserver';
import { useScrollbarLoading } from '../hooks/useScrollbarLoading';
import useItemLayout from '../hooks/useItemLayout';
import getItemPerRow from '../utils/getItemPerRow';

interface Props {
  data: any;
  identity: string;
  type?: 'image' | 'file';
  smoothLoading?: boolean;
  isEnd?: boolean;
  isLoading?: boolean;
  onObserver?: (value: boolean) => void;
}

const ListView = ({
  data = [],
  type,
  smoothLoading = false,
  identity,
  isEnd = false,
  isLoading = false,
  onObserver,
}: Props) => {
  const variant = useContext(LayoutContext);
  const observerRef = useObserver({ identity, onObserver });

  return (
    <Box sx={{ pb: '70px' }}>
      <Grid container spacing={0}>
        {data.map((item: any, index: number) => (
          <Grid
            key={index}
            sx={{ height: '100%' }}
            item
            sm={getItemPerRow('sm', variant)}
            xs={getItemPerRow('xs', variant)}
            lg={getItemPerRow('lg', variant)}
            xl={getItemPerRow('xl', variant)}
          >
            {itemRenderer({ item, variant, type, key: index, index })}
          </Grid>
        ))}
        <Box ref={observerRef} sx={{ height: ' 10px', width: '100%' }} />
        {smoothLoading && isLoading && <Loading />}
        {isEnd && <Ending />}
      </Grid>
    </Box>
  );
};

export default ListView;
