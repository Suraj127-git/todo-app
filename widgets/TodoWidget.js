import React, { useEffect, useState } from 'react';
import { AndroidWidget, WidgetRefresh } from 'react-native-android-widget';
import { useTheme } from '../theme/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

export function TodoWidget() {
  const { colors, isDark } = useTheme();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const { data, error } = await supabase
          .from('todos')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error) {
          setTodos(data);
          await AsyncStorage.setItem('widgetTodos', JSON.stringify(data));
        }
      } catch (error) {
        console.error('Error loading todos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTodos();
    WidgetRefresh.listen(() => loadTodos());
  }, []);

  return (
    <AndroidWidget
      renderWidget={({ width, height }) => (
        <widget>
          <box
            width={width}
            height={height}
            backgroundColor={isDark ? colors.dark.background : colors.light.background}
            paddingVertical={16}
            paddingHorizontal={8}
          >
            <text
              text="My Todo List"
              color={isDark ? colors.dark.text : colors.light.text}
              fontSize={18}
              fontWeight="bold"
              marginBottom={12}
            />

            {loading ? (
              <text
                text="Loading todos..."
                color={isDark ? colors.dark.text : colors.light.text}
                fontSize={14}
              />
            ) : todos.length === 0 ? (
              <text
                text="No tasks yet!"
                color={isDark ? colors.dark.placeholder : colors.light.placeholder}
                fontSize={14}
              />
            ) : (
              <scrollView>
                {todos.slice(0, 5).map((todo) => (
                  <box
                    key={todo.id}
                    flexDirection="row"
                    alignItems="center"
                    paddingVertical={8}
                    paddingHorizontal={12}
                    marginBottom={8}
                    backgroundColor={isDark ? colors.dark.inputBg : colors.light.inputBg}
                    borderRadius={8}
                  >
                    <Feather
                      name={todo.is_complete ? 'check-circle' : 'circle'}
                      size={20}
                      color={todo.is_complete ? '#4CAF50' : (isDark ? '#555' : '#ddd')}
                    />
                    <text
                      text={todo.task}
                      color={isDark ? colors.dark.text : colors.light.text}
                      fontSize={14}
                      marginLeft={12}
                      textDecorationLine={todo.is_complete ? 'line-through' : 'none'}
                      opacity={todo.is_complete ? 0.6 : 1}
                    />
                  </box>
                ))}
              </scrollView>
            )}
          </box>
        </widget>
      )}
    />
  );
}