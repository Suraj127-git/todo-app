import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import { ThemeProvider, useTheme } from './theme/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import React from 'react';

const Stack = createStackNavigator();

function ThemeToggleButton() {
  const { isDark, toggleTheme, colors } = useTheme();
  return (
    <TouchableOpacity onPress={toggleTheme} style={{ marginRight: 15 }}>
      <Feather 
        name={isDark ? 'sun' : 'moon'} 
        size={24} 
        color={isDark ? colors.dark.text : colors.light.text} 
      />
    </TouchableOpacity>
  );
}

function NavigationWrapper() {
  const { colors, isDark } = useTheme();

  return (
    <NavigationContainer
      theme={{
        colors: {
          background: isDark ? colors.dark.background : colors.light.background,
          card: isDark ? colors.dark.headerBg : colors.light.headerBg,
          text: isDark ? colors.dark.text : colors.light.text,
          border: 'transparent',
          primary: isDark ? colors.dark.icon : colors.light.icon,
        },
        dark: isDark,
        fonts: {
          regular: {
            fontFamily: 'System',
            fontWeight: '400'
          },
          medium: {
            fontFamily: 'System',
            fontWeight: '500'
          },
          bold: {
            fontFamily: 'System',
            fontWeight: '700'
          }
        }
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerTitleStyle: {
            fontFamily: 'System',
            fontWeight: '600'
          },
        }}
      >
        <Stack.Screen
          name="Reminder Notes"
          component={HomeScreen}
          options={{
            title: 'Reminder Notes',
            headerTitleAlign: 'center',
            headerRight: () => <ThemeToggleButton />,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <NavigationWrapper />
    </ThemeProvider>
  );
}