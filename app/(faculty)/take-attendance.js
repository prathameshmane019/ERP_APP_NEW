
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, ScrollView, Alert, StyleSheet, TextInput, Pressable } from 'react-native';
import { Provider as PaperProvider, Card, Title, Paragraph, Button, Checkbox, List, Divider, DataTable, IconButton, Text } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import axios from 'axios';
import getUserData from '../utils/getUser';
import theme from '../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import StudentList from '../components/StudentListTable';
import CollapsibleCard from '../components/card';
import TGSessionContent from '../components/TGSession';
import AttendanceLoader from '../components/Loader';
import AttendanceNotification from '../components/AttendanceAlert';
import { useContext } from 'react';
import AuthContext from '../AuthContext';
const API_URL = process.env.EXPO_PUBLIC_API_URL;

const AttendanceForm = ({
  selectedSubject,
  setSelectedSubject,
  selectedBatch,
  setSelectedBatch,
  selectedDate,
  setSelectedDate,
  selectedSessions,
  setSelectedSessions,
  availableSessions,
  handleTakeAttendance,
  profile
}) => {

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const handleSessionToggle = (session) => {
    setSelectedSessions(prevSessions => {
      if (prevSessions.includes(session)) {
        return prevSessions.filter(s => s !== session);
      } else {
        return [...prevSessions, session];
      }
    });
  };
  return (
    <CollapsibleCard title="Take Attendance" icon="clipboard-check">
      <View style={styles.formContainer}>
        <View style={styles.pickerContainer}>
          <MaterialCommunityIcons name="book" size={24} color={theme.colors.primary} />
          <Picker
            selectedValue={selectedSubject}
            onValueChange={setSelectedSubject}
            style={styles.picker}
          >
            <Picker.Item label="Select Subject" value="" />
            {profile?.subjects.map((subject) => (
              <Picker.Item key={subject._id} label={subject.name} value={subject._id} />
            ))}
          </Picker>
        </View>

        {selectedSubject && profile?.subjects.find(s => s._id === selectedSubject)?.subType === 'practical' && (
          <View style={styles.pickerContainer}>
            <MaterialCommunityIcons name="account-group" size={24} color={theme.colors.primary} />
            <Picker
              selectedValue={selectedBatch}
              onValueChange={setSelectedBatch}
              style={styles.picker}
            >
              <Picker.Item label="Select Batch" value="" />
              {profile?.subjects.find(s => s._id === selectedSubject)?.batch.map((batch) => (
                <Picker.Item key={batch} label={`Batch ${batch}`} value={batch} />
              ))}
            </Picker>
          </View>
        )}

        <Button
          mode="outlined"
          onPress={() => setDatePickerVisibility(true)}
          icon="calendar"
          style={styles.dateButton}
        >
          {selectedDate.toDateString()}
        </Button>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={(date) => {
            setSelectedDate(date);
            setDatePickerVisibility(false);
          }}
          onCancel={() => setDatePickerVisibility(false)}
        />
        <Title style={styles.sectionTitle}>Select Sessions</Title>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sessionScrollView}>
          <View style={styles.sessionContainer}>
            {availableSessions.map(session => (
              <Checkbox.Item
                key={session}
                label={`${session}`}
                status={selectedSessions.includes(session) ? 'checked' : 'unchecked'}
                onPress={() => handleSessionToggle(session)}
                style={styles.sessionCheckbox}
                labelStyle={styles.sessionLabel}
              />
            ))}
          </View>
        </ScrollView>
        <Button
          mode="contained"
          onPress={handleTakeAttendance}
          icon="check-circle"
          style={styles.takeAttendanceButton}
        >
          Take Attendance
        </Button>
      </View>
    </CollapsibleCard>
  );
};


const CourseContent = ({
  subjectDetails,
  selectedBatch,
  selectedContentIds,
  setSelectedContentIds
}) => {
  const uncoveredContent = subjectDetails.content.filter(content => {
    const batchStatus = subjectDetails.subType === 'practical'
      ? content.batchStatus?.find(b => b.batchId === selectedBatch)
      : null;
    const isCovered = subjectDetails.subType === 'practical'
      ? batchStatus?.status === 'covered'
      : content.status === 'covered';
    return !isCovered;
  });

  return (
    <CollapsibleCard title="Course Content" icon="book-open-variant">
      {uncoveredContent.map((content) => (
        <List.Item
          key={content._id}
          title={content.title}
          description={content.description}
          left={props => <List.Icon {...props} icon="book-outline" />}
          right={() => (
            <Checkbox
              status={selectedContentIds.includes(content._id) ? 'checked' : 'unchecked'}
              onPress={() => {
                setSelectedContentIds(prev =>
                  prev.includes(content._id)
                    ? prev.filter(id => id !== content._id)
                    : [...prev, content._id]
                )
              }}
            />
          )}
          style={styles.contentItem}
        />
      ))}
    </CollapsibleCard>
  );
};




export default function TakeAttendance() {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [selectedContentIds, setSelectedContentIds] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [profile, setProfile] = useState(null);
  const [subjectDetails, setSubjectDetails] = useState(null);
  const [selectedSessions, setSelectedSessions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSessions, setAvailableSessions] = useState([]);
  const [pointsDiscussed, setPointsDiscussed] = useState(['']);

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };
  const { user } = useContext(AuthContext);
 
  useEffect(() => {
    if (user) {
      setProfile(user)
      setLoading(false)
    }
    else{
      setLoading(true)
    }
  }, [user]);


  const fetchAvailableSessions = useCallback(async (subjectId, batchId, date) => {
    setLoading(true)
    try {

      const response = await axios.get(`${API_URL}/api/utils/available-sessions?subjectId=${subjectId}&batchId=${batchId || ''}&date=${date.toISOString().split('T')[0]}`);
      setAvailableSessions(response.data.availableSessions);
    } catch (error) {
      console.error('Error fetching available sessions:', error);
    }
    finally {
      setLoading(false)

    }
  }, []);

  const fetchSubjectDetails = useCallback(async (subjectId, batchId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/v2/utils/attendance-data?_id=${subjectId}&batchId=${batchId || ''}`);
      const { subject, students } = response.data;
      setSubjectDetails(subject);
      setStudents(students || []);
      // showNotification("Subject details loaded successfully", "success");
    } catch (error) {
      console.error('Error fetching subject details:', error);
      showNotification("Failed to fetch subject details", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedSubject && selectedDate) {
      fetchSubjectDetails(selectedSubject, selectedBatch);
      fetchAvailableSessions(selectedSubject, selectedBatch, selectedDate);
    }
  }, [selectedSubject, selectedBatch, selectedDate, fetchSubjectDetails, fetchAvailableSessions]);

  const handleTakeAttendance = useCallback(() => {
    if (selectedSubject && selectedDate && selectedSessions.length > 0) {
      setIsTableVisible(true);
      fetchSubjectDetails(selectedSubject, selectedBatch);
    } else {
      showNotification("Please select subject, date, and at least one session", "warning");
    }
  }, [selectedSubject, selectedDate, selectedSessions, selectedBatch, fetchSubjectDetails]);

  const submitAttendance = useCallback(async () => {
    if (!selectedSubject || selectedSessions.length === 0) {
      showNotification("Please select a subject and at least one session", "warning");
      return;
    }

    const presentStudentIds = Array.from(selectedKeys);
    const attendanceData = {
      subject: selectedSubject,
      institute: profile.institute._id,
      subType: subjectDetails?.subType,
      date: selectedDate.toISOString().split('T')[0],
      session: selectedSessions,
      attendanceRecords: students.map(student => ({
        student: student._id,
        status: presentStudentIds.includes(student._id) ? 'present' : 'absent'
      })),
      batchId: selectedBatch,
      ...(subjectDetails.subType === 'tg'
        ? { pointsDiscussed: pointsDiscussed.filter(point => point.trim() !== '') }
        : { contents: selectedContentIds })
    };

    setLoading(true);
    try { 
      const response = await axios.put(`${API_URL}/api/v2/attendance`, attendanceData);
    
      showNotification("Attendance submitted successfully", "success");

      // Reset form
      setSelectedSubject("");
      setSelectedBatch(null);
      setIsTableVisible(false);
      setSelectedSessions([]);
      setSelectedKeys(new Set());
      setPointsDiscussed(['']);
    } catch (error) {
      console.error('Failed to submit attendance:', error);
      showNotification("Failed to submit attendance", "error");

    }
    finally {
      setLoading(false);

    }
  }, [selectedSubject, selectedSessions, subjectDetails, students, selectedKeys, selectedBatch, selectedDate, pointsDiscussed, selectedContentIds]);

  const [isFormVisible, setIsFormVisible] = useState(true);

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <ScrollView style={styles.scrollView}>
            <AttendanceForm
              selectedSubject={selectedSubject}
              setSelectedSubject={setSelectedSubject}
              selectedBatch={selectedBatch}
              setSelectedBatch={setSelectedBatch}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedSessions={selectedSessions}
              setSelectedSessions={setSelectedSessions}
              availableSessions={availableSessions}
              handleTakeAttendance={handleTakeAttendance}
              profile={profile}
              isFormVisible={isFormVisible}
              setIsFormVisible={setIsFormVisible}
            />

            {isTableVisible && subjectDetails && (
              <>
                {subjectDetails.subType === 'tg' ? (
                  <TGSessionContent
                    pointsDiscussed={pointsDiscussed}
                    setPointsDiscussed={setPointsDiscussed}
                  />
                ) : (
                  <CourseContent
                    subjectDetails={subjectDetails}
                    selectedBatch={selectedBatch}
                    selectedContentIds={selectedContentIds}
                    setSelectedContentIds={setSelectedContentIds}
                  />
                )}

                <StudentList
                  students={students}
                  selectedKeys={selectedKeys}
                  setSelectedKeys={setSelectedKeys}
                />
              </>
            )}
            {isTableVisible && (
              <Button
                mode="contained"
                onPress={submitAttendance}
                style={styles.submitButton}
                labelStyle={styles.submitButtonLabel}
              >
                Submit Attendance
              </Button>

            )}
          </ScrollView>

        </View>
      </View>
      <AttendanceLoader isVisible={loading} />
      {notification && (
        <AttendanceNotification
          message={notification.message || ''}
          type={notification.type || 'info'}
          onDismiss={() => setNotification(null)}
        />
      )}
    </PaperProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  card: {
    marginBottom: theme.spacing.md,
    elevation: 2,
    borderRadius: theme.borderRadius.lg,
  },
  formContainer: {
    gap: theme.spacing.md,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.sm,
  },
  picker: {
    flex: 1,
    marginLeft: theme.spacing.sm,


  },
  dateButton: {
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
  },
  sessionsScroll: {
    marginVertical: theme.spacing.md,
  },
  sessionContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  sessionButton: {
    borderRadius: theme.borderRadius.md,
    minWidth: 100,
  },
  sessionButtonSelected: {
    backgroundColor: theme.colors.primary

  },
  takeAttendanceButton: {
    marginTop: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  contentItem: {
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
  },
  dataTable: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    overflow: 'scroll',
  },
  tableHeader: {
    backgroundColor: theme.colors.primary + '10',
  },
  tableRow: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  sessionsContainer: {
    marginTop: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: theme.spacing.sm,
    color: theme.colors.primary,
  },
  sessionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  sessionItem: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.surface,
  },
  sessionItemSelected: {
    backgroundColor: theme.colors.primary,
  },
  sessionText: {
    fontSize: 14,
    color: theme.colors.primary,
  },
  sessionTextSelected: {
    color: theme.colors.surface,
  },
  scrollView: {
    flex: 1,
    marginBottom: 80, // Space for submit button
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
    paddingTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },

  submitButton: {
    borderRadius: theme.borderRadius.md,
    height: 48,
    bottom: 0,
    left: 0,
    right: 0
  },
  submitButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  mainContent: {
    paddingBottom: 80, // Add space for fixed submit button
  }
  ,
  sectionTitle: {
    fontSize: 18,
    marginBottom: theme.spacing.md,
    color: theme.colors.primary,
  },
  checkboxGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    minWidth: 120,
  },
  sessionText: {
    fontSize: 16,
    marginLeft: theme.spacing.xs,
  },


  // Header styles
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.primary + '15',
    borderTopLeftRadius: theme.borderRadius.md,
    borderTopRightRadius: theme.borderRadius.md,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  tableContainer: {
    marginTop: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

});