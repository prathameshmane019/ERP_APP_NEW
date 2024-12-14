import React, { useState, useEffect, useContext } from 'react';
import { View, ActivityIndicator, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';
import ErrorBoundary from 'react-native-error-boundary';
import AttendanceLoader from './components/Loader';
import AuthContext from './AuthContext';

export default function HomeScreen() {
  const { user, loading } = useContext(AuthContext);

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
    console.log('HomeScreen useEffect triggered');
    console.log('Loading state:', loading);
    console.log('User state:', JSON.stringify(user));
    if (!loading) {
      console.log('Loading is false, checking user');
      
      if (!user) {
        console.log('No user found, redirecting to login');
        router.replace('/(auth)/login');
      } else if (user.role === 'faculty') {
        console.log('Faculty user, redirecting to faculty menu');
        router.replace('/(faculty)/menu');
      } else if (user.role === 'student') {
        console.log('Student user, redirecting to student home');
        router.replace('/(student)');
      } else {
        console.error('Unknown user role:', user?.role);
        router.replace('/login');
      }
    } else {
      console.log('Still loading, waiting...');
    }
  }, [loading, user, router]);

  return ( 
    <ErrorBoundary FallbackComponent={CustomFallback}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {loading ? (
          <AttendanceLoader isVisible={true}/>
        ) : (
          <Text>Loading complete. Redirecting...</Text>
        )}
      </View>
    </ErrorBoundary>
  );
}