import {Avatar, Button, DatePicker, List, Space, Spin, message} from 'antd';
import dayjs from 'dayjs';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
  PurchaseHistoryItem,
  fetchPurchaseHistoryList,
} from '../../api/purchase';
import {defaultUserId} from '../../api';
import _ from 'lodash';

const {RangePicker} = DatePicker;

const PurchaseHistoryList = () => {
  const defaultStartDate = dayjs().subtract(1, 'M');
  const defaultEndDate = dayjs();

  const [spinning, setSpinning] = useState<boolean>(false);
  const [rangeValue, setRangeValue] = useState<[string, string]>([
    defaultStartDate.format('YYYY-MM'),
    defaultEndDate.format('YYYY-MM'),
  ]);
  const [data, setData] = useState<PurchaseHistoryItem[]>([]);
  const navigate = useNavigate();

  const fetch = async () => {
    if (!rangeValue[0] || !rangeValue[1]) {
      message.warning('날짜를 입력해주세요');
      return;
    }

    setSpinning(true);
    const purchaseHistoryList = await fetchPurchaseHistoryList(
      rangeValue[0],
      rangeValue[1],
      _.toString(defaultUserId)
    );
    setData(_.reverse(purchaseHistoryList));
    setSpinning(false);
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <Spin spinning={spinning}>
      <Space style={{marginBottom: 50}}>
        <RangePicker
          picker="month"
          defaultValue={[dayjs().subtract(1, 'M'), dayjs()]}
          onChange={(_, dateStrings) => {
            setRangeValue([dateStrings[0], dateStrings[1]]);
          }}
        />
        <Button
          onClick={async () => {
            await fetch();
          }}
        >
          조회
        </Button>
      </Space>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item
            style={{
              cursor: 'pointer',
              background: 'white',
              border: '1px solid black',
              padding: 20,
              width: 600,
            }}
            onClick={() => {
              navigate(`/purchase-list/${item.id}`);
            }}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  shape="square"
                  src={item.imageUrl}
                  style={{width: 100, height: 100}}
                />
              }
              title={`${index + 1}. ${item.name}`}
              description={
                <>
                  <>주문번호: {item.id}</>
                  <br />
                  <>구입일: {item.createdAt.format('YYYY-MM-DD HH:mm:ss')}</>
                  <br />
                </>
              }
            />
          </List.Item>
        )}
      />
    </Spin>
  );
};

export default PurchaseHistoryList;
