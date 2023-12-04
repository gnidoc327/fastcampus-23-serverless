import _ from 'lodash';
import goodsData from './goodsData.json';
import {contentHost, defaultUserId, instance, useLocalData} from '.';

export interface GoodsItem {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

type Keyword = string | undefined;

const getQuery = (keyword: Keyword) => {
  return keyword ? `&keyword=${keyword}` : '';
};

const filterByKeyword = (items: GoodsItem[], keyword: Keyword): GoodsItem[] => {
  if (keyword) {
    items = _.filter(items, (item) => {
      return (
        _.includes(item.name, keyword) || _.includes(item.description, keyword)
      );
    });
  }
  return _.sortBy(items, 'id');
};

const jsonToGoodsItems = (): GoodsItem[] => {
  return _.map(goodsData, (item) => {
    return {
      ...item,
      imageUrl: item.image_url,
    };
  });
};

export const fetchGoodsItems = async (
  keyword: Keyword
): Promise<GoodsItem[]> => {
  if (!useLocalData) {
    const res = await instance.get(`/good-items?${getQuery(keyword)}`);
    return _.map(res.data, (item) => {
      return {
        ...item,
        imageUrl: `${contentHost}/${item.imageUri.replace(
          'origin/',
          'thumbnail/'
        )}`,
      };
    });
  }
  return filterByKeyword(jsonToGoodsItems(), keyword);
};

export const fetchRecommandedGoodsItems = async (
  keyword: Keyword,
  userId: string
): Promise<GoodsItem[]> => {
  if (!useLocalData) {
    try {
      const res = await instance.get(
        `/recommanded-goods-items?userId=${userId}${getQuery(keyword)}`
      );
      return _.map(res.data, (item) => {
        return {
          ...item,
          imageUrl: `${contentHost}/${item.imageUri.replace(
            'origin/',
            'thumbnail/'
          )}`,
        };
      });
    } catch (error) {
      return filterByKeyword(_.take(_.shuffle(jsonToGoodsItems()), 3), keyword);
    }
  }
  return filterByKeyword(_.take(_.shuffle(jsonToGoodsItems()), 3), keyword);
};

export const fetchGoodsItem = async (
  itemId: string | undefined
): Promise<GoodsItem | undefined> => {
  if (!useLocalData) {
    const res = await instance.get(`/good-items/${itemId}?id=${itemId}`);
    if (!res.data) {
      return undefined;
    }
    return {
      ...res.data,
      imageUrl: `${contentHost}/${res.data.imageUri}`,
    };
  }
  return _.find(jsonToGoodsItems(), (item) => {
    return item.id === itemId;
  });
};

export const purchaseGoodsItem = async (itemId: string, quantity: number) => {
  if (!useLocalData) {
    await instance.post(
      `/good-items/${itemId}?userId=${defaultUserId}&goodsItemId=${itemId}&quantity=${quantity}`
    );
  }
};
