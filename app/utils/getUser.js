import AsyncStorage from '@react-native-async-storage/async-storage';
export default async function getUserData (){
    try {
      const userData = await AsyncStorage.getItem('userData');
      return JSON.parse(userData);
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  };
