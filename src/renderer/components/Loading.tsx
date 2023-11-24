import { LoadingButton } from '@mui/lab';
import { Box, Grid } from '@mui/material';
import { useContext } from 'react';
import { LayoutContext } from '../pages/View';
import Image from './Image';

const Loading = () => (
  <Box
    sx={{
      width: '100%',
      textAlign: 'center',
      height: '32px',
      py: 2,
      color: '#0000005e',
    }}
  >
    <LoadingButton size="small" loading variant="text" />
    Loading ...
  </Box>
);

const LoadingSkeleton = () => {
  const variant = useContext(LayoutContext);

  // return <Loading />;

  if (variant === 'gridView') return <Loading />;

  return [1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => (
    <Grid sx={{ height: '100%' }} item key={index} xs={12}>
      <Image.LoadingSkeleton variant={variant} />
    </Grid>
  ));
};

export default LoadingSkeleton;
