import axios from 'axios';

const API = axios.create({
    baseURL: 'https://visitor-backend-c5gm.onrender.com/api',
});

// This automatically adds the token to requests if we are logged in
API.interceptors.request.use((req) => {
    if (localStorage.getItem('token')) {
        req.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    }
    return req;
});

export default API;