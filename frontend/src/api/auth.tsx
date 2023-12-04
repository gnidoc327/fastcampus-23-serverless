import {instance, useLocalData} from '.';
import {setAccessToken} from '../util/cookie';

export const login = async (username: string, password: string) => {
  if (!useLocalData) {
    const res = await instance.post('/auth/login', {
      username,
      password,
    });
    if (res.status != 200) {
      return false;
    }
    setAccessToken(res.data);
    return true;
  }
  return true;
};

export const signUp = async (username: string, password: string) => {
  if (!useLocalData) {
    await instance.post('/auth/sign-up', {
      username,
      password,
    });
    await login(username, password);
  }
  return true;
};
