import {atom} from 'recoil';
import {getAccessToken} from '../util/cookie';
import _ from 'lodash';

export const isLoginState = atom({
  key: 'isLogin',
  default: getAccessToken() !== '' ? true : false,
});
