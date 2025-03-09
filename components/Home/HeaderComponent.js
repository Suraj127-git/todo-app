import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';

export const HeaderComponent = ({ newTask, setNewTask, addTodo }) => {
  const { colors, isDark } = useTheme();

  return (
    <View style={styles.header}>
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
    </View>
  );
};

const styles = StyleSheet.create({
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
  iconShadow: {
    shadowColor: '#4a90e2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});