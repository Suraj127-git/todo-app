import { Animated, StyleSheet } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';

export default function SwipeDeleteComponent({ children, onDelete }) {
  const { colors, isDark } = useTheme();

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
    <Swipeable
      renderRightActions={renderRightActions}
      onSwipeableOpen={onDelete}
    >
      {children}
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  deleteBox: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 10,
    marginVertical: 8,
  },
});