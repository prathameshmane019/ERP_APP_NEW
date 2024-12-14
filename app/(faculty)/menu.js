import React, { useContext, useMemo } from 'react';
import { View, StyleSheet, StatusBar, Image, Dimensions } from 'react-native';
import { Text, TouchableRipple, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import AuthContext from '../AuthContext';
import theme from '../theme';
const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width - 32;
const CARD_HEIGHT = height * 0.2;

export default function ModuleSelectionScreen ()  {
  const router = useRouter();
  const { user, logout } = useContext(AuthContext);

  const modules = useMemo(() => [
    {
      name: 'Attendance',
      description: 'Track and manage attendance records',
      icon: 'calendar-check',
      gradient: ['#4facfe', '#00f2fe'],
      route: user?.role === 'faculty' ? '/(faculty)/attendance' : '/student/attendance'
    },
    {
      name: 'Feedback',
      description: 'Submit and review feedback',
      icon: 'message-text',
      gradient: ['#00e97b', '#3ff9d7'],
      route: user?.role === 'faculty' ? '/faculty/feedback' : '/student/feedback'
    },
    {
      name: user?.role === 'faculty' ? 'Course Management' : 'My Courses',
      description: 'Manage your academic courses',
      icon: 'book-open-variant',
      gradient: ['#fa709a', '#ffaa00'],
      route: user?.role === 'faculty' ? '/faculty/courses' : '/student/courses'
    }
  ], [user?.role]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={['rgba(0,0,0,0.05)', 'transparent']}
        style={styles.headerBackground}
      >
        <Animated.View 
          entering={FadeInUp}
          style={styles.headerContainer}
        >
          <View style={styles.headerLeft}>
            <Animated.Text 
              entering={FadeInRight.delay(300)}
              style={styles.greeting}
            >
              Welcome back,
            </Animated.Text>
            <Animated.Text 
              entering={FadeInRight.delay(400)}
              style={styles.userName}
            >
              {user?.name || 'User'}
            </Animated.Text>
            <View style={styles.instituteWrapper}>
              <Animated.Text 
                entering={FadeInRight.delay(500)}
                style={styles.instituteText}
              >
                {user?.institute?.name || 'Institution'}
              </Animated.Text>
              <View style={styles.instituteLine} />
            </View>
          </View>
          
          <View style={styles.headerRight}>
            <IconButton 
              icon="account-circle" 
              size={28}
              onPress={() => router.push('/profile')}
              iconColor={theme.colors.primary}
            />
            <IconButton 
              icon="update" 
              size={28}
              onPress={() => router.push('/update-info')}
              iconColor={theme.colors.primary}
            />
            <IconButton 
              icon="logout" 
              size={28}
              onPress={logout}
              iconColor={theme.colors.error}
            />
          </View>
        </Animated.View>
      </LinearGradient>

      <View style={styles.moduleGrid}>
        {modules.map((module, index) => (
          <MotiView
            key={module.name}
            from={{ opacity: 0, scale: 0.9, translateY: 20 }}
            animate={{ opacity: 1, scale: 1, translateY: 0 }}
            transition={{
              type: 'spring',
              delay: index * 150,
              damping: 15
            }}
            style={styles.moduleCardWrapper}
          >
            <TouchableRipple
              style={styles.moduleCard}
              onPress={() => router.push(module.route)}
              rippleColor="rgba(255,255,255,0.2)"
            >
              <LinearGradient
                colors={module.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.moduleContent}
              >
                <View style={styles.moduleTextContent}>
                  <Text style={styles.moduleName}>{module.name}</Text>
                  <Text style={styles.moduleDescription}>
                    {module.description}
                  </Text>
                </View>
                <IconButton
                  icon={module.icon}
                  size={40}
                  iconColor="white"
                  style={styles.moduleIcon}
                />
              </LinearGradient>
            </TouchableRipple>
          </MotiView>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerBackground: {
    paddingBottom: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 18,
    color: theme.colors.secondary,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  userName: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 12,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  instituteWrapper: {
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  instituteText: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.primary,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.05)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  instituteLine: {
    height: 3,
    width: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
    opacity: 0.7,
  },
  moduleGrid: {
    flex: 1,
    paddingHorizontal: 16,
  },
  moduleCardWrapper: {
    marginBottom: 16,
  },
  moduleCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  moduleContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
  },
  moduleTextContent: {
    flex: 1,
  },
  moduleName: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
  },
  moduleDescription: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  moduleIcon: {
    marginLeft: 16,
  },
});
