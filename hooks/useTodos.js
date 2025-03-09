import { useState, useEffect } from 'react';
import { TodoService } from '../services/todoService';

export const useTodos = () => {
  const [todos, setTodos] = useState([]);
  
  const fetchTodos = async () => {
    const { data, error } = await TodoService.fetchTodos();
    if (!error) setTodos(data);
  };

  const addTodo = async (task) => {
    const { error } = await TodoService.addTodo(task);
    if (!error) fetchTodos();
  };

  const toggleTodo = async (todo) => {
    const { error } = await TodoService.toggleTodo(todo);
    if (!error) {
      setTodos(prev => prev.map(item => 
        item.id === todo.id ? { ...item, is_complete: !item.is_complete } : item
      ));
    }
  };

  const deleteTodo = async (id) => {
    const { error } = await TodoService.deleteTodo(id);
    if (!error) setTodos(prev => prev.filter(item => item.id !== id));
  };

  useEffect(() => { fetchTodos() }, []);

  return { todos, addTodo, toggleTodo, deleteTodo, fetchTodos };
};