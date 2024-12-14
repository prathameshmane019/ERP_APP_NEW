import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  StyleSheet 
} from 'react-native';
import { useUpdateContext } from '.././UpdateContext';
import  theme  from '../theme';

const UpdateScreen = () => {
  const { updateInfo, checkForUpdates, performUpdate } = useUpdateContext();

  const formatDate = (dateString) => {
    return dateString 
      ? new Date(dateString).toLocaleString() 
      : 'Never';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>App Update Manager</Text>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Current Version</Text>
            <Text style={styles.infoValue}>
              {updateInfo.currentVersion || 'N/A'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Last Checked</Text>
            <Text style={styles.infoValue}>
              {formatDate(updateInfo.lastChecked)}
            </Text>
          </View>

          {updateInfo.isUpdateAvailable && updateInfo.updateDetails && (
            <View style={styles.updateNotice}>
              <Text style={styles.updateTitle}>Update Available</Text>
              
              <View style={styles.updateDetail}>
                <Text style={styles.detailLabel}>New Version:</Text>
                <Text style={styles.detailValue}>
                  {updateInfo.updateDetails.version}
                </Text>
              </View>
              
              <View style={styles.updateDetail}>
                <Text style={styles.detailLabel}>Description:</Text>
                <Text style={styles.detailValue}>
                  {updateInfo.updateDetails.description}
                </Text>
              </View>
              
              <View style={styles.updateDetail}>
                <Text style={styles.detailLabel}>Size:</Text>
                <Text style={styles.detailValue}>
                  {updateInfo.updateDetails.size}
                </Text>
              </View>
            </View>
          )}

          {updateInfo.error && (
            <Text style={styles.errorText}>
              {updateInfo.error}
            </Text>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            onPress={checkForUpdates}
            style={styles.checkButton}
          >
            <Text style={styles.buttonText}>Check Updates</Text>
          </TouchableOpacity>

          {updateInfo.isUpdateAvailable && (
            <TouchableOpacity 
              onPress={performUpdate}
              style={styles.updateButton}
            >
              <Text style={styles.buttonText}>Update Now</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.inverseOnSurface,
    paddingHorizontal: 16,
    paddingVertical: 24
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#2C3E50'
  },
  infoContainer: {
    width: '100%',
    backgroundColor: '#F7F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  infoLabel: {
    fontSize: 16,
    color: '#34495E',
    fontWeight: '600'
  },
  infoValue: {
    fontSize: 16,
    color: '#7F8C8D'
  },
  updateNotice: {
    backgroundColor: '#E8F4F8',
    borderRadius: 10,
    padding: 12,
    marginTop: 16
  },
  updateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2980B9',
    marginBottom: 12
  },
  updateDetail: {
    flexDirection: 'row',
    marginBottom: 8
  },
  detailLabel: {
    fontSize: 14,
    color: '#34495E',
    marginRight: 8,
    fontWeight: '500'
  },
  detailValue: {
    fontSize: 14,
    color: '#2C3E50',
    flex: 1
  },
  errorText: {
    color: '#E74C3C',
    textAlign: 'center',
    marginTop: 12
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  checkButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center'
  },
  updateButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default UpdateScreen;