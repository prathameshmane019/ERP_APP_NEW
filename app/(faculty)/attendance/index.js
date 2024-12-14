import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import  theme  from '../../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;

export default function FacultyMenuScreen() {
  const router = useRouter();
  const [faculty, setFaculty] = useState(null);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];

  useEffect(() => {
    let isMounted = true;

    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData && isMounted) {
          const parsedUserData = JSON.parse(userData);
          setFaculty(parsedUserData);
          
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
              toValue: 0,
              duration: 800,
              useNativeDriver: true,
            })
          ]).start();
        }
      } catch (error) {
        console.error('Failed to fetch user data', error);
      }
    };

    fetchUserData();
    return () => { isMounted = false; };
  }, [fadeAnim, slideAnim]);

  const MenuButton = ({ icon, title, subtitle, onPress, gradient }) => (
    <TouchableOpacity 
      style={styles.menuButton} 
      onPress={onPress}
    >
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.menuButtonGradient}
      >
        <View style={styles.menuButtonContent}>
          <View style={styles.menuButtonLeft}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name={icon} color="white" size={24} />
            </View>
            <View style={styles.menuButtonText}>
              <Text style={styles.menuButtonTitle}>{title}</Text>
              <Text style={styles.menuButtonSubtitle}>{subtitle}</Text>
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-right" color="white" size={20} />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const DetailItem = ({ icon, label, value }) => (
    <View style={styles.detailItem}>
      <View style={styles.detailIconContainer}>
        <MaterialCommunityIcons name={icon} color={theme.colors.primary} size={20} />
      </View>
      <View style={styles.detailContent}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={['#f6f7f9', '#ffffff']}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={[
            styles.content,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.profileHeader}>
            <LinearGradient
              colors={['#4facfe', '#00f2fe']}
              style={styles.profileHeaderGradient}
            >
              <View style={styles.profileAvatar}>
                <MaterialCommunityIcons name="account" color="white" size={40} />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.name}>{faculty?.name}</Text>
                <Text style={styles.designation}>Faculty, {faculty?.department}</Text>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.detailsCard}>
            <DetailItem 
              icon="email"
              label="Email Address"
              value={faculty?.email}
            />
            <DetailItem 
              icon="book-open"
              label="Current Year"
              value={faculty?.currentYear}
            />
            <DetailItem 
              icon="briefcase"
              label="Subjects"
              value={faculty?.subjects?.map(subject => subject.name).join(', ') || 'No Subjects'}
            />
          </View>

          <View style={styles.menuGrid}>
            <MenuButton 
              icon="calendar"
              title="Take Attendance"
              subtitle="Mark today's attendance"
              gradient={['#4facfe', '#00f2fe']}
              onPress={() => router.push('/(faculty)/take-attendance')}
            />
            <MenuButton 
              icon="clock"
              title="Update Attendance"
              subtitle="Modify previous records"
              gradient={['#43e97b', '#38f9d7']}
              onPress={() => router.push('/(faculty)/update-attendance')}
            />
          </View>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    padding: 16,
  },
  profileHeader: {
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  profileHeaderGradient: {
    padding: 24,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileInfo: {
    marginLeft: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  designation: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  detailsCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(79,172,254,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: theme.colors.secondary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '500',
  },
  menuGrid: {
    gap: 16,
  },
  menuButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuButtonGradient: {
    padding: 20,
  },
  menuButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuButtonText: {
    flex: 1,
  },
  menuButtonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  menuButtonSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
});