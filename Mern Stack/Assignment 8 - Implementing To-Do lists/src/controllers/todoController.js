const todoService = require('../services/todoService');

const getTodos = async (req, res) => {
  try {
    const todos = await todoService.getAllTodos();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch todos', error: error.message });
  }
};

const createTodo = async (req, res) => {
  try {
    // 1. Validation: Check if title exists before bothering the database
    if (!req.body.title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const todo = await todoService.createTodo(req.body);
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create todo', error: error.message });
  }
};

const updateTodo = async (req, res) => {
  try {
    const updatedTodo = await todoService.updateTodo(req.params.id, req.body);
    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update todo', error: error.message });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const deletedTodo = await todoService.deleteTodo(req.params.id);
    if (!deletedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.status(200).json({ message: 'Todo deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete todo', error: error.message });
  }
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};
