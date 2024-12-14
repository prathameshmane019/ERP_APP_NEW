import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import {
  Provider as PaperProvider,
  Card,
  Title,
  Text,
  Button,
  Appbar,
  Avatar,
  Divider,
  TextInput,
} from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AuthContext from '../AuthContext';
import theme from '../theme';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const getCurrentAcademicYear = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const academicYearStart = currentMonth >= 6 ? currentYear : currentYear - 1;
  const academicYearEnd = academicYearStart + 1;
  return `${academicYearStart}-${academicYearEnd}`;
};

const getAcademicYears = (count = 5) => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 0; i < count; i++) {
    const startYear = currentYear - i;
    const endYear = startYear + 1;
    years.push(`${startYear}-${endYear}`);
  }
  return years;
};

export default function ProfileScreen({ navigation }) {
  const { user, logout, updateUser } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);

  // Profile Edit Modal State
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || '',
    currentYear: user?.currentYear || '',
    sem: user?.sem || 'sem1'
  });


  const handleSaveProfile = async () => {
    try {
      // Validate input
      if (!editedProfile.name.trim()) {
        Alert.alert('Error', 'Name cannot be empty');
        return;
      }

      // Call update user API
      const updatedUser = await updateUser({
        ...user,
        ...editedProfile
      });

      // Close modal
      setIsEditModalVisible(false);
      
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Profile update error:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const renderEditModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isEditModalVisible}
      onRequestClose={() => setIsEditModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Title style={styles.modalTitle}>Edit Profile</Title>
          
          <TextInput
            label="Name"
            value={editedProfile.name}
            onChangeText={(text) => setEditedProfile({...editedProfile, name: text})}
            style={styles.input}
            mode="outlined"
          />
          
          <TextInput
            label="Email"
            value={editedProfile.email}
            onChangeText={(text) => setEditedProfile({...editedProfile, email: text})}
            style={styles.input}
            mode="outlined"
            keyboardType="email-address"
          />
          
          <TextInput
            label="Department"
            value={editedProfile.department}
            onChangeText={(text) => setEditedProfile({...editedProfile, department: text})}
            style={styles.input}
            mode="outlined"
          />
          
          <View style={styles.pickerContainer}>
            <Text>Academic Year</Text>
            <Picker
              selectedValue={editedProfile.currentYear}
              onValueChange={(itemValue) => setEditedProfile({...editedProfile, currentYear: itemValue})}
              style={styles.picker}
            >
              {getAcademicYears().map((year) => (
                <Picker.Item key={year} label={year} value={year} />
              ))}
            </Picker>
          </View>
          
          <View style={styles.pickerContainer}>
            <Text>Semester</Text>
            <Picker
              selectedValue={editedProfile.sem}
              onValueChange={(itemValue) => setEditedProfile({...editedProfile, sem: itemValue})}
              style={styles.picker}
            >
              <Picker.Item label="Semester 1" value="sem1" />
              <Picker.Item label="Semester 2" value="sem2" />
            </Picker>
          </View>
          
          <View style={styles.modalButtonContainer}>
            <Button 
              mode="outlined" 
              onPress={() => setIsEditModalVisible(false)}
              style={styles.modalButton}
            >
              Cancel
            </Button>
            <Button 
              mode="contained" 
              onPress={handleSaveProfile}
              style={styles.modalButtonSave}
            >
              Save
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <PaperProvider>
      <Appbar.Header>
        <Appbar.Content title="Profile" />
        <Appbar.Action icon="logout" onPress={() => logout()} />
      </Appbar.Header>
      
      <ScrollView contentContainerStyle={styles.container}>
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Avatar.Icon size={80} icon="account" style={styles.avatar} />
            <TouchableOpacity 
              style={styles.editProfileButton}
              onPress={() => setIsEditModalVisible(true)}
            >
              <Icon name="pencil" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileInfo}>
            <Title style={styles.name}>{user?.name}</Title>
            <Text style={styles.role}>{user?.role}</Text>
            
            <Divider style={styles.divider} />
            
            <View style={styles.detailRow}>
              <Icon name="email" size={20} style={styles.detailIcon} />
              <Text style={styles.detailText}>{user?.email}</Text>
            </View>
            
            {user?.department && (
              <View style={styles.detailRow}>
                <Icon name="office-building" size={20} style={styles.detailIcon} />
                <Text style={styles.detailText}>{user?.department || "Department"}</Text>
              </View>
            )}
            
            <View style={styles.detailRow}>
              <Icon name="calendar" size={20} style={styles.detailIcon} />
              <Text style={styles.detailText}>
                Academic Year: {user?.currentYear || 'Not Set'}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Icon name="book-open" size={20} style={styles.detailIcon} />
              <Text style={styles.detailText}>
                Semester: {user?.sem === 'sem1' ? 'Semester 1' : 'Semester 2'}
              </Text>
            </View>
          </View>
        </Card>

        <Card style={styles.subjectsCard}>
          <Card.Content>
            <View style={styles.subjectHeader}>
              <Title>Assigned Subjects</Title>
            </View>
            
            { user?.subjects?.length > 0 ? (
              user?.subjects?.map((subject, index) => (
                <View key={index} style={styles.subjectItem}>
                  <View style={styles.subjectDetails}>
                    <Text style={styles.subjectName}>{subject.name}</Text>
                    <Text style={styles.subjectCode}>
                      {subject.id} | {subject.class.id || 'No Class'} | {subject.subType}
                    </Text>
                  </View>
                  <Icon name="book-open-variant" size={24} color="#666" />
                </View>
              ))
            ) : (
              <Text style={styles.noSubjectsText}>
                No subjects assigned for the selected academic year and semester.
              </Text>
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      {renderEditModal()}
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: theme.colors.inverseOnSurface,
  },
  profileCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 4,
  },
  profileHeader: {
    alignItems: 'center',
    position: 'relative',
    paddingTop: 20,
  },
  avatar: {
    backgroundColor:theme.colors.primary,
  },
  editProfileButton: {
    position: 'absolute',
    right: 16,
    top: 10,
    backgroundColor:theme.colors.primary,
    borderRadius: 20,
    width: 40,
    color:theme.colors.primaryDark,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  name: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  role: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  detailIcon: {
    marginRight: 10,
    color:theme.colors.primaryDark,
  },
  detailText: {
    fontSize: 16,
    
  },
  divider: {
    marginVertical: 16,
  },
  subjectsCard: {
    borderRadius: 12,
    elevation: 4,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  subjectFilters: {
    flexDirection: 'row',
  },
  yearPicker: {
    width: 120,
  },
  semPicker: {
    width: 100,
  },
  subjectItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  subjectDetails: {
    flex: 1,
    marginRight: 10,
    
  },
  subjectName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subjectCode: {
    fontSize: 14,
    color: '#666',
  },
  noSubjectsText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },

  
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.backdrop,
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    maxHeight: '90%',
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  pickerContainer: {
    marginBottom: 15,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    // backgroundColor:theme.colors.primary

  },
  modalButton: {
    width: '48%',

  },
  modalButtonSave: {
    width: '48%',
    backgroundColor:theme.colors.primary
    
  }
});