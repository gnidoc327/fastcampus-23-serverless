import {Card, Divider, Spin, Typography} from 'antd';
import _ from 'lodash';
import {CSSProperties, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
  GoodsItem,
  fetchGoodsItems,
  fetchRecommandedGoodsItems,
} from '../../api/goods';
import {useRecoilValue} from 'recoil';
import {searchKeywordState} from '../../recoil/searchKeyword';
import {defaultUserId} from '../../api';

const {Title} = Typography;

interface CardPros {
  item: GoodsItem;
}

const GoodsCard = ({item}: CardPros) => {
  const navigate = useNavigate();
  return (
    <Card
      hoverable
      style={{width: 280, height: 320, margin: 5}}
      cover={
        <img
          style={{width: 280, height: 200}}
          alt={`goods_image_${item.id}`}
          src={item.imageUrl}
        />
      }
      onClick={() => {
        navigate(`goods/${item.id}`);
      }}
    >
      <Card.Meta title={item.name} description={item.description} />
    </Card>
  );
};

const listStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
};

const Home = () => {
  const [spinning, setSpinning] = useState<boolean>(false);
  const [goodsItems, setGoodsItems] = useState<GoodsItem[]>([]);
  const [recommandedGoodsItems, setRecommandedGoodsItems] = useState<
    GoodsItem[]
  >([]);
  const keyword = useRecoilValue(searchKeywordState);

  const fetch = async () => {
    setSpinning(true);
    const goodsItems = await fetchGoodsItems(keyword);
    const recommandedGoodsItems = await fetchRecommandedGoodsItems(
      keyword,
      _.toString(defaultUserId)
    );
    setGoodsItems(goodsItems);
    setRecommandedGoodsItems(recommandedGoodsItems);
    setSpinning(false);
  };

  useEffect(() => {
    fetch();
  }, [keyword]);

  const goodsCards = _.map(goodsItems, (item) => {
    return <GoodsCard key={`1_${item.id}`} item={item} />;
  });
  const recommandedGoodsCards = _.map(recommandedGoodsItems, (item) => {
    return <GoodsCard key={`2_${item.id}`} item={item} />;
  });

  return (
    <Spin spinning={spinning}>
      <Title>상품 리스트</Title>
      <div style={listStyle}>{goodsCards}</div>
      <Divider />
      <Title>추천 리스트</Title>
      <div style={listStyle}>{recommandedGoodsCards}</div>
    </Spin>
  );
};

export default Home;
