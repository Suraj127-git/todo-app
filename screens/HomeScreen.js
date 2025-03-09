import { useState } from 'react';
import { View, SectionList, Animated, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeContext';
import { useTodos } from '../hooks/useTodos';
import { groupTodosByDate } from '../helpers/dateHelpers';
import { HeaderComponent } from '../components/Home/HeaderComponent';
import { DateFilterComponent } from '../components/Home/DateFilterComponent';
import { TodoListComponent } from '../components/Home/TodoListComponent';
import { useHomeAnimations } from '../hooks/useHomeAnimations';

export default function HomeScreen() {
  const { colors, isDark } = useTheme();
  const [newTask, setNewTask] = useState('');
  const [filterDate, setFilterDate] = useState(null);
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos();
  const { fadeAnim, slideAnim } = useHomeAnimations();
  const sections = groupTodosByDate(todos, filterDate);

  const handleAddTodo = async () => {
    if (!newTask.trim()) return;
    await addTodo(newTask);
    setNewTask('');
  };

  return (
    <LinearGradient 
      colors={isDark ? [colors.dark.background, '#1a1a1a'] : [colors.light.background, '#e9ecef']} 
      style={styles.container}
    >
      <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <HeaderComponent 
          newTask={newTask}
          setNewTask={setNewTask}
          addTodo={handleAddTodo}
        />
      </Animated.View>

      <DateFilterComponent 
        filterDate={filterDate}
        setFilterDate={setFilterDate}
      />

      <TodoListComponent
        sections={sections}
        toggleTodo={toggleTodo}
        deleteTodo={deleteTodo}
        filterDate={filterDate}
      />
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addButton: {
    marginLeft: 10,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  listContent: {
    paddingHorizontal: 20,
  },
  deleteBox: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 10,
    marginVertical: 8,
  },
  iconShadow: {
    shadowColor: '#4a90e2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  sectionHeader: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 15,
    borderRadius: 8,
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  dateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dateButtonText: {
    marginLeft: 10,
    fontSize: 14,
  },
  clearButton: {
    marginLeft: 10,
    padding: 8,
  },
  dateIcon: {
    marginRight: 8,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    opacity: 0.6,
  },
});