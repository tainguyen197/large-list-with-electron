/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable prettier/prettier */
/* eslint-disable react/function-component-definition */
import { Box, IconButton, Typography } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import { styled } from '@mui/system';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setDirectionWorking } from '../actions/directionWorking';

const Wrapper = styled('div')({
  display: 'flex',
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'translateX(8px)', // Move the item to the right on hover
    backgroundColor: '#bababa45',
  },
});

const GridViewWrapper = styled(Box)({
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
});

const ItemSelectedStyled = styled(Box)({
  position: 'absolute',
  top: 0,
  height: '100%',
  width: '100%',
  backgroundColor: '#6495eda3',
  zIndex: 1,
});

interface Props {
  title: string;
  variant: 'listView' | 'gridView';
  filePath: string;
}

const Folder = ({ title, variant, ...others }: Props) => {
  const [selected, setSelected] = useState(false);
  const dispatch = useDispatch();

  let rs;

  const handleClick = (e: any) => {
    if (e.detail === 1) setSelected((state) => !state);
    if (e.detail === 2) dispatch(setDirectionWorking(others.filePath) as any);
  };

  if (variant === 'gridView')
    rs = (
      <Box position="relative" sx={{ aspectRatio: '1 / 1' }}>
        <GridViewWrapper>
          <IconButton
            size="large"
            sx={{
              ':hover': {
                backgroundColor: 'unset',
              },
            }}
          >
            <FolderIcon sx={{ color: 'cornflowerblue', fontSize: '80px' }} />
          </IconButton>
          <Typography
            variant="body1"
            sx={{
              width: '-webkit-fill-available',
              px: 2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textAlign: 'center',
            }}
          >
            {title}
          </Typography>
        </GridViewWrapper>
      </Box>
    );

  if (variant === 'listView')
    rs = (
      <Wrapper
        sx={{
          alignItems: 'center',
          borderBottom: 'solid 1px #29232314',
        }}
      >
        <FolderIcon sx={{ color: 'cornflowerblue', fontSize: '60px' }} />
        <Typography variant="body1" sx={{ paddingLeft: '8px' }}>
          {title}
        </Typography>
      </Wrapper>
    );

  return (
    <Box position={'relative'} sx={{ cursor: 'pointer' }} onClick={handleClick}>
      {selected && <ItemSelectedStyled />}
      {rs}
    </Box>
  );
};

export default Folder;
