/* eslint-disable promise/catch-or-return */
import { ChangeEvent, createContext, useEffect, useState } from 'react';
import Switch from '@mui/material/Switch';
import LocalView from './LocalView';
import RemoteView from './RemoteView';
import { Box } from '@mui/system';
import { Input, Typography } from '@mui/material';
import { isNumber } from 'lodash';

export const LayoutContext = createContext('listView');
export const LimitContext = createContext(10);

const View = () => {
  const [variant, setVariant] = useState('listView');
  const [checked, setChecked] = useState(false);
  const [type, setType] = useState(false);
  const [kind, setKind] = useState(false);
  const [limit, setLimit] = useState(10);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const handleTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setType(event.target.checked);
  };

  const handleKindChange = (event: ChangeEvent<HTMLInputElement>) => {
    setKind(event.target.checked);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (isNumber(event.target.value)) return;
    setLimit(Number(event.target.value));
  };

  useEffect(() => {
    if (checked) setVariant('gridView');
    else setVariant('listView');
  }, [checked]);

  return (
    <div>
      <Box
        zIndex={999}
        position="fixed"
        left={0}
        bottom={0}
        display="flex"
        sx={{
          boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
          width: '100%',
          backgroundColor: '#fff',
        }}
      >
        <Box>
          <Box
            display="flex"
            sx={{ alignItems: 'center', p: 2, backgroundColor: '#fff' }}
          >
            <Typography variant="body2">Local</Typography>
            <Switch
              size="small"
              inputProps={{ 'aria-label': 'Switch demo' }}
              checked={kind}
              onChange={handleKindChange}
            />
            <Typography variant="body2">Remote</Typography>
          </Box>
        </Box>
        <Box>
          <Box
            display="flex"
            sx={{ alignItems: 'center', p: 2, backgroundColor: '#fff' }}
          >
            <Typography variant="body2">Virtualize List</Typography>
            <Switch
              size="small"
              inputProps={{ 'aria-label': 'Switch demo' }}
              checked={type}
              onChange={handleTypeChange}
            />
            <Typography variant="body2">Normal List</Typography>
          </Box>
        </Box>
        <Box>
          <Box
            display="flex"
            sx={{ alignItems: 'center', p: 2, backgroundColor: '#fff' }}
          >
            <Typography variant="body2">ListView</Typography>
            <Switch
              size="small"
              inputProps={{ 'aria-label': 'Switch demo' }}
              checked={checked}
              onChange={handleChange}
            />
            <Typography variant="body2">GridView</Typography>
          </Box>
        </Box>
        <Box>
          <Box
            display="flex"
            sx={{ alignItems: 'center', p: 2, backgroundColor: '#fff' }}
          >
            <Typography pr={1} variant="body2">
              Limit{' '}
            </Typography>
            <Input
              value={limit}
              onChange={handleLimitChange}
              sx={{ width: '32px' }}
              size="small"
            />
          </Box>
        </Box>
      </Box>
      <LimitContext.Provider value={limit}>
        <LayoutContext.Provider value={variant}>
          <Box pt="70px">
            {kind ? (
              <RemoteView
                type={type ? 'normal' : 'virtualize'}
                dataSource="http://127.0.0.1:3000/images"
              />
            ) : (
              <LocalView type={type ? 'normal' : 'virtualize'} />
            )}
          </Box>
        </LayoutContext.Provider>
      </LimitContext.Provider>
    </div>
  );
};
export default View;
