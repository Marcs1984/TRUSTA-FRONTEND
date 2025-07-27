import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://web-production-16335.up.railway.app',
  withCredentials: true,
});

export default instance;
