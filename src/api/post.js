import api from './axios';

export const getPost = async () => {
    return await api.get('/posts');
};

export const storePost = async (data) => {
    return await api.post('/posts', data);
}