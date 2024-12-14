
import React from 'react';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from './AuthContext';
import { Provider as PaperProvider } from "react-native-paper";
import theme from './theme';
import ErrorBoundary from 'react-native-error-boundary';
import ErrorFallbackComponent from './components/ErrorFallback';
import { View } from 'react-native';

const LoggingWrapper = ({ children }) => {
  useEffect(() => {
    console.log('Layout component mounted');
    return () => {
      console.log('Layout component unmounted');
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {/* Add a placeholder to ensure something is always rendered */}
      <View style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        height: 1, 
        backgroundColor: 'transparent' 
      }} />
      {children}
    </View>
  );
};

export default function Layout() {
  useEffect(() => {
    console.log('Layout function called');
  }, []);

  return (
    <LoggingWrapper>
    <ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
      <AuthProvider>
        <PaperProvider theme={theme}>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)/ResetPasswordScreen" options={{ headerShown: false }} />
            <Stack.Screen name="profile/index" options={{ headerShown: false }}/>
            <Stack.Screen name="+not-found" options={{ headerShown: false }}/>
            {/* <Stack.Screen name="(student)/view" options={{ title: 'Display Attendance' }} /> */}
            {/* <Stack.Screen name="update-info/index" options={{ title: 'Update Information' }} /> */}
          </Stack>      
        </PaperProvider>
      </AuthProvider>
    </ErrorBoundary>
    </LoggingWrapper>
  );
}