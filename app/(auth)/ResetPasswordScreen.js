import React, { useState } from 'react';
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
import {
  Text,
  TextInput,
  Button,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import theme from '../theme';
import AttendanceNotification from '../components/AttendanceAlert';
import AttendanceLoader from '../components/Loader';

const { width } = Dimensions.get('window');

export default function ResetPasswordScreen() {
  const [identifier, setIdentifier] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const router = useRouter();
  const API_URL = process.env.API_URL;

  const handleSubmit = async () => {

    if (!identifier && !oldPassword && !newPassword) {
      showNotification('Please enter username and passwords', 'error')
      return null
    }
    setIsLoading(true);
    try {

      const response = await axios.post(`${API_URL}/api/reset-password`, { identifier, oldPassword, newPassword });
      if (response.status === 200) {
        showNotification('Password reset successfully', 'success');
        setTimeout(() => router.push("/login"), 3000);
      } else {
        showNotification('Password reset failed', 'error');
      }
    } catch (error) {
      console.error('Failed to reset password', error);
      showNotification('Failed to reset password', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="key-outline" size={64} color={theme.colors.primary} />
          <Text style={styles.title}>Reset Password</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            label="User ID"
            value={identifier}
            onChangeText={setIdentifier}
            style={styles.input}
            mode="outlined"
            left={<TextInput.Icon icon="account" />}
            disabled={isLoading}
          />

          <TextInput
            label="Old Password"
            value={oldPassword}
            onChangeText={setOldPassword}
            secureTextEntry={!showOldPassword}
            style={styles.input}
            mode="outlined"
            left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon
                icon={showOldPassword ? "eye-off" : "eye"}
                onPress={() => setShowOldPassword(!showOldPassword)}
              />
            }
            disabled={isLoading}
          />

          <TextInput
            label="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!showNewPassword}
            style={styles.input}
            mode="outlined"
            left={<TextInput.Icon icon="lock-reset" />}
            right={
              <TextInput.Icon
                icon={showNewPassword ? "eye-off" : "eye"}
                onPress={() => setShowNewPassword(!showNewPassword)}
              />
            }
            disabled={isLoading}
          />

          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={() => router.replace('/')}
              style={styles.cancelButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.resetButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              loading={isLoading}
              disabled={isLoading}
            >
              Reset
            </Button>
          </View>
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
};

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
  input: {
    marginBottom: theme.spacing.md,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
  },
  cancelButton: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  resetButton: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    backgroundColor: theme.colors.primary

  },
  buttonContent: {
    height: 48,
  },
  buttonLabel: {
    fontSize: theme.fontSize.md,
    fontWeight: 'bold',
    
  },
});


