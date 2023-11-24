import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getImages } from '../selectors';
import { fetchDataList } from '../actions';

const useDataWithUrl = (dataSource: string) => {
  const dispatch = useDispatch();

  const { data, isLoading, isError, page, isEnd } = useSelector(getImages);
  const [isIntersecting, setInterSecting] = useState(false);

  useEffect(() => {
    dispatch(fetchDataList(dataSource) as any);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    !isEnd &&
      !isLoading &&
      isIntersecting &&
      dispatch(fetchDataList(dataSource, { page }) as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isIntersecting]);

  const handleObserver = (intersecting: boolean) => {
    setInterSecting(intersecting);
  };

  return { data, isLoading, isEnd, isError, isIntersecting, handleObserver };
};

export default useDataWithUrl;
