import {Descriptions, DescriptionsProps, Spin, message} from 'antd';
import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import NotFound from '../ErrorPage/notFound';
import {
  PurchaseHistoryItem,
  fetchPurchaseHistoryDetail,
} from '../../api/purchase';
import {defaultUserId} from '../../api';
import _ from 'lodash';

const PurchaseHistoryDetail = () => {
  const {id} = useParams();
  const [spinning, setSpinning] = useState<boolean>(false);
  const [purchaseHistoryItem, setPurchaseHistoryItem] = useState<
    PurchaseHistoryItem | undefined
  >();
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      if (!id) {
        message.warning('URL에 문제가 있습니다. 뒤로 이동합니다');
        navigate(-1);
      }

      setSpinning(true);
      const item = await fetchPurchaseHistoryDetail(
        _.toString(defaultUserId),
        _.toString(id)
      );
      setPurchaseHistoryItem(item);
      setSpinning(false);
    };
    fetch();
  }, []);

  if (!purchaseHistoryItem) {
    return <NotFound />;
  }
  const items: DescriptionsProps['items'] = [
    {
      key: 'id',
      label: '주문번호',
      children: purchaseHistoryItem.id,
    },
    {
      key: 'title',
      label: '상품명',
      children: purchaseHistoryItem.name,
    },
    {
      key: 'price',
      label: '가격',
      children: purchaseHistoryItem.price,
    },
    {
      key: 'createdAt',
      label: '구입일',
      children: purchaseHistoryItem.createdAt.format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  return (
    <Spin spinning={spinning}>
      <Descriptions
        style={{width: 800}}
        bordered
        colon={false}
        column={1}
        title={'상세 알림 보기'}
        items={items}
        layout={'horizontal'}
        labelStyle={{fontWeight: 'bold', textAlign: 'center'}}
        contentStyle={{background: 'white'}}
      />
    </Spin>
  );
};

export default PurchaseHistoryDetail;
