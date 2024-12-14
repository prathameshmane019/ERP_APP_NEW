import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import LottieView from 'lottie-react-native';

export default function AttendanceLoader ({ isVisible, size = 200 }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          tension: 40,
          useNativeDriver: true
        })
      ]).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <BlurView intensity={15} style={StyleSheet.absoluteFill}>
      <Animated.View 
        style={[
          styles.loaderContainer, 
          { 
            opacity: fadeAnim,
          }
        ]}
      >
        <Animated.View 
          style={[
            styles.loaderContent,
            {
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <LottieView
            source={require('../../assets/animations/loader.json')}
            autoPlay
            loop
            style={[styles.lottieLoader, { width: size, height: size }]}
          />
        </Animated.View>
      </Animated.View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:60
  },
  loaderContent: {
    alignItems: 'center',
  },
  lottieLoader: {
    alignSelf: 'center',
  },
});

