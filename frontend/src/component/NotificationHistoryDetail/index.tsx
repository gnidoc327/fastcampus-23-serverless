import {Descriptions, DescriptionsProps, Spin, message} from 'antd';
import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import NotFound from '../ErrorPage/notFound';
import {
  NotificationHistoryItem,
  fetchNotificationDetail,
} from '../../api/notification';

const NotificationHistoryDetail = () => {
  const {id} = useParams();
  const [spinning, setSpinning] = useState<boolean>(false);
  const [notification, setNotification] = useState<
    NotificationHistoryItem | undefined
  >();
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      if (!id) {
        message.warning('URL에 문제가 있습니다. 뒤로 이동합니다');
        navigate(-1);
      }

      setSpinning(true);
      const item = await fetchNotificationDetail(id as string);
      setNotification(item);
      setSpinning(false);
    };
    fetch();
  }, []);

  if (!notification) {
    return <NotFound />;
  }
  const items: DescriptionsProps['items'] = [
    {
      key: 'title',
      label: '제목',
      children: notification.title,
    },
    {
      key: 'createdAt',
      label: '수신일',
      children: notification.createdAt.toLocaleDateString(),
    },
    {
      key: 'content',
      label: '내용',
      children: notification.content,
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

export default NotificationHistoryDetail;
