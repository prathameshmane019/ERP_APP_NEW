import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
export default function App() {
  const router = useRouter()
  const { user,loading } = useContext(AuthContext);

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
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
