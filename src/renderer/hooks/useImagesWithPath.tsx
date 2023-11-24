import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getCurrentDirection } from '../selectors';
import { Channels } from '../../main/preload';

const useImagesWithPath = (
  path: Channels,
  { limit = 10 }: { limit: number },
) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [isEnd, setEnd] = useState(false);
  const [isObserver, setObserver] = useState(false);
  const [error, setError] = useState('');

  const direction = useSelector(getCurrentDirection);
  const handleReceivedData = (data: any) => {
    if (!data?.length) setEnd(true);

    console.log('on receive data');

    setData((state) => [...state, ...data] as any);
    setLoading(false);
  };

  const handleReceivedError = (error) => {
    setError(error);
    setLoading(false);
  };

  const handleGetContent = ({ page, direction }) => {
    setLoading(true);
    try {
      window.electron.ipcRenderer.sendMessage(path, {
        folderPath: direction,
        page,
        limit,
      });
    } catch (error) {
      console.error('Error setting up IPC listeners:', error);
    }
  };

  const handleObserver = (value: boolean) => {
    setObserver(value);
  };

  useEffect(() => {
    window.electron.ipcRenderer.on(
      'get-content-with-path-success',
      handleReceivedData,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      'get-content-with-path-error',
      handleReceivedError,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setEnd(false);
    setData([]);
    setPage(0);
    setLoading(true);
    setError('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [direction]);

  useEffect(() => {
    handleGetContent({ page: 0, direction });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [direction]);

  useEffect(() => {
    if (!page) return;

    handleGetContent({ direction, page });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (!isObserver || isEnd || isLoading) return;

    setPage((page) => page + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isObserver, isEnd, isLoading]);

  return { data, isLoading, isEnd, error, handleObserver };
};

export default useImagesWithPath;
