
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, ScrollView, Alert, StyleSheet, TextInput, Pressable } from 'react-native';
import { Checkbox, Text, Title } from 'react-native-paper';
import  theme  from '../theme';
import CollapsibleCard from './card';
// Improved Student Row Component
const StudentRow = React.memo(({ student, isSelected, onToggle }) => (
  <Pressable
    onPress={onToggle}
    style={[styles.studentRow, isSelected && styles.studentRowSelected]}
  >
    <View style={styles.checkboxCell}>
      <Checkbox
        status={isSelected ? 'checked' : 'unchecked'}
        onPress={onToggle}
      />
    </View>
    <View style={styles.rollNumberCell}>
      <Text style={styles.rollNumberText}>{student.rollNumber}</Text>
    </View>
    <View style={styles.nameCell}>
      <Text style={styles.nameText}>{student.name}</Text>
    </View>
  </Pressable>
));




const StudentList = React.memo(({ students, selectedKeys, setSelectedKeys }) => {
  const sortedStudents = useMemo(() => {
    return [...students].sort((a, b) => {
      const aNum = parseInt(a.rollNumber.replace(/\D/g, ''), 10);
      const bNum = parseInt(b.rollNumber.replace(/\D/g, ''), 10);
      return aNum - bNum;
    });
  }, [students]);

  const toggleStudent = useCallback((studentId) => {
    setSelectedKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(studentId)) {
        newSet.delete(studentId);
      } else {
        newSet.add(studentId);
      }
      return newSet;
    });
  }, [setSelectedKeys]);

  const toggleAll = useCallback(() => {
    setSelectedKeys(prev =>
      prev.size === students.length
        ? new Set()
        : new Set(students.map(s => s._id))
    );
  }, [students, setSelectedKeys]);

  return (
    <CollapsibleCard title="Students List" icon="account-multiple">
      <View style={styles.tableContainer}>
        <Pressable
          style={styles.tableHeader}
          onPress={toggleAll}
        >
          <View style={styles.checkboxColumn}>
            <Checkbox
              status={selectedKeys.size === students.length ? 'checked' : 'unchecked'}
              onPress={toggleAll}
            />
          </View>
          <View style={styles.rollNumberColumn}>
            <Title style={styles.headerText}>Roll No</Title>
          </View>
          <View style={styles.nameColumn}>
            <Title style={styles.headerText}>Name</Title>
          </View>
        </Pressable>

        <ScrollView style={styles.tableBody}>
          {sortedStudents.map((student) => (
            <StudentRow
              key={student._id}
              student={student}
              isSelected={selectedKeys.has(student._id)}
              onToggle={() => toggleStudent(student._id)}
            />
          ))}
          <View style={styles.summary}>
            <Text style={styles.summaryItem}>Total: {students.length}</Text>
            <Text style={styles.summaryItem}>Present: {selectedKeys.size}</Text>
            <Text style={styles.summaryItem}>Absent: {students.length - selectedKeys.size}</Text>
          </View>
        </ScrollView>
      </View>
    </CollapsibleCard>
  );
});
const styles = StyleSheet.create({
  card: {
 marginBottom: theme.spacing.md,
 elevation: 2,
 borderRadius: theme.borderRadius.lg,
},
summary: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: theme.spacing.md,
  padding: theme.spacing.sm,
  backgroundColor: theme.colors.background,
  borderRadius: theme.borderRadius.sm,
},
summaryItem: {
  fontWeight: 'bold',
  fontSize: theme.fontSize.sm,
  color: theme.colors.primary,
},
// New styles for student table
studentRow: {
  flexDirection: 'row',
  paddingVertical: theme.spacing.sm,
  paddingHorizontal: theme.spacing.md,
  borderBottomWidth: 1,
  borderBottomColor: theme.colors.border,
  backgroundColor: theme.colors.surface,
  alignItems: 'center',
},
studentRowSelected: {
  backgroundColor: theme.colors.primary + '10',
},
checkboxCell: {
  width: 50,
  justifyContent: 'center',
},
rollNumberCell: {
  flex: 1,
  paddingRight: theme.spacing.md,
},
nameCell: {
  flex: 2,
},
rollNumberText: {
  fontSize: 16,
  fontWeight: '500',
},
nameText: {
  fontSize: 16,
},

checkboxColumn: {
  flex: 0.5,
  justifyContent: 'center',
},
rollNumberColumn: {
  flex: 1,
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
export default StudentList