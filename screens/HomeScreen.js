import { useState, useEffect } from 'react';
import { View, FlatList, TextInput, StyleSheet, Animated, Easing, TouchableOpacity } from 'react-native';
import { supabase } from '../lib/supabase';
import TodoItem from '../components/TodoItem';
import TodoWidget from '../widgets/TodoWidget';
import { Feather } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeContext';

export default function HomeScreen() {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState('');
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(300))[0];
  const { colors, isDark } = useTheme();

  const updateHomeScreenWidget = async () => {
    try {
      const { data } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });
  
      await AsyncStorage.setItem('widgetTodos', JSON.stringify(data));
      await updateWidget({
        widgetName: 'TodoWidget',
        renderWidget: () => (
          <TodoWidget />
        ),
      });
    } catch (error) {
      console.error('Error updating widget:', error);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await fetchTodos();
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
      await updateHomeScreenWidget(); // Initial widget update
    };
    initialize();
  }, []);

  async function fetchTodos() {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    setTodos(data);
    await updateHomeScreenWidget(); // Update widget after fetch
  }

  async function addTodo() {
    if (!newTask.trim()) return;

    const { data, error } = await supabase
      .from('todos')
      .insert([{ task: newTask }]);

    if (error) throw error;
    setNewTask('');
    await fetchTodos(); // Wait for fetch before widget update
    await updateHomeScreenWidget();
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
    await updateHomeScreenWidget(); // Update widget after toggle
  }

  async function deleteTodo(todo) {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', todo.id);

    if (error) throw error;
    setTodos((prevTodos) => prevTodos.filter((item) => item.id !== todo.id));
    await updateHomeScreenWidget(); // Update widget after delete
  }

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

      <FlatList
        data={todos}
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
        contentContainerStyle={styles.listContent}
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
});