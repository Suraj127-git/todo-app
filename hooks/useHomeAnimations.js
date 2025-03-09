import { useState, useEffect } from 'react';
import { Animated, Easing } from 'react-native'; // Add Easing import here

export const useHomeAnimations = () => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(300));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.exp), // Now using imported Easing
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return { fadeAnim, slideAnim };
};