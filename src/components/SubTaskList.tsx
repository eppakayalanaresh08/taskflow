import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SubTask } from '../types/task';
import { borderRadius } from '../theme';
import { Icon } from './Icon';

interface SubTaskListProps {
  subtasks: SubTask[];
  onToggleSubTask: (id: string) => void;
  onAddSubTask: (title: string) => void;
  onRemoveSubTask: (id: string) => void;
}

export const SubTaskList: React.FC<SubTaskListProps> = ({
  subtasks,
  onToggleSubTask,
  onAddSubTask,
  onRemoveSubTask,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const handleAdd = () => {
    if (newTitle.trim()) {
      onAddSubTask(newTitle.trim());
      setNewTitle('');
      setIsAdding(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>Sub Task</Text>

      {/* Subtasks list */}
      {subtasks.map(sub => (
        <View key={sub.id} style={styles.subtaskRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onToggleSubTask(sub.id)}
            style={styles.subtaskLeft}
          >
            <View
              style={[
                styles.checkbox,
                sub.completed && styles.checkboxChecked,
              ]}
            >
              {sub.completed && <Icon name="check" size={13} color="#FFFFFF" />}
            </View>
            <Text
              style={[
                styles.subtaskTitle,
                sub.completed && styles.subtaskTitleCompleted,
              ]}
            >
              {sub.title}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onRemoveSubTask(sub.id)}
            style={styles.removeBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Icon name="close" size={14} color="#94A3B8" />
          </TouchableOpacity>
        </View>
      ))}

      {/* Inline add input or + button */}
      {isAdding ? (
        <View style={styles.inputRow}>
          <TextInput
            style={styles.inlineInput}
            value={newTitle}
            onChangeText={setNewTitle}
            placeholder="Enter subtask title..."
            placeholderTextColor="#94A3B8"
            autoFocus
            onSubmitEditing={handleAdd}
            returnKeyType="done"
          />
          <TouchableOpacity
            style={styles.confirmAddBtn}
            onPress={handleAdd}
          >
            <Text style={styles.confirmAddText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelAddBtn}
            onPress={() => {
              setIsAdding(false);
              setNewTitle('');
            }}
          >
            <Text style={styles.cancelAddText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setIsAdding(true)}
          style={styles.addTriggerBtn}
        >
          <View style={styles.plusCircle}>
            <Icon name="plus" size={15} color="#475569" />
          </View>
          <Text style={styles.addTriggerText}>Add Sub Task</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 10,
  },
  subtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  subtaskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.6,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  subtaskTitle: {
    fontSize: 14,
    color: '#1E293B',
    flex: 1,
  },
  subtaskTitleCompleted: {
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  removeBtn: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  addTriggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  plusCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  addTriggerText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  inlineInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: borderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 14,
    color: '#0F172A',
  },
  confirmAddBtn: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
  },
  confirmAddText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  cancelAddBtn: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  cancelAddText: {
    color: '#64748B',
    fontSize: 13,
  },
});
