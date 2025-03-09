export const groupTodosByDate = (todos, filterDate) => {
    const filteredTodos = filterDate
      ? todos.filter(todo => {
          const todoDate = new Date(todo.created_at).toISOString().split('T')[0];
          const filterDateString = filterDate.toISOString().split('T')[0];
          return todoDate === filterDateString;
        })
      : todos;
  
    const grouped = filteredTodos.reduce((acc, todo) => {
      const date = new Date(todo.created_at);
      const dateString = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      
      acc[dateString] = acc[dateString] || [];
      acc[dateString].push(todo);
      return acc;
    }, {});
  
    return Object.entries(grouped)
      .map(([title, data]) => ({
        title,
        data,
        timestamp: new Date(data[0].created_at)
      }))
      .sort((a, b) => b.timestamp - a.timestamp)
      .map(({ title, data }) => ({ title, data }));
  };