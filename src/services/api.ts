import axios from 'axios';
import { setupInterceptors } from './interceptors';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL,
});

setupInterceptors(api); 