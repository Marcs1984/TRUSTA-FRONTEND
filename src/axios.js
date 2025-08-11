import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://web-production-bf4c0.up.railway.app',
  withCredentials: true,
});

export default instance;
