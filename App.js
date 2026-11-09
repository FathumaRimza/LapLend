
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

import AppNavigator from './src/navigation/AppNavigator';
import { initDatabase } from './src/db/database';
import { COLORS } from './src/components/theme';

export default function App() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    initDatabase()
      .then(() => setReady(true))
      .catch((e) =>
        setError(e.message || 'Could not open the local database.')
      );
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
      />

      {!ready ? (
        <View style={styles.loading}>
          {error ? (
            <Text style={styles.error}>Database error: {error}</Text>
          ) : (
            <>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>
                Preparing your offline laptop library...
              </Text>
            </>
          )}
        </View>
      ) : (
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 14,
    color: COLORS.muted,
    fontSize: 14,
  },
  error: {
    color: COLORS.danger,
    textAlign: 'center',
  },
});
