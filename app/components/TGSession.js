import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import theme  from '../theme';
import { Button, Card, TextInput, Title } from 'react-native-paper';
import { View } from 'moti';



const TGSessionContent = ({ 
  pointsDiscussed = [''], 
  setPointsDiscussed 
}) => {
  const handleAddPoint = () => {
    setPointsDiscussed([...pointsDiscussed, '']);
  };

  const handleRemovePoint = (index) => {
    const newPoints = pointsDiscussed.filter((_, i) => i !== index);
    setPointsDiscussed(newPoints.length ? newPoints : ['']);
  };

  const handlePointChange = (index, newValue) => {
    const newPoints = [...pointsDiscussed];
    newPoints[index] = newValue;
    setPointsDiscussed(newPoints);
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.cardTitle}>TG Session Points</Title>
        {pointsDiscussed.map((point, index) => (
          <View key={index} style={styles.pointInputContainer}>
            <TextInput
              value={point}
              onChangeText={(text) => handlePointChange(index, text)}
              style={styles.pointInput}
              placeholder={`Point ${index + 1}`}
            />
            {pointsDiscussed.length > 1 && (
              <Button
                icon="close-circle"
                onPress={() => handleRemovePoint(index)}
                style={styles.removeButton}
              />
            )}
          </View>
        ))}
        <Button
          mode="outlined"
          onPress={handleAddPoint}
          style={styles.addPointButton}
        >
          Add Point
        </Button>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.md,
    elevation: 2,
    borderRadius: theme.borderRadius.lg,
  },
  pointInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  pointInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 6,
    fontSize: 16,
  },
  removeButton: {
    marginLeft: 8,
  },
  addPointButton: {
    marginTop: 8,
  },
  cardTitle: {
    marginBottom: 8,
  }
});

export default TGSessionContent;