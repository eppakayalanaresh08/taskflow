import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, borderRadius } from '../theme';
import { TaskStatusFilter } from '../types/task';
import { Icon } from './Icon';

interface FilterTabsProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  selectedStatus: TaskStatusFilter;
  onSelectStatus: (status: TaskStatusFilter) => void;
  statusCounts: { all: number; pending: number; completed: number };
}

export const FilterTabs: React.FC<FilterTabsProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedStatus,
  onSelectStatus,
  statusCounts,
}) => {
  const categoryOptions = [
    { id: 'all', label: 'All', icon: undefined, color: undefined },
    { id: 'Personal', label: 'Personal', icon: 'personal' as const, color: '#0D9488' },
    { id: 'Work', label: 'Work', icon: 'work' as const, color: '#2563EB' },
  ];

  const statusOptions: { id: TaskStatusFilter; label: string; count: number }[] = [
    { id: 'all', label: 'All Tasks', count: statusCounts.all },
    { id: 'pending', label: 'Pending', count: statusCounts.pending },
    { id: 'completed', label: 'Completed', count: statusCounts.completed },
  ];

  return (
    <View style={styles.container}>
      {/* Category Pills matching Image 1 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryRow}
      >
        {categoryOptions.map(cat => {
          const isSelected =
            selectedCategory.toLowerCase() === cat.id.toLowerCase();
          return (
            <TouchableOpacity
              key={cat.id}
              activeOpacity={0.8}
              onPress={() => onSelectCategory(cat.id)}
              style={[
                styles.categoryPill,
                isSelected ? styles.categoryPillActive : styles.categoryPillInactive,
              ]}
            >
              {cat.icon && (
                <View style={styles.catIconWrapper}>
                  <Icon
                    name={cat.icon}
                    size={15}
                    color={isSelected ? '#FFFFFF' : cat.color || colors.textSecondary}
                  />
                </View>
              )}
              <Text
                style={[
                  styles.categoryPillText,
                  isSelected
                    ? styles.categoryPillTextActive
                    : styles.categoryPillTextInactive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Plus button matching Image 1 */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onSelectCategory('all')}
          style={styles.plusPill}
          accessibilityLabel="Add category filter"
        >
          <Icon name="plus" size={16} color="#64748B" />
        </TouchableOpacity>
      </ScrollView>

      {/* Status Segmented Filter: All | Pending | Completed */}
      <View style={styles.statusRow}>
        {statusOptions.map(status => {
          const isSelected = selectedStatus === status.id;
          return (
            <TouchableOpacity
              key={status.id}
              activeOpacity={0.7}
              onPress={() => onSelectStatus(status.id)}
              style={[
                styles.statusChip,
                isSelected && styles.statusChipActive,
              ]}
            >
              <Text
                style={[
                  styles.statusChipText,
                  isSelected && styles.statusChipTextActive,
                ]}
              >
                {status.label}
              </Text>
              <View
                style={[
                  styles.countBadge,
                  isSelected && styles.countBadgeActive,
                ]}
              >
                <Text
                  style={[
                    styles.countBadgeText,
                    isSelected && styles.countBadgeTextActive,
                  ]}
                >
                  {status.count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 6,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: borderRadius.pill,
    marginRight: 8,
  },
  categoryPillActive: {
    backgroundColor: '#437EE6',
  },
  categoryPillInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  catIconWrapper: {
    marginRight: 6,
  },
  categoryPillText: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
  },
  categoryPillTextInactive: {
    color: colors.textPrimary,
  },
  plusPill: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  statusChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  statusChipActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#3B82F6',
    elevation: 0,
    shadowColor: 'transparent',
    shadowOpacity: 0,
  },
  statusChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginRight: 6,
  },
  statusChipTextActive: {
    color: '#2563EB',
  },
  countBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.pill,
  },
  countBadgeActive: {
    backgroundColor: '#DBEAFE',
  },
  countBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  countBadgeTextActive: {
    color: '#2563EB',
  },
});
