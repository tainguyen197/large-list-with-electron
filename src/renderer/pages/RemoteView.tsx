import { useContext } from 'react';
import ListView from '../components/ListView';
import VirtualizeList from '../components/VirtualizeList';
import useDataWithUrl from '../hooks/useImagesWithUrl';
import useImagesWithUrlViaMain from '../hooks/useImagesWithUrlViaMain';
import { LimitContext } from './View';
import { Box, Typography } from '@mui/material';

interface Props {
  dataSource: string;
  type: 'normal' | 'virtualize';
}

const RemoteView = ({ dataSource, type = 'normal' }: Props) => {
  const limit = useContext(LimitContext);
  // const { data, isEnd, handleObserver } = useDataWithUrl(dataSource);
  const { data, isEnd, handleObserver } = useImagesWithUrlViaMain(dataSource, {
    limit,
  });

  console.log(data.length);
  return (
    <>
      <Box
        position="fixed"
        zIndex={999}
        top={0}
        display="flex"
        sx={{
          alignItems: 'center',
          p: 2,
          width: '100%',
          backgroundColor: '#fff',
          boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
        }}
      >
        <Typography
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden !important',
            textOverflow: 'ellipsis',
          }}
          variant="h6"
        >
          {dataSource}
        </Typography>
      </Box>
      {type === 'normal' && (
        <ListView
          onObserver={handleObserver}
          smoothLoading
          isEnd
          data={data}
          identity="getRemoteView"
        />
      )}
      {type === 'virtualize' && (
        <VirtualizeList
          data={data}
          isEnd={isEnd}
          identity="getRemoteView"
          smoothLoading
          onObserver={handleObserver}
        />
      )}
    </>
  );
};

export default RemoteView;
