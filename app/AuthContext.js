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
    
    // In AuthContext.js
const loadUser = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    
    if (!token) {
      setLoading(false);
      return;
    }

    // Set token in axios defaults
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    try {
      const { data } = await api.get('/api/applogin');
      const storedUserData = await AsyncStorage.getItem('userData');
      
      if (storedUserData) {
        setUser(JSON.parse(storedUserData));
      }
    } catch (error) {
      // Clear invalid credentials
      await AsyncStorage.multiRemove(['token', 'userData']);
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
    }
  } catch (error) {
    console.error('Auth Error:', error);
  } finally {
    setLoading(false);
  }
};

// Add error interceptor in api.js
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Clear auth state on 401
      AsyncStorage.multiRemove(['token', 'userData']);
      delete api.defaults.headers.common['Authorization'];
    }
    return Promise.reject(error);
  }
);
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