import React, { useState, useEffect, useContext } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import getUserData from './utils/getUser';
import ErrorBoundary from 'react-native-error-boundary';
import AttendanceLoader from './components/Loader';
import AuthContext from './AuthContext';

export default function HomeScreen() {
  const { user,loading } = useContext(AuthContext);

  const router = useRouter();
  const CustomFallback = (props) => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>An error occurred</Text>
      <Text>Error: {props.error.toString()}</Text>
      <Text>Error Details: {props.error.stack}</Text>
      <Button onPress={props.resetError} title="Try Again" />
    </View>
  );

 
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/(auth)/login');
      } else if (user.role === 'faculty') {
        router.replace('/(faculty)/menu');
      } else if (user.role === 'student') {
        router.replace('/(student)');
      } else {
        console.error('Unknown user role:', user?.role);
        router.replace('/login');
      }
    }
  }, [loading, user, router]);

  return ( 
    <ErrorBoundary FallbackComponent={CustomFallback}>
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <AttendanceLoader isVisible={loading}/>
    </View>
    </ErrorBoundary>
  );
}
