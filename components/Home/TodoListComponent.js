import { SectionList, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import SwipeDeleteComponent from './SwipeDeleteComponent'; // Updated import
import TodoItem from '../../components/TodoItem';

export const TodoListComponent = ({ sections, toggleTodo, deleteTodo, filterDate }) => {
  const { colors, isDark } = useTheme();

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <SwipeDeleteComponent onDelete={() => deleteTodo(item.id)}>
          <TodoItem
            item={item}
            onToggle={() => toggleTodo(item)}
            onDelete={() => deleteTodo(item.id)}
          />
        </SwipeDeleteComponent>
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
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 20,
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
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    opacity: 0.6,
  },
});