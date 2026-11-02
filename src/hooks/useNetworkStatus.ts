import { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useTaskStore } from '../store/taskStore';

export function useNetworkStatus() {
  const setIsOffline = useTaskStore(state => state.setIsOffline);

  useEffect(() => {
    // Check initial network state
    NetInfo.fetch().then(state => {
      const isConnected = state.isConnected && state.isInternetReachable !== false;
      setIsOffline(!isConnected);
    });

    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener(state => {
      const isConnected = state.isConnected && state.isInternetReachable !== false;
      setIsOffline(!isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, [setIsOffline]);
}

