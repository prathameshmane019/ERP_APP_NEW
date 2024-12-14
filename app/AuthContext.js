import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api';
import { useRouter } from 'expo-router';
import * as Network from 'expo-network';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  console.error('API_URL is not defined in the environment variables.');
}

const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => { },
  logout: async () => { },
  updateUser: async () => { },
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Comprehensive network and storage debugging
  const debugNetworkAndStorage = async () => {
    try {
      // Check network connectivity
      const networkState = await Network.getNetworkStateAsync();
      console.log('Network Connectivity:', {
        isConnected: networkState.isConnected,
        type: networkState.type
      });

      // Check AsyncStorage capabilities
      try {
        await AsyncStorage.setItem('debug_test', 'test_value');
        const testValue = await AsyncStorage.getItem('debug_test');
        console.log('AsyncStorage Test:', testValue === 'test_value' ? 'Working' : 'Failed');
        await AsyncStorage.removeItem('debug_test');
      } catch (storageError) {
        console.error('AsyncStorage Error:', storageError);
      }

      // List all stored keys
      const keys = await AsyncStorage.getAllKeys();
      console.log('Stored Keys:', keys);
    } catch (error) {
      console.error('Debug Network and Storage Error:', error);
    }
  };

  useEffect(() => {
    // Run comprehensive debugging
    debugNetworkAndStorage();
  }, []);

  useEffect(() => {
    console.log('AuthProvider Initial Load');
    console.log('Current API_URL:', API_URL);
    
    const loadUser = async () => {
      try {
        // Extended logging
        console.log('Starting user load process');
        
        // Retrieve token and user data
        const token = await AsyncStorage.getItem('token');
        const storedUserData = await AsyncStorage.getItem('userData');
        
        console.log('Retrieved Token:', !!token);
        console.log('Retrieved User Data:', !!storedUserData);

        if (token) {
          try {
           
            // Validate token with backend
            console.log('Attempting to validate token via:', `${API_URL}/api/applogin`);
            
            const { data } = await api.get(`${API_URL}/api/applogin`);
            console.log('Token Validation Response:', data);

            if (storedUserData) {
              const parsedUserData = JSON.parse(storedUserData);
              console.log('Parsed User Data:', parsedUserData);
              setUser(parsedUserData);
            }
          } catch (validateError) {
            console.error('Token Validation Error:', {
              message: validateError.message,
              response: validateError.response?.data,
              status: validateError.response?.status
            });

            // Clear invalid token and user data
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('userData');
            setUser(null);
          }
        } else {
          console.log('No token found, user not authenticated');
        }
      } catch (error) {
        console.error('Critical Error in User Load:', {
          message: error.message,
          stack: error.stack
        });
      } finally {
        console.log('Setting loading to false');
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (username, password, role) => {
    try {
      console.log(`Attempting login at: ${API_URL}/api/applogin`);
      const { data } = await api.post(`${API_URL}/api/applogin`, {
        _id: username,
        password,
        role
      });
      
      console.log('Login Response:', {
        tokenReceived: !!data.token,
        userRole: data.user?.role
      });

      // Store token and user data
      await AsyncStorage.setItem('token', data.token);
      const userData = data.user;
      setUser(userData);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));

      // Set authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      
      return userData;
    } catch (error) {
      console.error('Detailed Login Error:', {
        errorType: error.name,
        message: error.message,
        responseData: error.response?.data,
        responseStatus: error.response?.status,
        requestDetails: {
          username,
          role
        }
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Remove stored data
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userData');

      // Remove authorization header
      delete axios.defaults.headers.common['Authorization'];

      // Reset user state
      setUser(null);

      // Redirect to login
      router.replace("/(auth)/login");
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };
  const updateUser = async (updatedUserData) => {
    try {
      const { data } = await api.put(`${API_URL}/api/v2/${updatedUserData.role}?_id=${updatedUserData._id}`, updatedUserData);
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      console.error('Profile update error:', error);
      throw new Error((error).response?.data?.msg || 'Failed to update profile');
    }
  };

  // Rest of the implementation remains the same
  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;