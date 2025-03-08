import { useState, useEffect } from 'react';
import { View, SectionList, TextInput, StyleSheet, Animated, Easing, TouchableOpacity, Text } from 'react-native';
import { supabase } from '../lib/supabase';
import TodoItem from '../components/TodoItem';
import { Feather } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeContext';
import DateTimePicker from 'react-native-modal-datetime-picker';

export default function HomeScreen() {
  const [todos, setTodos] = useState([]);
  const [sections, setSections] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [filterDate, setFilterDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(300))[0];
  const { colors, isDark } = useTheme();

  useEffect(() => {
    fetchTodos();
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    const groupTodosByDate = () => {
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
        
        if (!acc[dateString]) {
          acc[dateString] = [];
        }
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

    setSections(groupTodosByDate());
  }, [todos, filterDate]);

  async function fetchTodos() {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    setTodos(data);
  }

  async function addTodo() {
    if (!newTask.trim()) return;

    const { data, error } = await supabase
      .from('todos')
      .insert([{ task: newTask }]);

    if (error) throw error;
    setNewTask('');
    fetchTodos();
  }

  async function toggleTodo(todo) {
    const { error } = await supabase
      .from('todos')
      .update({ is_complete: !todo.is_complete })
      .eq('id', todo.id);

    if (error) throw error;
    setTodos((prevTodos) =>
      prevTodos.map((item) =>
        item.id === todo.id ? { ...item, is_complete: !item.is_complete } : item
      )
    );
  }

  async function deleteTodo(todo) {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', todo.id);

    if (error) throw error;
    setTodos((prevTodos) => prevTodos.filter((item) => item.id !== todo.id));
  }

  const handleDateConfirm = (date) => {
    setFilterDate(date);
    setShowDatePicker(false);
  };

  const renderRightActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={[
          styles.deleteBox,
          { 
            transform: [{ scale }],
            backgroundColor: isDark ? colors.dark.delete : colors.light.delete
          }
        ]}
      >
        <Feather name="trash-2" size={24} color="white" />
      </Animated.View>
    );
  };

  return (
    <LinearGradient 
      colors={isDark ? [colors.dark.background, '#1a1a1a'] : [colors.light.background, '#e9ecef']} 
      style={styles.container}
    >
      <Animated.View
        style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >
        <TextInput
          value={newTask}
          onChangeText={setNewTask}
          placeholder="Add a new task..."
          placeholderTextColor={isDark ? colors.dark.placeholder : colors.light.placeholder}
          style={[
            styles.input,
            { 
              backgroundColor: isDark ? colors.dark.inputBg : colors.light.inputBg,
              color: isDark ? colors.dark.text : colors.light.text,
            }
          ]}
          onSubmitEditing={addTodo}
        />
        <TouchableOpacity onPress={addTodo} style={styles.addButton}>
          <Feather
            name="plus-circle"
            size={40}
            color={isDark ? colors.dark.icon : colors.light.icon}
            style={styles.iconShadow}
          />
        </TouchableOpacity>
      </Animated.View>

      {/* Date Filter Section */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={[
            styles.dateButton,
            {
              backgroundColor: isDark ? colors.dark.inputBg : colors.light.inputBg,
            }
          ]}
        >
          <Feather
            name="calendar"
            size={20}
            color={isDark ? colors.dark.icon : colors.light.icon}
            style={styles.dateIcon}
          />
          <Text style={[styles.dateButtonText, { color: isDark ? colors.dark.text : colors.light.text }]}>
            {filterDate ? filterDate.toLocaleDateString() : 'Filter by Date'}
          </Text>
        </TouchableOpacity>

        {filterDate && (
          <TouchableOpacity 
            onPress={() => setFilterDate(null)} 
            style={styles.clearButton}
          >
            <Feather 
              name="x-circle" 
              size={24} 
              color={isDark ? colors.dark.icon : colors.light.icon} 
            />
          </TouchableOpacity>
        )}
      </View>

      <DateTimePicker
        isVisible={showDatePicker}
        mode="date"
        date={filterDate || new Date()}
        onConfirm={handleDateConfirm}
        onCancel={() => setShowDatePicker(false)}
        themeVariant={isDark ? 'dark' : 'light'}
        textColor={isDark ? colors.dark.text : colors.light.text}
        accentColor={isDark ? colors.dark.icon : colors.light.icon}
      />

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Swipeable
            renderRightActions={(progress, dragX) => renderRightActions(progress, dragX)}
            onSwipeableOpen={() => deleteTodo(item)}
          >
            <TodoItem
              item={item}
              onToggle={() => toggleTodo(item)}
              onDelete={() => deleteTodo(item)}
            />
          </Swipeable>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View style={[styles.sectionHeader, { 
            backgroundColor: isDark ? colors.dark.sectionBg : colors.light.sectionBg 
          }]}>
            <Text style={[styles.sectionText, { 
              color: isDark ? colors.dark.sectionText : colors.light.sectionText 
            }]}>
              {title}
            </Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: isDark ? colors.dark.text : colors.light.text }]}>
            {filterDate ? 'No tasks for this date' : 'No tasks yet'}
          </Text>
        }
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