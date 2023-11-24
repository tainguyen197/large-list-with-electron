/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable prettier/prettier */
/* eslint-disable react/function-component-definition */
import { useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import { styled } from '@mui/system';
import getFileSize from '../utils/getFileSize';
import getExtensionIcon, { mappingIcon } from '../utils/getExtentionIcon';

const Wrapper = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
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
});

const ItemSelectedStyled = styled(Box)({
  position: 'absolute',
  top: 0,
  height: '100%',
  width: '100%',
  backgroundColor: '#6495eda3',
  zIndex: 20,
});

interface Props {
  title: string;
  fileSize?: number;
  variant: 'listView' | 'gridView';
  modificationTime?: any;
  fileExtension: string;
}

const File = ({ title, variant, ...others }: Props) => {
  const [selected, setSelected] = useState(false);
  let rs;

  const handleClick = () => {
    setSelected((state) => !state);
  };

  if (variant === 'gridView')
    rs = (
      <Box position="relative" sx={{ aspectRatio: '1 / 1' }}>
        <GridViewWrapper>
          <IconButton size="large">
            <img
              style={{ height: '60px' }}
              src={getExtensionIcon(others.fileExtension)}
              alt={title}
            />
          </IconButton>
          <Typography
            textAlign={'center'}
            variant="body1"
            sx={{
              width: '-webkit-fill-available',
              px: 2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {title}
          </Typography>
          <Typography variant="body2" sx={{ px: '8px' }}>
            {getFileSize(others.fileSize as number)}
          </Typography>
        </GridViewWrapper>
      </Box>
    );

  if (variant === 'listView')
    rs = (
      <Wrapper sx={{ borderBottom: 'solid 1px #29232314', pl: 0.5 }}>
        <Box display={'flex'} sx={{ alignItems: 'center' }}>
          <img
            style={{ height: '48px' }}
            src={getExtensionIcon(others.fileExtension)}
            alt={title}
          />
          <Typography variant="body1" style={{ paddingLeft: '8px' }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ pl: 1, pr: 4 }}>
          {getFileSize(others.fileSize as number)}
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

export default File;
