import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {GoodsItem, fetchGoodsItem, purchaseGoodsItem} from '../../api/goods';
import NotFound from '../ErrorPage/notFound';
import {Button, InputNumber, Space, Spin, Typography, message} from 'antd';

const {Title} = Typography;

const GoodsDetail = () => {
  const {id} = useParams();
  const [goodsItem, setGoodsItem] = useState<GoodsItem | undefined>();
  const [spinning, setSpinning] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const goodsItem = await fetchGoodsItem(id);
      setGoodsItem(goodsItem);
    };
    fetch();
  }, [id]);

  if (!goodsItem || !id) {
    return <NotFound />;
  }

  return (
    <Spin spinning={spinning}>
      <Space>
        <img
          alt={`goods_image_${id}`}
          src={goodsItem.imageUrl}
          style={{width: 400, height: 300}}
        />
        <Space direction="vertical" style={{marginLeft: 50}}>
          <Title>{goodsItem.name}</Title>
          <span>{goodsItem.description}</span>
          <Title level={4}>{goodsItem.price.toLocaleString()}원</Title>
          <InputNumber
            min={1}
            max={10}
            defaultValue={1}
            onChange={() => {
              setQuantity(quantity);
            }}
          />
          <Button
            onClick={async () => {
              setSpinning(true);
              await purchaseGoodsItem(id, quantity);
              setSpinning(false);
              message.info(`${goodsItem.name} 구매 완료`);
              navigate('/purchase-list');
            }}
          >
            구매
          </Button>
        </Space>
      </Space>
    </Spin>
  );
};

export default GoodsDetail;
