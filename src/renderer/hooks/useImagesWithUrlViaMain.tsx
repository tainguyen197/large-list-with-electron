import { useEffect, useState } from 'react';
import { useRemoteData } from './useRemoteData';

const useImagesWithUrlViaMain = (path: string) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [isEnd, setEnd] = useState(false);
  const [isObserver, setObserver] = useState(false);
  const { data: value } = useRemoteData(path, { page });

  const handleReceivedData = (data: any) => {
    if (!data?.length) setEnd(true);

    setData((state) => [...state, ...data] as any);
    setLoading(false);
  };

  const handleObserver = (value: boolean) => {
    setObserver(value);
  };

  useEffect(() => {
    if (!value.length) return;

    window.electron.ipcRenderer.sendMessage(
      'get-content-with-url-with-resizing',
      {
        urlList: value,
        page,
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      'get-content-with-path-success',
      handleReceivedData,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isObserver || isEnd) return;

    setPage((page) => page + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isObserver, isEnd]);

  return { data, isLoading, isEnd, handleObserver };
};

export default useImagesWithUrlViaMain;
