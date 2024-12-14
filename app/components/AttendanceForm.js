import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, HelperText } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CollapsibleCard from './card';
import  theme  from '../theme';

const AttendanceForm = ({
  selectedSubject,
  setSelectedSubject,
  selectedBatch,
  setSelectedBatch,
  selectedDate,
  setSelectedDate,
  selectedSession,
  setSelectedSession,
  availableSessions,
  handleTakeAttendance,
  profile,
  loading
}) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [subjectType, setSubjectType] = useState(null);

  useEffect(() => {
    if (selectedSubject) {
      const subject = profile?.subjects.find(s => s._id === selectedSubject);
      setSubjectType(subject?.subType);
      if (subject?.subType !== 'practical') {
        setSelectedBatch(null);
      }
    } else {
      setSubjectType(null);
      setSelectedBatch(null);
    }
  }, [selectedSubject, profile]);

  const handleSubjectSelection = (value) => {
    setSelectedSubject(value);
    setSelectedSession(null);
  };

  return (
    <CollapsibleCard title="Update Attendance" icon="clipboard-check">
      <View style={styles.formContainer}>
        <View style={styles.pickerContainer}>
          <MaterialCommunityIcons name="book" size={24} color={theme.colors.primary} />
          <Picker
            selectedValue={selectedSubject}
            onValueChange={handleSubjectSelection}
            style={styles.picker}
            enabled={!loading}
          >
            <Picker.Item label="Select Subject" value="" />
            {profile?.subjects.map((subject) => (
              <Picker.Item key={subject._id} label={subject.name} value={subject._id} />
            ))}
          </Picker>
        </View>
        <HelperText type="info" visible={!selectedSubject}>
          Please select a subject
        </HelperText>

        {subjectType === 'practical' && (
          <>
            <View style={styles.pickerContainer}>
              <MaterialCommunityIcons name="account-group" size={24} color={theme.colors.primary} />
              <Picker
                selectedValue={selectedBatch}
                onValueChange={setSelectedBatch}
                style={styles.picker}
                enabled={!loading}
              >
                <Picker.Item label="Select Batch" value="" />
                {profile?.subjects.find(s => s._id === selectedSubject)?.batch.map((batch) => (
                  <Picker.Item key={batch} label={`Batch ${batch}`} value={batch} />
                ))}
              </Picker>
            </View>
            <HelperText type="info" visible={!selectedBatch}>
              Please select a batch
            </HelperText>
          </>
        )}

        <Button
          mode="outlined"
          onPress={() => setDatePickerVisibility(true)}
          icon="calendar"
          style={styles.dateButton}
          disabled={loading}
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

        <View style={styles.pickerContainer}>
          <MaterialCommunityIcons name="clock-outline" size={24} color={theme.colors.primary} />
          <Picker
            selectedValue={selectedSession}
            onValueChange={setSelectedSession}
            style={styles.picker}
            enabled={!loading && availableSessions.length > 0}
          >
            <Picker.Item label="Select Session" value={null} />
            {availableSessions.map((session) => (
              <Picker.Item key={session.toString()} label={`Session ${session}`} value={session} />
            ))}
          </Picker>
        </View>
        <HelperText type="info" visible={availableSessions.length === 0}>
          No available sessions for the selected date
        </HelperText>

        <Button
          mode="contained"
          onPress={handleTakeAttendance}
          icon="check-circle"
          style={styles.takeAttendanceButton}
          // disabled={!selectedSubject || !selectedDate }
          loading={loading}
        >
          Take Attendance
        </Button>
      </View>
    </CollapsibleCard>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    gap: 10,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    paddingHorizontal: 8,
  },
  picker: {
    flex: 1,
    marginLeft: 8,
  },
  dateButton: {
    borderColor: theme.colors.primary,
    borderRadius: 8,
  },
  takeAttendanceButton: {
    marginTop: 1,
    borderRadius: 8,
  },
});

export default AttendanceForm;

