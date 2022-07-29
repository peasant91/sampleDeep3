import {get, patch} from './baseApi';

export const getNotification = query => {
  return get('v1/notification', query);
};

export const readNotif = () => {
  return patch(`v1/notification/read`);
};

export const readAllNotif = () => {
  return patch('v1/notification/read');
};
