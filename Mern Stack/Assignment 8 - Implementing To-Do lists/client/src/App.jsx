import { useEffect, useState } from 'react';
import { createTodo, deleteTodo, getTodos, updateTodo } from './api';
import './index.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const data = await getTodos();
        setTodos(data);
      } catch (error) {
        console.error('Failed to fetch todos', error);
      }
    };

    fetchTodos();
  }, []);

  const handleAdd = async () => {
    if (!input.trim()) return;
    try {
      const newTodo = await createTodo({ title: input });
      setTodos((prev) => [...prev, newTodo]);
      setInput('');
    } catch (error) {
      console.error('Failed to create todo', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error('Failed to delete todo', error);
    }
  };

  const handleToggle = async (todo) => {
    try {
      const updated = await updateTodo(todo._id, { isCompleted: !todo.isCompleted });
      setTodos((prev) => prev.map((item) => (item._id === todo._id ? updated : item)));
    } catch (error) {
      console.error('Failed to update todo', error);
    }
  };

  return (
    <div className="app-container">
      <h1>To-Do List</h1>
      <div className="input-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a task"
        />
        <button onClick={handleAdd}>Add</button>
      </div>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo._id} className={`todo-item ${todo.isCompleted ? 'completed' : ''}`}>
            <span onClick={() => handleToggle(todo)}>{todo.title}</span>
            <button className="delete" onClick={() => handleDelete(todo._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
