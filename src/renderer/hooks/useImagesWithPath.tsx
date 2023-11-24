import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getCurrentDirection } from '../selectors';
import { Channels } from '../../main/preload';

const useImagesWithPath = (path: Channels) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [isEnd, setEnd] = useState(false);
  const [isObserver, setObserver] = useState(false);

  const direction = useSelector(getCurrentDirection);
  const handleReceivedData = (data: any) => {
    if (!data?.length) setEnd(true);

    setData((state) => [...state, ...data] as any);
    setLoading(false);
  };

  const handleGetContent = () => {
    setLoading(true);

    try {
      window.electron.ipcRenderer.sendMessage(path, {
        folderPath: direction,
        page,
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
    setEnd(false);
    setData([]);
    setPage(0);
    setLoading(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [direction]);

  useEffect(() => {
    handleGetContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, direction]);

  useEffect(() => {
    if (!isObserver || isEnd || isLoading) return;

    setPage((page) => page + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isObserver, isEnd, isLoading]);

  return { data, isLoading, isEnd, handleObserver };
};

export default useImagesWithPath;
