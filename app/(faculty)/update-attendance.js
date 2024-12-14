import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Provider as PaperProvider, Button, Text } from 'react-native-paper';
import axios from 'axios';
import theme from '../theme';
import AttendanceForm from '../components/AttendanceForm';
import StudentList from '../components/StudentListTable';
import TGSessionContent from '../components/TGSession';
import CourseContent from '../components/CourseContent';
import CollapsibleCard from '../components/card';
import getUserData from '../utils/getUser';
import AttendanceNotification from '../components/AttendanceAlert';
import AttendanceLoader from '../components/Loader';
import AuthContext from '../AuthContext';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function UpdateAttendance() {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedContentIds, setSelectedContentIds] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [profile, setProfile] = useState(null);
  const [subjectDetails, setSubjectDetails] = useState(null);
  const [availableSessions, setAvailableSessions] = useState([1, 2, 3, 4, 5, 6, 7]);
  const [pointInputs, setPointInputs] = useState([{ id: Date.now(), value: '' }]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceRecord, setAttendanceRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

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


  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchSubjectDetails = useCallback(async (subjectId, batchId, date, session) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/v2/update-attendance`, {
        params: {
          _id: subjectId,
          batchId: batchId || '',
          date: date.toISOString().split('T')[0],
          session
        }
      });

      const { subject, students, attendanceRecord } = response.data;
      setSubjectDetails(subject);
      setStudents(students || []);
      setAttendanceRecord(attendanceRecord);
      if (attendanceRecord) {
        setSelectedKeys(new Set(attendanceRecord.records.map(r => r.status === "present" ? r.student : null).filter(Boolean)));
        setSelectedContentIds(attendanceRecord.contents || []);
        if (subject.subType === 'tg') {
          setPointInputs(attendanceRecord.pointsDiscussed.map((point, index) => ({ id: index, value: point })) || [{ id: Date.now(), value: '' }]);
        }
      } else {
        setSelectedKeys(new Set());
        setSelectedContentIds([]);
        setPointInputs([{ id: Date.now(), value: '' }]);
      }
      setIsTableVisible(true);
      // showNotification("Subject details loaded successfully", "success");
    } catch (error) {
      console.error('Error fetching subject details:', error);
      showNotification("Failed to fetch subject details", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleTakeAttendance = useCallback(() => {
    if (selectedSubject && selectedDate && selectedSession) {
      fetchSubjectDetails(selectedSubject, selectedBatch, selectedDate, selectedSession);
    } else {
      showNotification("Please select subject, date, and session before taking attendance.", "warning");
    }
  }, [selectedSubject, selectedBatch, selectedDate, selectedSession, fetchSubjectDetails]);

  const updateAttendance = useCallback(async () => {
    if (!selectedSubject || !selectedSession) {
      showNotification("Please select a subject and session", "warning");
      return;
    }

    const presentStudentIds = Array.from(selectedKeys);

    const attendanceData = {
      subject: selectedSubject,
      session: selectedSession,
      attendanceRecords: students.map(student => ({
        student: student._id,
        status: presentStudentIds.includes(student._id) ? 'present' : 'absent'
      })),
      batchId: selectedBatch,
      date: selectedDate.toISOString().split('T')[0],
      ...(subjectDetails.subType === 'tg'
        ? {
          pointsDiscussed: pointInputs
            .filter(point => point.value.trim())
            .map(point => point.value.trim())
        }
        : { contents: selectedContentIds })
    };

    try {
      setLoading(true);
      const response = await axios.put(`${API_URL}/api/attendance`, attendanceData);
      setAttendanceRecord(response.data);
      showNotification("Attendance updated successfully", "success");
    } catch (error) {
      console.error('Failed to update attendance:', error);
      showNotification("Failed to update attendance", "error");
    } finally {
      setLoading(false);
    }
  }, [selectedSubject, selectedSession, subjectDetails, students, selectedKeys, selectedBatch, selectedDate, pointInputs, selectedContentIds]);

  const renderContent = () => {
    if (loading) {
      return <AttendanceLoader isVisible={true} />;
    }

    if (!isTableVisible) {
      return (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>Select subject, date, and session to view attendance</Text>
        </View>
      );
    }

    return (
      <>
        <CollapsibleCard title="Attendance Details" icon="clipboard-list">
          {subjectDetails.subType === 'tg' ? (
            <TGSessionContent
              pointsDiscussed={pointInputs.map(point => point.value)}
              setPointsDiscussed={(newPoints) => {
                setPointInputs(newPoints.map(value => ({
                  id: Date.now(),
                  value
                })));
              }}
            />
          ) : (
            <CourseContent
              subjectDetails={subjectDetails}
              selectedBatch={selectedBatch}
              selectedContentIds={selectedContentIds}
              setSelectedContentIds={setSelectedContentIds}
            />
          )}
        </CollapsibleCard>

        <StudentList
          students={students}
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
        />

        <Button
          mode="contained"
          icon="check-circle"
          onPress={updateAttendance}
          style={styles.updateButton}
          loading={loading}
          disabled={loading}
        >
          {attendanceRecord ? 'Update Attendance' : 'Submit Attendance'}
        </Button>
      </>
    );
  };

  return (
    <PaperProvider theme={theme}>
      <FlatList
        style={styles.container}
        ListHeaderComponent={() => (
          <AttendanceForm
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
            selectedBatch={selectedBatch}
            setSelectedBatch={setSelectedBatch}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedSession={selectedSession}
            setSelectedSession={setSelectedSession}
            availableSessions={availableSessions}
            handleTakeAttendance={handleTakeAttendance}
            profile={profile}
            loading={loading}
          />
        )}
        ListFooterComponent={renderContent}
        data={[]}
        keyExtractor={() => 'key'}
        renderItem={() => null}
      />
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
  },
  updateButton: {
    marginTop: 16,
    marginBottom: 82,
    marginHorizontal: 16,
  },
  noDataContainer: {
    alignItems: 'center',
    marginTop: 32,
    paddingHorizontal: 16,
  },
  noDataText: {
    fontSize: 18,
    color: theme.colors.primary,
    textAlign: 'center',
  },
});



