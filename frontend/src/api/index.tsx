import axios from 'axios';

const baseURL = import.meta.env.VITE_BASE_URL;
export const useLocalData: boolean =
  import.meta.env.VITE_USE_LOCAL_DATA === 'true';
export const contentHost: string = import.meta.env.VITE_CONTENT_HOST;
export const defaultUserId: number = import.meta.env.VITE_USER_ID;

console.log(`baseURL = ${baseURL}`);
console.log(`useLocalData = ${useLocalData}`);
console.log(`contentHost = ${contentHost}`);
console.log(`defaultUserId = ${defaultUserId}`);

export const instance = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {accept: 'application/json'},
});
