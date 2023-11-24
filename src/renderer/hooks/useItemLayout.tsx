import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { useEffect, useState } from 'react';

const useItemLayout = ({ variant }) => {
  const theme = useTheme();
  const [itemPerRow, setItemPerRow] = useState(1);

  const sm = useMediaQuery(theme.breakpoints.up('sm'));
  const md = useMediaQuery(theme.breakpoints.up('md'));
  const xl = useMediaQuery(theme.breakpoints.up('xl'));
  const lg = useMediaQuery(theme.breakpoints.up('lg'));

  useEffect(() => {
    if (variant === 'listView') {
      setItemPerRow(1);
      return;
    }

    if (sm) setItemPerRow(3);
    if (md) setItemPerRow(4);
    if (lg) setItemPerRow(6);
    if (xl) setItemPerRow(9);
  }, [sm, md, xl, lg, variant]);

  return itemPerRow;
};

export default useItemLayout;
