import React, { useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useTaskStore } from './src/store/taskStore';
import { useNetworkStatus } from './src/hooks/useNetworkStatus';

function MainApp() {
  const initStore = useTaskStore(state => state.initStore);

  // Initialize network status listener
  useNetworkStatus();

  // Initialize store: hydrate cache, then fetch fresh tasks
  useEffect(() => {
    initStore();
  }, [initStore]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <AppNavigator />
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <MainApp />
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EEF4FA',
  },
  container: {
    flex: 1,
  },
});
