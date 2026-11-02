import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { TaskSortBy } from '../types/task';
import { colors, borderRadius, shadows } from '../theme';
import { Icon } from './Icon';

interface SortModalProps {
  visible: boolean;
  currentSort: TaskSortBy;
  onSelectSort: (sort: TaskSortBy) => void;
  onClose: () => void;
}

export const SortModal: React.FC<SortModalProps> = ({
  visible,
  currentSort,
  onSelectSort,
  onClose,
}) => {
  const options: { id: TaskSortBy; label: string; desc: string }[] = [
    {
      id: 'dueDate',
      label: 'Due Date & Sections',
      desc: 'Today first, then Tomorrow, then Upcoming',
    },
    {
      id: 'priority',
      label: 'Priority',
      desc: 'High priority tasks first',
    },
    {
      id: 'status',
      label: 'Status',
      desc: 'Pending tasks first, completed at bottom',
    },
    {
      id: 'title',
      label: 'Task Title (A-Z)',
      desc: 'Alphabetical order',
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.sheetContainer}>
              <View style={styles.dragIndicator} />
              <Text style={styles.sheetTitle}>Sort Tasks By</Text>

              {options.map(opt => {
                const isSelected = currentSort === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    activeOpacity={0.7}
                    onPress={() => {
                      onSelectSort(opt.id);
                      onClose();
                    }}
                    style={[
                      styles.optionRow,
                      isSelected && styles.optionRowActive,
                    ]}
                  >
                    <View style={styles.optionInfo}>
                      <Text
                        style={[
                          styles.optionLabel,
                          isSelected && styles.optionLabelActive,
                        ]}
                      >
                        {opt.label}
                      </Text>
                      <Text style={styles.optionDesc}>{opt.desc}</Text>
                    </View>
                    {isSelected && <Icon name="check" size={18} color="#2563EB" />}
                  </TouchableOpacity>
                );
              })}

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onClose}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
  },
  dragIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: borderRadius.md,
    marginBottom: 6,
  },
  optionRowActive: {
    backgroundColor: '#EFF6FF',
  },
  optionInfo: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  optionLabelActive: {
    color: '#2563EB',
  },
  optionDesc: {
    fontSize: 12,
    color: '#64748B',
  },
  checkMark: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2563EB',
    marginLeft: 8,
  },
  closeButton: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: borderRadius.pill,
    alignItems: 'center',
    marginTop: 12,
  },
  closeButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },
});

