/* eslint-disable promise/always-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable promise/catch-or-return */
/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable prettier/prettier */
/* eslint-disable react/function-component-definition */
import { useEffect, useState } from 'react';
import { Box, Skeleton, Typography } from '@mui/material';
import { styled } from '@mui/system';
import getFileSize from '../utils/getFileSize';

const Wrapper = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontWeight: 'bold',
  transition: 'transform 0.2s ease', // Add a transition property for smooth animation

  '&:hover': {
    transform: 'translateX(8px)', // Move the item to the right on hover
    backgroundColor: '#bababa45',
  },
});

const ImageStyled = styled('img')({
  height: '100%',
  width: '100%',
  objectFit: 'cover',
  objectPosition: 'center',
  transition: 'transform .2s',
  ':hover': {
    transform: 'scale(1.1)',
    position: 'relative',
    zIndex: 2,
  },
});

const ThumbStyled = styled('img')({
  height: 48,
  width: 48,
  backgroundColor: '#302727c4',
  objectFit: 'cover',
  objectPosition: 'center',
});

const ItemSelectedStyled = styled(Box)({
  position: 'absolute',
  top: 0,
  height: '100%',
  width: '100%',
  backgroundColor: '#6495eda3',
  zIndex: 2,
});

interface Props {
  title: string;
  url: string;
  thumbnailUrl: string;
  variant: 'listView' | 'gridView';
  fileSize?: number;
  modificationTime?: any;
  fileContent?: any;
  selected?: boolean;
}

const Image = ({ title, url, variant = 'gridView', ...others }: Props) => {
  const [selected, setSelected] = useState(false);
  const [resizedImage, setResizedImage] = useState();

  // useEffect(() => {
  //   const start = now();
  //   resizeImage(url).then((img) => {
  //     const end = now();
  //     setResizedImage(img);
  //     console.log(end - start, 'ms');
  //   });
  // }, []);

  let rs;

  const handleClick = () => {
    setSelected((state) => !state);
  };

  if (variant === 'gridView')
    rs = (
      <Box
        display={'flex'}
        position="relative"
        sx={{
          // backgroundColor: '#b8b8b8b8',
          aspectRatio: '1 / 1',
          border: 'solid 1px #ffffff4f',
        }}
      >
        <ImageStyled
          loading="lazy"
          src={resizedImage || url || others.fileContent}
          alt={title}
        />
      </Box>
    );

  if (variant === 'listView')
    rs = (
      <Wrapper sx={{ borderBottom: 'solid 1px #29232314' }}>
        <Box display={'flex'} sx={{ alignItems: 'center' }}>
          <ThumbStyled
            loading="lazy"
            src={resizedImage || url || others.fileContent}
            alt={title}
          />
          <Typography variant="body1" style={{ paddingLeft: '8px' }}>
            {title}
          </Typography>
        </Box>
        {others.fileSize && (
          <Typography variant="body2" fontWeight={400} sx={{ pl: 1, pr: 4 }}>
            {getFileSize(others.fileSize as number)}
          </Typography>
        )}
      </Wrapper>
    );

  return (
    <Box position={'relative'} sx={{ cursor: 'pointer' }} onClick={handleClick}>
      {selected && <ItemSelectedStyled />}
      {rs}
    </Box>
  );
};

Image.LoadingSkeleton = ({ variant }: { variant: 'listView' | 'gridView' }) => {
  if (variant === 'listView')
    return (
      <Box display={'flex'} height={'60px'} alignItems={'center'}>
        <Skeleton
          animation="wave"
          variant="rectangular"
          width={'50px'}
          height={'50px'}
        />
        <Skeleton
          sx={{ ml: 1 }}
          animation="wave"
          variant="text"
          width={'50%'}
          height={'24px'}
        />
      </Box>
    );

  if (variant === 'gridView')
    return (
      <Skeleton
        animation="wave"
        variant="rectangular"
        width={'100%'}
        height={'100%'}
        sx={{ aspectRatio: '1/ 1', border: 'solid 1px #ffffff4f' }}
      />
    );

  return null;
};

export default Image;
