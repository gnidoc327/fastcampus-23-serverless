import {instance, useLocalData} from '.';

export interface NotificationHistoryItem {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export const fetchNotificationList = async (
  startDate: string,
  endDate: string
): Promise<NotificationHistoryItem[]> => {
  if (!useLocalData) {
    const res = await instance.get(
      `/notification-list?startDate=${startDate}&endDate=${endDate}`
    );
    return res.data;
  }
  return [
    {
      id: '1',
      title: '로컬 데이터 알림',
      content: '이제 알림을 만들어야겠죠?',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
};

export const fetchNotificationDetail = async (
  notificationId: string
): Promise<NotificationHistoryItem> => {
  if (!useLocalData) {
    const res = await instance.get(`/notification-list/${notificationId}`);
    return res.data;
  }
  return {
    id: notificationId,
    title: '로컬 데이터 알림',
    content: '이제 알림을 만들어야겠죠?',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};
