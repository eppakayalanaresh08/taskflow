import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from './Icon';
import { useTaskStore } from '../store/taskStore';

interface HeaderProps {
  title?: string;
  onPressSort?: () => void;
  rightAction?: React.ReactNode;
  showAIButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Tasks',
  onPressSort,
  rightAction,
  showAIButton = true,
}) => {
  const setAIModalOpen = useTaskStore(state => state.setAIModalOpen);

  return (
    <View style={styles.headerContainer}>
      <View style={styles.titleRow}>
        <View style={styles.leftSide}>
          {showAIButton ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setAIModalOpen(true)}
              style={styles.aiButton}
              accessibilityLabel="Open AI Assistant"
            >
              <Icon name="sparkle" size={18} color="#4F46E5" />
            </TouchableOpacity>
          ) : (
            <View style={styles.placeholderSide} />
          )}
        </View>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.rightSide}>
          {rightAction ? (
            rightAction
          ) : onPressSort ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onPressSort}
              style={styles.sortButton}
              accessibilityLabel="Sort tasks"
            >
              <Icon name="sort" size={20} color="#334155" />
            </TouchableOpacity>
          ) : (
            <View style={styles.placeholderSide} />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  leftSide: {
    width: 40,
    alignItems: 'flex-start',
  },
  placeholderSide: {
    width: 40,
  },
  aiButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EEF2FF',
    borderWidth: 1.5,
    borderColor: '#C7D2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  rightSide: {
    width: 40,
    alignItems: 'flex-end',
  },
  sortButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 0,
    shadowColor: 'transparent',
    shadowOpacity: 0,
  },
});
