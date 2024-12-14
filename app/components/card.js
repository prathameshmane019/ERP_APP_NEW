
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {  StyleSheet } from 'react-native';
import theme  from '../theme';
import { Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { IconButton } from 'react-native-paper';
const CollapsibleCard = ({ title, children, icon }) => {
    const [isExpanded, setIsExpanded] = useState(true);
  
    return (
      <Card style={styles.card}>
        <Card.Title
          title={title}
          left={(props) => <MaterialCommunityIcons {...props} name={icon} size={24} color={theme.colors.primary} />}
          right={(props) => (
            <IconButton
              {...props}
              icon={isExpanded ? 'chevron-up' : 'chevron-down'}
              onPress={() => setIsExpanded(!isExpanded)}
            />
          )}
        />
        {isExpanded && <Card.Content>{children}</Card.Content>}
      </Card>
    );
  };
  const styles = StyleSheet.create({
       card: {
      marginBottom: theme.spacing.md,
      elevation: 2,
      borderRadius: theme.borderRadius.lg,
    },
    
  });
export default CollapsibleCard;  