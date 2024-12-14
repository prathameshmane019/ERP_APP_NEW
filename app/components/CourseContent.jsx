import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { List, Checkbox, Text } from 'react-native-paper';
import theme  from '../theme';

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

  const renderItem = ({ item: content }) => (
    <List.Item
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
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Course Content</Text>
      <FlatList
        data={uncoveredContent}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: theme.colors.primary,
  },
  list: {
    maxHeight: 300,
  },
  contentItem: {
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: theme.colors.surface,
  },
});

export default CourseContent;

