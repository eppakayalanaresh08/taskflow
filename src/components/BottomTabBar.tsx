import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { borderRadius } from '../theme';
import { Icon, IconName } from './Icon';

interface BottomTabBarProps {
  activeTab: 'today' | 'tasks' | 'plan' | 'focus' | 'settings';
  onSelectTab: (tab: 'today' | 'tasks' | 'plan' | 'focus' | 'settings') => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const tabs: {
    id: 'today' | 'tasks' | 'plan' | 'focus' | 'settings';
    label: string;
    icon: IconName;
  }[] = [
      { id: 'today', label: 'Today', icon: 'tab-today' },
      { id: 'tasks', label: 'Tasks', icon: 'tab-tasks' },
      { id: 'plan', label: 'Plan', icon: 'tab-plan' },
      { id: 'focus', label: 'AI Assistant', icon: 'sparkle' },
      { id: 'settings', label: 'Settings', icon: 'tab-settings' },
    ];

  return (
    <View style={styles.container}>
      <View style={styles.dock}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.7}
              onPress={() => onSelectTab(tab.id)}
              style={styles.tabButton}
            >
              <View
                style={[
                  styles.iconCapsule,
                  isActive && styles.iconCapsuleActive,
                ]}
              >
                <Icon
                  name={tab.icon}
                  size={20}
                  color={isActive ? '#2563EB' : '#64748B'}
                />
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  isActive && styles.tabLabelActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: '#EBF1F7',
    paddingBottom: 8,
    paddingTop: 4,
  },
  dock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 56,
  },
  iconCapsule: {
    width: 44,
    height: 28,
    borderRadius: borderRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  iconCapsuleActive: {
    backgroundColor: '#E0EEFD',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  tabLabelActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
});
