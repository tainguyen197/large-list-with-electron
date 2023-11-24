import { useEffect, useState } from 'react';

const useImagesWithUrlViaMain = (
  path: string,
  { limit }: { limit: number },
) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [isEnd, setEnd] = useState(false);
  const [error, setError] = useState('');

  const [isObserver, setObserver] = useState(false);

  const handleReceivedData = (data: any) => {
    if (!data?.length) setEnd(true);

    setData((state) => [...state, ...data] as any);
    setLoading(false);
  };

  const handleReceivedError = (error) => {
    setError(error);
    setLoading(false);
  };

  const handleObserver = (value: boolean) => {
    setObserver(value);
  };

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage(
      'get-content-with-url-with-resizing',
      {
        dataSource: path,
        page,
        limit,
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

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
    if (!isObserver || isEnd) return;

    setPage((page) => page + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isObserver, isEnd, isLoading]);

  return { data, isLoading, isEnd, error, handleObserver };
};

export default useImagesWithUrlViaMain;
