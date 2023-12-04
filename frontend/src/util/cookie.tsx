import {Cookies} from 'react-cookie';

const cookies = new Cookies();

const ACCESS_TOKEN = 'access_token';

export const setAccessToken = (token: string) => {
  return cookies.set(ACCESS_TOKEN, token);
};

export const getAccessToken = (): string => {
  return cookies.get(ACCESS_TOKEN);
};
