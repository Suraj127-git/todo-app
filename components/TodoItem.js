import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

export default function TodoItem({ item, onToggle, onDelete }) {
  const { colors, isDark } = useTheme();

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { backgroundColor: isDark ? colors.dark.inputBg : 'white' }
      ]} 
      onPress={onToggle}
    >
      <View style={styles.content}>
        <Text style={[
          styles.text, 
          item.is_complete && styles.completed,
          { color: isDark ? colors.dark.text : colors.light.text }
        ]}>
          {item.task}
        </Text>
        <Feather
          name={item.is_complete ? 'check-circle' : 'circle'}
          size={24}
          color={item.is_complete ? 
            (isDark ? colors.dark.icon : colors.light.icon) : 
            (isDark ? '#555555' : '#dddddd')}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 10,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    flex: 1,
    marginRight: 15,
  },
  completed: {
    textDecorationLine: 'line-through',
  },
});