const Todo = require('../models/Todo');

const getAllTodos = async () => {
  return Todo.find();
};

const createTodo = async (data) => {
  return Todo.create(data);
};

const updateTodo = async (id, updates) => {
  return Todo.findByIdAndUpdate(id, updates, { new: true });
};

const deleteTodo = async (id) => {
  return Todo.findByIdAndDelete(id);
};

module.exports = {
  getAllTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};
