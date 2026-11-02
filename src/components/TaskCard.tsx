import React, { memo } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Task } from '../types/task';
import { colors, borderRadius } from '../theme';
import { Icon } from './Icon';

interface TaskCardProps {
  task: Task;
  onPress: (taskId: string | number) => void;
  onToggleStatus: (taskId: string | number) => void;
}

const TaskCardComponent: React.FC<TaskCardProps> = ({
  task,
  onPress,
  onToggleStatus,
}) => {
  const isCompleted = task.completed;

  // Determine left accent bar color based on priority
  const getPriorityColor = () => {
    switch (task.priority) {
      case 'High':
        return colors.priorityHigh;
      case 'Medium':
        return colors.priorityMedium;
      case 'Low':
      default:
        return colors.priorityLow;
    }
  };

  // Determine category badge background & vector icon theme
  const getCategoryTheme = () => {
    switch (task.category) {
      case 'Work':
        return {
          bg: colors.categoryWorkBg,
          color: colors.categoryWork,
          iconName: 'work' as const,
        };
      case 'Personal':
        return {
          bg: colors.categoryPersonalBg,
          color: colors.categoryPersonal,
          iconName: 'personal' as const,
        };
      case 'Study':
        return {
          bg: colors.categoryStudyBg,
          color: colors.categoryStudy,
          iconName: 'study' as const,
        };
      default:
        return {
          bg: '#EFF6FF',
          color: colors.primary,
          iconName: 'personal' as const,
        };
    }
  };

  const categoryTheme = getCategoryTheme();
  const priorityColor = getPriorityColor();

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={() => onPress(task.id)}
      style={styles.cardContainer}
      accessibilityRole="button"
      accessibilityLabel={`Task: ${task.title}. Status: ${
        isCompleted ? 'Completed' : 'Pending'
      }`}
    >
      {/* Left priority accent indicator strip */}
      <View
        style={[
          styles.accentBar,
          { backgroundColor: priorityColor },
        ]}
      />

      <View style={styles.cardInner}>
        {/* Circular Checkbox with Vector Checkmark */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onToggleStatus(task.id)}
          style={[
            styles.checkboxCircle,
            isCompleted && styles.checkboxCompleted,
          ]}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isCompleted }}
          accessibilityLabel={`Mark ${task.title} as ${
            isCompleted ? 'pending' : 'completed'
          }`}
        >
          {isCompleted && (
            <Icon name="check" size={13} color="#FFFFFF" />
          )}
        </TouchableOpacity>

        {/* Category Avatar Badge with Vector Icon */}
        <View
          style={[
            styles.categoryAvatar,
            { backgroundColor: categoryTheme.bg },
          ]}
        >
          <Icon
            name={categoryTheme.iconName}
            size={18}
            color={categoryTheme.color}
          />
        </View>

        {/* Task Title & Category */}
        <View style={styles.textContainer}>
          <Text
            numberOfLines={1}
            style={[
              styles.taskTitle,
              isCompleted && styles.taskTitleCompleted,
            ]}
          >
            {task.title}
          </Text>
          <View style={styles.subtitleRow}>
            <Text style={styles.categoryText}>
              {task.category}
            </Text>
            {task.subtasks && task.subtasks.length > 0 && (
              <Text style={styles.subtaskCount}>
                {` • ${task.subtasks.filter(st => st.completed).length}/${task.subtasks.length}`}
              </Text>
            )}
          </View>
        </View>

        {/* Right Info: Time Badge */}
        {task.estimatedTime && (
          <View style={styles.rightBadgeContainer}>
            <View style={styles.timeBadge}>
              <Text style={styles.timeBadgeText}>
                {task.estimatedTime}
              </Text>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

// Optimized with React.memo with custom comparison
export const TaskCard = memo(TaskCardComponent, (prev, next) => {
  return (
    prev.task.id === next.task.id &&
    prev.task.title === next.task.title &&
    prev.task.completed === next.task.completed &&
    prev.task.priority === next.task.priority &&
    prev.task.category === next.task.category &&
    prev.task.estimatedTime === next.task.estimatedTime &&
    prev.task.subtasks?.length === next.task.subtasks?.length &&
    prev.task.updatedAt === next.task.updatedAt
  );
});

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginBottom: 10,
    marginHorizontal: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    // Zero shadows
    elevation: 0,
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  accentBar: {
    width: 4,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },
  cardInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  checkboxCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.8,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#FFFFFF',
  },
  checkboxCompleted: {
    backgroundColor: colors.successDark,
    borderColor: colors.successDark,
  },
  categoryAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 8,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 3,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  subtaskCount: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
  },
  rightBadgeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeBadge: {
    backgroundColor: '#EDF5FD',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: borderRadius.pill,
  },
  timeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#3B82F6',
  },
});
