import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, borderRadius } from '../theme';

interface OfflineBannerProps {
  isOffline: boolean;
  onRetry: () => void;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  isOffline,
  onRetry,
}) => {
  if (!isOffline) return null;

  return (
    <View style={styles.bannerContainer}>
      <View style={styles.contentRow}>
        <View style={styles.dot} />
        <Text style={styles.bannerText}>
          Offline Mode • Showing saved tasks
        </Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onRetry}
        style={styles.retryButton}
      >
        <Text style={styles.retryText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: borderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D97706',
    marginRight: 8,
  },
  bannerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
  },
  retryButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.pill,
  },
  retryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

