import {contentHost, instance, useLocalData} from '.';
import _ from 'lodash';
import goodsData from './goodsData.json';
import dayjs, {Dayjs} from 'dayjs';

export interface PurchaseHistoryItem {
  id: number;
  goodsItemId: string;
  name: string;
  price: number;
  imageUrl: string;
  createdAt: Dayjs;
  updatedAt: Dayjs;
}

export const fetchPurchaseHistoryList = async (
  startDate: string,
  endDate: string,
  userId: string
): Promise<PurchaseHistoryItem[]> => {
  if (!useLocalData) {
    const res = await instance.get(
      `/purchase-list/${userId}?startDate=${startDate}&endDate=${endDate}`
    );

    return _.map(res.data, (item) => {
      const createdAt = dayjs(item.createdAt);
      return {
        ...item,
        id: createdAt.unix() + createdAt.format('SSS'),
        imageUri: `${contentHost}/${item.imageUri.replace(
          'origin/',
          'thumbnail/'
        )}`,
        createdAt: createdAt,
        updatedAt: dayjs(item.updatedAt),
      };
    });
  }
  return _.map(goodsData, (item) => {
    return {
      id: _.toNumber(item.id),
      goodsItemId: item.id,
      name: item.name,
      price: item.price,
      imageUrl: item.image_url,
      createdAt: dayjs(),
      updatedAt: dayjs(),
    };
  });
};

export const fetchPurchaseHistoryDetail = async (
  userId: string,
  id: string
): Promise<PurchaseHistoryItem | undefined> => {
  if (!useLocalData) {
    const res = await instance.get(`/purchase-list/${userId}/${id}`);
    const createdAt = dayjs(res.data.createdAt);
    return {
      ...res.data,
      id: createdAt.unix() + createdAt.format('SSS'),
      imageUri: `${contentHost}/${res.data.imageUri}`,
      createdAt: createdAt,
      updatedAt: dayjs(res.data.updatedAt),
    };
  }
  const goodsItem = _.find(goodsData, (item) => {
    return item.id === id;
  });
  if (!goodsItem) {
    return undefined;
  }
  return {
    id: _.toNumber(goodsItem.id),
    goodsItemId: goodsItem.id,
    name: goodsItem.name,
    price: goodsItem.price,
    imageUrl: goodsItem.image_url,
    createdAt: dayjs(),
    updatedAt: dayjs(),
  };
};
