import { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { useTheme } from '../../theme/ThemeContext';

export const DateFilterComponent = ({ filterDate, setFilterDate }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { colors, isDark } = useTheme();

  const handleDateConfirm = (date) => {
    setFilterDate(date);
    setShowDatePicker(false);
  };

  return (
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
    </View>
  );
};

const styles = StyleSheet.create({
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
});