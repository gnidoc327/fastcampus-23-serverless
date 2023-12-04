import {Button, DatePicker, List, Space, Spin, message} from 'antd';
import {useEffect, useState} from 'react';
import {
  NotificationHistoryItem,
  fetchNotificationList,
} from '../../api/notification';
import dayjs from 'dayjs';
import {useNavigate} from 'react-router-dom';

const {RangePicker} = DatePicker;

const NotificationHistoryList = () => {
  const defaultStartDate = dayjs().subtract(1, 'M');
  const defaultEndDate = dayjs();

  const [spinning, setSpinning] = useState<boolean>(false);
  const [rangeValue, setRangeValue] = useState<[string, string]>([
    defaultStartDate.toString(),
    defaultEndDate.toString(),
  ]);
  const [data, setData] = useState<NotificationHistoryItem[]>([]);
  const navigate = useNavigate();

  const fetch = async () => {
    if (!rangeValue[0] || !rangeValue[1]) {
      message.warning('날짜를 입력해주세요');
      return;
    }

    setSpinning(true);
    const notificationList = await fetchNotificationList(
      rangeValue[0],
      rangeValue[1]
    );
    setData(notificationList);
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
              navigate(`/notification-list/${item.id}`);
            }}
          >
            <List.Item.Meta
              title={`${index + 1}. ${item.title}`}
              description={
                <>
                  <>{item.content}</>
                  <br />
                  <>{`(수신일: ${item.createdAt.toLocaleDateString()})`}</>
                </>
              }
            />
          </List.Item>
        )}
      />
    </Spin>
  );
};

export default NotificationHistoryList;
