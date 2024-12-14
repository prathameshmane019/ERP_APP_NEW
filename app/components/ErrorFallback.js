import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Button, Text } from 'react-native-paper';
import LottieView from 'lottie-react-native';
// import * as Sentry from '@sentry/react-native';

const { width, height } = Dimensions.get('window');

const ErrorFallbackComponent = ({ error, resetError }) => {
  console.log("Error occured",error);
  
  const handleReportError = () => {
    // Uncomment and configure Sentry error reporting when ready
    // Sentry.captureException(error);
    
    // Optional: Add additional error reporting logic
    console.error('Reported Error:', error);
  };

  // Extract more detailed error information
  const errorMessage = error?.message || error?.toString() || 'Unknown Error';
  const errorStack = error?.stack || 'No stack trace available';

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../../assets/animations/security-research.json')} 
        autoPlay
        loop
        style={styles.animation}
      />
      
      <Text style={styles.title}>Oops! Something Went Wrong</Text>
      
      <ScrollView 
        style={styles.errorDetailsContainer}
        contentContainerStyle={styles.errorScrollContainer}
      >
        <Text style={styles.errorText}>Error Details:</Text>
        {/* <Text style={styles.errorMessageText}>{errorMessage}</Text> */}
        
        <Text style={styles.stackTraceTitle}>Stack Trace:</Text>
        <Text style={styles.stackTraceText} numberOfLines={10} ellipsizeMode="tail">
          {/* {errorStack} */}
        </Text>
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <Button 
          mode="contained" 
          onPress={resetError}
          style={styles.button}
        >
          Try Again
        </Button>
        
        <Button 
          mode="outlined" 
          onPress={handleReportError}
          style={styles.button}
        >
          Report Error
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  animation: {
    width: width * 0.7,
    height: height * 0.3,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginBottom: 15,
    textAlign: 'center',
  },
  errorDetailsContainer: {
    backgroundColor: '#FFEBEE',
    borderRadius: 10,
    marginVertical: 15,
    width: '90%',
    maxHeight: height * 0.3,
  },
  errorScrollContainer: {
    padding: 15,
  },
  errorText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginBottom: 10,
  },
  errorMessageText: {
    fontSize: 14,
    color: '#000',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  stackTraceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 10,
  },
  stackTraceText: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'monospace',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 20,
  },
  button: {
    width: '48%',
  },
});

export default ErrorFallbackComponent;