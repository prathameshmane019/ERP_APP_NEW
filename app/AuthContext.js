
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';

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

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const { data } = await axios.get(`${API_URL}/api/applogin`);
        const userData = await AsyncStorage.getItem('userData');
        const parsedUserData = JSON.parse(userData);
        setUser(parsedUserData);
      }
    } catch (error) {
      console.error('Error loading user:', error);
      // Clear token if validation fails
      await AsyncStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password, role) => {
    try {
      console.log(`Attempting login at: ${API_URL}/api/applogin`);
      const { data } = await axios.post(`${API_URL}/api/applogin`, {
        _id: username,
        password,
        role
      });
      // Store token and user data
      await AsyncStorage.setItem('token', data.token);
      const userData = data.user;
      setUser(userData);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));

      // Set authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    } catch (error) {
      console.error('Login error:', error.response?.data || error);
      throw new Error(error.response?.data?.msg || 'Login failed');
    }
  };

  const updateUser = async (updatedUserData) => {
    try {
      const { data } = await axios.put(`${API_URL}/api/v2/${updatedUserData.role}?_id=${updatedUserData._id}`, updatedUserData);
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      console.error('Profile update error:', error);
      throw new Error((error).response?.data?.msg || 'Failed to update profile');
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
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {React.Children.toArray(children)}
    </AuthContext.Provider>
  );
};

export default AuthContext;