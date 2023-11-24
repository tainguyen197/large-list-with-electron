import { ChangeEvent, createContext, useEffect, useState } from 'react';
import Switch from '@mui/material/Switch';
import LocalView from './LocalView';
import RemoteView from './RemoteView';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';

export const LayoutContext = createContext('listView');

const View = () => {
  const [variant, setVariant] = useState('listView');
  const [checked, setChecked] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  useEffect(() => {
    if (checked) setVariant('gridView');
    else setVariant('listView');
  }, [checked]);

  return (
    <div>
      <Box>
        <Box
          zIndex={999}
          position="fixed"
          display="flex"
          sx={{
            boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
            justifyContent: 'flex-end',
            width: '100%',
            backgroundColor: '#fff',
          }}
        >
          <Box display="flex" sx={{ alignItems: 'center', p: 2 }}>
            <Typography variant="body1">ListView</Typography>
            <Switch
              inputProps={{ 'aria-label': 'Switch demo' }}
              checked={checked}
              onChange={handleChange}
            />
            <Typography variant="body1">GridView</Typography>
          </Box>
        </Box>
      </Box>
      <LayoutContext.Provider value={variant}>
        <Box pt="70px">
          <RemoteView dataSource="http://localhost:3000/images" />
          {/* <LocalView /> */}
        </Box>
      </LayoutContext.Provider>
    </div>
  );
};
export default View;
