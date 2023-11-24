import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ListView from '../components/ListView';
import { fetchDataList } from '../actions';
import { getImages } from '../selectors';
import VirtualizeList from '../components/VirtualizeList';
import useDataWithUrl from '../hooks/useImagesWithUrl';
import useImagesWithUrlViaMain from '../hooks/useImagesWithUrlViaMain';

interface Props {
  dataSource: string;
}

const url =
  'https://images.unsplash.com/photo-1542395975-d6d3ddf91d6e?auto=format&fit=crop&q=80&w=2370&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

const RemoteView = ({ dataSource }: Props) => {
  // const { data, isEnd, handleObserver } = useDataWithUrl(dataSource);
  const { data, isEnd, handleObserver } = useImagesWithUrlViaMain(dataSource);

  return (
    // <ListView
    //   onObserver={handleObserver}
    //   smoothLoading={!isEnd}
    //   type="image"
    //   data={data}
    //   identity="getRemoteView"
    // />
    <VirtualizeList
      identity="getRemoteView"
      data={data}
      smoothLoading={!isEnd}
      type="image"
      onObserver={handleObserver}
    />
  );
};

export default RemoteView;
