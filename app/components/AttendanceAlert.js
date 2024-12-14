
import React, { useRef, useEffect } from 'react';
import {  Text, StyleSheet, Animated } from 'react-native';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { IconButton } from 'react-native-paper';

export default function AttendanceNotification  ({ 
  message='', 
  type = 'success', 
  duration = 3000,
  onDismiss 
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    const playSound = async () => {
      try {
        const soundSource = type === 'success' 
          ? require('../../assets/audio/success.wav')
          : require('../../assets/audio/error.wav');

        const { sound } = await Audio.Sound.createAsync(soundSource);
        await sound.playAsync();
        return () => sound.unloadAsync();
      } catch (error) {
        console.error('Error playing sound:', error);
      }
    };

    const triggerHaptics = () => {
      if (type === 'success') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    };

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.spring(translateYAnim, {
        toValue: 0,
        friction: 6,
        tension: 40,
        useNativeDriver: true
      })
    ]).start();

    playSound();
    triggerHaptics();

    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start(onDismiss);
    }, duration);

    return () => clearTimeout(timer);
  }, [message, type]);

  const getBackgroundColor = () => {
    switch(type) {
      case 'success': return '#4CAF50';
      case 'error': return '#F44336';
      case 'warning': return '#FF9800';
      default: return '#2196F3';
    }
  };

  const getIcon = () => {
    switch(type) {
      case 'success': return 'check-circle';
      case 'error': return 'alert-circle';
      case 'warning': return 'alert';
      default: return 'information';
    }
  };

  return (
    <Animated.View 
      style={[
        styles.notificationContainer, 
        { 
          backgroundColor: getBackgroundColor(),
          opacity: fadeAnim,
          transform: [{ translateY: translateYAnim }]
        }
      ]}
    >
      <IconButton
        icon={getIcon()}
        color="white"
        size={24}
        style={styles.icon}
      />
      <Text style={styles.notificationText}>{message.toString()}</Text>
      <IconButton
        icon="close"
        color="white"
        size={20}
        onPress={onDismiss}
        style={styles.closeButton}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  notificationContainer: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1001,
    elevation: 5,
  },
  icon: {
    marginRight: 10,
  },
  notificationText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  closeButton: {
    marginLeft: 10,
  },
});