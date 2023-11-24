import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/system';
import { IconButton, Typography } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ListView from '../components/ListView';
import VirtualizeList from '../components/VirtualizeList';

import useImagesWithPath from '../hooks/useImagesWithPath';
import { getCurrentDirection } from '../selectors';
import { setCurrentDirection } from '../reducer/directionSlice';
import NoData from '../components/NoData';
import { useContext } from 'react';
import { LimitContext } from './View';
import NoPermission from '../components/NoPermission';

const LocalView = ({ type = 'normal' }: { type: 'normal' | 'virtualize' }) => {
  const dispatch = useDispatch();
  const limit = useContext(LimitContext);

  const direction = useSelector(getCurrentDirection);
  const { data, handleObserver, isEnd, isLoading, error } = useImagesWithPath(
    'get-content-with-path-enhance-with-resizing',
    {
      limit,
    },
  );

  const handleBack = () => {
    const arraySplit = direction.split('/');
    arraySplit.pop();
    const backDirection = arraySplit.join('/');
    dispatch(setCurrentDirection(backDirection));
  };

  return (
    <div>
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
        <IconButton
          onClick={handleBack}
          sx={{ color: 'black', fontWeight: 400 }}
        >
          <ArrowBackIosIcon />
        </IconButton>
        <Typography
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden !important',
            textOverflow: 'ellipsis',
          }}
          variant="h6"
        >
          {direction}
        </Typography>
      </Box>
      {error && <NoPermission error={error} />}
      {!data.length && isEnd && <NoData />}
      {(data.length || isLoading) && (
        <>
          {type === 'virtualize' && (
            <VirtualizeList
              identity={`${direction}`}
              data={data}
              onObserver={handleObserver}
              smoothLoading
              isLoading={isLoading}
              isEnd={isEnd}
            />
          )}
          {type === 'normal' && (
            <ListView
              identity={`${direction}`}
              data={data}
              onObserver={handleObserver}
              smoothLoading
              isEnd={isEnd}
            />
          )}
        </>
      )}
    </div>
  );
};

export default LocalView;
