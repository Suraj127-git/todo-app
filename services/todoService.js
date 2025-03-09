import { supabase } from '../lib/supabase';

export const TodoService = {
  fetchTodos: async () => {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  addTodo: async (task) => {
    const { data, error } = await supabase
      .from('todos')
      .insert([{ task }]);
    return { data, error };
  },

  toggleTodo: async (todo) => {
    const { error } = await supabase
      .from('todos')
      .update({ is_complete: !todo.is_complete })
      .eq('id', todo.id);
    return { error };
  },

  deleteTodo: async (id) => {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);
    return { error };
  }
};