
import React, { useState, useContext, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableOpacity, 
  StatusBar,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import AuthContext from '../AuthContext';
import { 
  Text, 
  TextInput, 
  ActivityIndicator,
  Button,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import theme from '.././theme'
import AttendanceNotification from '../components/AttendanceAlert';
import AttendanceLoader from '../components/Loader';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('faculty');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const { login, user, loading: authLoading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (user && !authLoading) {
      redirectUser(role);
    }
  }, [user,role, authLoading]);

  const redirectUser = () => {
    console.log(role);
    if (role === 'faculty') {
      router.replace('/(faculty)/menu');
      // router.back()
    } else if (role === 'student') {
      router.replace('/view');
    }
  };

  const handleLogin = async () => {
    if(!username && !password){
      showNotification( 'Please enter username and password', 'error'  )
      return null 
    }
    
    setIsLoading(true);
   
    try {
        console.log(username,role,password);
        await login(username, password, role);
    
      showNotification(  'Password reset successfully', 'success'  );
    } catch (error) {
      showNotification( 'Invalid credentials', 'error'  )
    } 
      finally {
      setIsLoading(false);
    }
  };

  if (authLoading || user) return null;

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="school-outline" size={64} color={theme.colors.primary} />
          <Text style={styles.title}>College ERP</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.roleContainer}>
            <TouchableOpacity 
              style={[styles.roleButton, role === 'faculty' && styles.activeRoleButton]}
              onPress={() => setRole('faculty')}
            >
              <Text style={[styles.roleButtonText, role === 'faculty' && styles.activeRoleButtonText]}>
                Faculty
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.roleButton, role === 'student' && styles.activeRoleButton]}
              onPress={() => setRole('student')}
            >
              <Text style={[styles.roleButtonText, role === 'student' && styles.activeRoleButtonText]}>
                Student
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            label="Username"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            mode="outlined"
            left={<TextInput.Icon icon="account" />}
            disabled={isLoading}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={styles.input}
            mode="outlined"
            left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon 
                icon={showPassword ? "eye-off" : "eye"} 
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            disabled={isLoading}
          />

          <TouchableOpacity    onPress={() => router.replace('/(auth)/ResetPasswordScreen')}  style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <Button
            mode="contained"
            onPress={handleLogin}
            disabled={isLoading}
            style={styles.loginButton}
            contentStyle={styles.loginButtonContent}
            labelStyle={styles.loginButtonLabel}
            loading={isLoading}
          >
            Login
          </Button>
        </View>
      </View>
      <AttendanceLoader isVisible={isLoading} />
      
      {notification && (
  <AttendanceNotification
    message={notification.message || ''}
    type={notification.type || 'info'}
    onDismiss={() => setNotification(null)}
  />
)}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.md,
  },
  form: {
    width: '100%',
    maxWidth: 400,
  },
  roleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginHorizontal: 5,
  },
  roleButtonText: {
    color: '#555',
  },
  activeRoleButton: {
    backgroundColor: theme.colors.primary,
  },
  activeRoleButtonText: {
    color: '#fff',
  },
  input: {
    marginBottom: theme.spacing.md,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: theme.spacing.md,
  },
  forgotPasswordText: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.sm,
  },
  loginButton: {
    marginTop: theme.spacing.md,
    backgroundColor:theme.colors.primary
  },
  loginButtonContent: {
    height: 48,
  },
  loginButtonLabel: {
    fontSize: theme.fontSize.md,
    fontWeight: 'bold',
  },
});

