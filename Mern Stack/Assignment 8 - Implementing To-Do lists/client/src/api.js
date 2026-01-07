import axios from 'axios';

const api = axios.create({
  baseURL: 'https://todo-backend-fw1k.onrender.com/api/todos',
});

export const getTodos = async () => {
  const res = await api.get('/');
  return res.data;
};

export const createTodo = async (task) => {
  const res = await api.post('/', task);
  return res.data;
};

export const updateTodo = async (id, updates) => {
  const res = await api.put(`/${id}`, updates);
  return res.data;
};

export const deleteTodo = async (id) => {
  const res = await api.delete(`/${id}`);
  return res.data;
};
