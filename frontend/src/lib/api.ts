
import axios from 'axios';

const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: apiURL,
});

export default api;