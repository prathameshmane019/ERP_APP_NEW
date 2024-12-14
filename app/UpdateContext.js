
import React, { createContext, useState, useContext, useEffect } from 'react';
import * as Updates from 'expo-updates';

const UpdateContext = createContext({
  updateInfo: {
    isUpdateAvailable: false,
    lastChecked: null,
    currentVersion: null,
    updateDetails: null,
    error: null
  },
  checkForUpdates: async () => {},
  performUpdate: async () => {}
});

export const UpdateProvider = ({ children }) => {
  const [updateInfo, setUpdateInfo] = useState({
    isUpdateAvailable: false,
    lastChecked: null,
    currentVersion: null,
    updateDetails: null,
    error: null
  });

  const checkForUpdates = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      
      setUpdateInfo(prev => ({
        ...prev,
        isUpdateAvailable: update.isAvailable,
        lastChecked: new Date().toISOString(),
        currentVersion: Updates.currentlyRunning.id,
        error: null
      }));

      if (update.isAvailable) {
        const updateDetails = await fetchUpdateDetails();
        setUpdateInfo(prev => ({
          ...prev,
          updateDetails
        }));
      }
    } catch (error) {
      setUpdateInfo(prev => ({
        ...prev,
        error: error instanceof Error ? error?.message : 'Unknown error'
      }));
    }
  };

  const performUpdate = async () => {
    try {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    } catch (error) {
      setUpdateInfo(prev => ({
        ...prev,
        error: error instanceof Error ? error?.message : 'Update failed'
      }));
    }
  };

  const fetchUpdateDetails = async () => ({
    version: '1.1.0',
    description: 'Performance improvements and bug fixes',
    size: '2.5 MB',
    releaseDate: new Date().toISOString()
  });

  useEffect(() => {
    checkForUpdates();
  }, []);

  return (
    <UpdateContext.Provider value={{
      updateInfo,
      checkForUpdates,
      performUpdate
    }}>
      {React.Children.toArray(children)}
    </UpdateContext.Provider>
  );
};

// Custom hook with error handling
export const useUpdateContext = () => {
  const context = useContext(UpdateContext);
  if (context === undefined) {
    throw new Error('useUpdateContext must be used within an UpdateProvider');
  }
  return context;
};

export default UpdateContext;