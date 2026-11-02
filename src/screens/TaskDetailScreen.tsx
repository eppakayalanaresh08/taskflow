import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTaskStore } from '../store/taskStore';
import {
  Attachment,
  SubTask,
  TaskCategory,
  TaskPriority,
} from '../types/task';
import { colors, borderRadius, spacing, shadows } from '../theme';
import { SubTaskList } from '../components/SubTaskList';
import { AttachmentList } from '../components/AttachmentList';
import { Icon } from '../components/Icon';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import {
  parseDateString,
  formatDateToString,
  parseTimeString,
  formatTimeToString,
  to12HourFormat,
} from '../utils/nativePickerService';

export const TaskDetailScreen: React.FC = () => {
  const selectedTaskId = useTaskStore(state => state.selectedTaskId);
  const isCreatingNewTask = useTaskStore(state => state.isCreatingNewTask);
  const tasks = useTaskStore(state => state.tasks);
  const navigateBackToList = useTaskStore(state => state.navigateBackToList);
  const updateTask = useTaskStore(state => state.updateTask);
  const createTask = useTaskStore(state => state.createTask);
  const deleteTask = useTaskStore(state => state.deleteTask);

  // Find existing task if editing
  const existingTask = tasks.find(
    t => String(t.id) === String(selectedTaskId)
  );

  // Local form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false);
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [category, setCategory] = useState<TaskCategory>('Work');
  const [subtasks, setSubtasks] = useState<SubTask[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [dueDateFrom, setDueDateFrom] = useState('2025/09/02');
  const [dueTimeFrom, setDueTimeFrom] = useState('09:24 AM');
  const [dueDateTo, setDueDateTo] = useState('2025/09/02');
  const [dueTimeTo, setDueTimeTo] = useState('07:34 PM');

  // Dropdown expansion toggles
  const [isStatusPickerOpen, setIsStatusPickerOpen] = useState(false);
  const [isPriorityPickerOpen, setIsPriorityPickerOpen] = useState(false);
  const [isCategoryPickerOpen, setIsCategoryPickerOpen] = useState(false);

  // Real Native Date and Time Picker State
  const [showNativePicker, setShowNativePicker] = useState(false);
  const [nativePickerMode, setNativePickerMode] = useState<'date' | 'time'>('date');
  const [activePickerTarget, setActivePickerTarget] = useState<'from' | 'to'>('from');
  const [pickerDate, setPickerDate] = useState<Date>(new Date());

  const handleOpenDatePicker = (target: 'from' | 'to') => {
    setActivePickerTarget(target);
    setNativePickerMode('date');
    const currentValue = target === 'from' ? dueDateFrom : dueDateTo;
    setPickerDate(parseDateString(currentValue));
    setShowNativePicker(true);
  };

  const handleOpenTimePicker = (target: 'from' | 'to') => {
    setActivePickerTarget(target);
    setNativePickerMode('time');
    const currentValue = target === 'from' ? dueTimeFrom : dueTimeTo;
    setPickerDate(parseTimeString(currentValue));
    setShowNativePicker(true);
  };

  const handleNativePickerChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowNativePicker(false);

    if (event.type === 'set' && selectedDate) {
      if (nativePickerMode === 'date') {
        const formattedDate = formatDateToString(selectedDate);
        if (activePickerTarget === 'from') {
          setDueDateFrom(formattedDate);
        } else {
          setDueDateTo(formattedDate);
        }
      } else {
        const formattedTime = formatTimeToString(selectedDate);
        if (activePickerTarget === 'from') {
          setDueTimeFrom(formattedTime);
        } else {
          setDueTimeTo(formattedTime);
        }
      }
    }
  };

  // Form validation errors
  const [validationError, setValidationError] = useState<string | null>(null);

  // Hydrate form on mount or task change
  useEffect(() => {
    if (existingTask) {
      setTitle(existingTask.title);
      setDescription(existingTask.description || '');
      setCompleted(existingTask.completed);
      setPriority(existingTask.priority || 'Medium');
      setCategory(existingTask.category || 'Work');
      setSubtasks(existingTask.subtasks ? [...existingTask.subtasks] : []);
      setAttachments(existingTask.attachments ? [...existingTask.attachments] : []);
      setDueDateFrom(existingTask.dueDateFrom || '2025/09/02');
      setDueTimeFrom(to12HourFormat(existingTask.dueTimeFrom || '09:24 AM'));
      setDueDateTo(existingTask.dueDateTo || '2025/09/02');
      setDueTimeTo(to12HourFormat(existingTask.dueTimeTo || '07:34 PM'));
    } else {
      // New task defaults
      setTitle('');
      setDescription('');
      setCompleted(false);
      setPriority('High');
      setCategory('Work');
      setSubtasks([]);
      setAttachments([]);
      setDueDateFrom('2025/09/02');
      setDueTimeFrom('09:24 AM');
      setDueDateTo('2025/09/02');
      setDueTimeTo('07:34 PM');
    }
  }, [existingTask, isCreatingNewTask]);

  // Subtask handlers
  const handleToggleSubTask = (id: string) => {
    setSubtasks(prev =>
      prev.map(st => (st.id === id ? { ...st, completed: !st.completed } : st))
    );
  };

  const handleAddSubTask = (subTitle: string) => {
    const newSt: SubTask = {
      id: `st_${Date.now()}`,
      title: subTitle,
      completed: false,
    };
    setSubtasks(prev => [...prev, newSt]);
  };

  const handleRemoveSubTask = (id: string) => {
    setSubtasks(prev => prev.filter(st => st.id !== id));
  };

  // Attachment handlers
  const handleAddAttachment = (att: Attachment) => {
    setAttachments(prev => [...prev, att]);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  // Save handler with validation
  const handleSave = () => {
    if (!title.trim()) {
      setValidationError('Task title cannot be empty.');
      return;
    }

    if (title.trim().length < 2) {
      setValidationError('Task title must be at least 2 characters long.');
      return;
    }

    setValidationError(null);

    if (isCreatingNewTask || !existingTask) {
      createTask({
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        subtasks,
        attachments,
        dueDateFrom,
        dueTimeFrom,
        dueDateTo,
        dueTimeTo,
      });
    } else {
      updateTask(existingTask.id, {
        title: title.trim(),
        description: description.trim(),
        completed,
        category,
        priority,
        subtasks,
        attachments,
        dueDateFrom,
        dueTimeFrom,
        dueDateTo,
        dueTimeTo,
      });
      navigateBackToList();
    }
  };

  const handleDelete = () => {
    if (existingTask) {
      deleteTask(existingTask.id);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        {/* Top Header matching Image 2 */}
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={navigateBackToList}
            style={styles.backButton}
            accessibilityLabel="Go back to tasks list"
          >
            <Icon name="back" size={20} color="#065F46" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Task Detail</Text>

          {existingTask ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleDelete}
              style={styles.deleteHeaderBtn}
              accessibilityLabel="Delete task"
            >
              <Icon name="trash" size={20} color="#EF4444" />
            </TouchableOpacity>
          ) : (
            <View style={styles.headerRightPlaceholder} />
          )}
        </View>

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Validation Error Alert */}
          {validationError && (
            <View style={styles.errorAlert}>
              <View style={styles.errorAlertRow}>
                <Icon name="warning" size={16} color="#B91C1C" />
                <Text testID="validation-error-text" style={styles.errorAlertText}>
                  {' '}{validationError}
                </Text>
              </View>
            </View>
          )}

          {/* Task Name Input matching Image 2 */}
          <View style={styles.taskNameInputWrapper}>
            <TextInput
              testID="task-title-input"
              style={styles.taskNameInput}
              value={title}
              onChangeText={text => {
                setTitle(text);
                if (validationError) setValidationError(null);
              }}
              placeholder="Task Name"
              placeholderTextColor="#94A3B8"
              returnKeyType="next"
            />
          </View>

          {/* Status Row with Dropdown */}
          <View style={styles.pickerRow}>
            <Text style={styles.pickerRowLabel}>Status:</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsStatusPickerOpen(!isStatusPickerOpen)}
              style={styles.selectorPill}
            >
              <Text
                style={[
                  styles.selectorPillText,
                  completed ? styles.statusCompletedText : styles.statusPendingText,
                ]}
              >
                {completed ? 'Completed' : 'Pending'}
              </Text>
              <Icon name="chevron-down" size={14} color="#64748B" />
            </TouchableOpacity>
          </View>

          {isStatusPickerOpen && (
            <View style={styles.inlineDropdownMenu}>
              <TouchableOpacity
                style={styles.dropdownOption}
                onPress={() => {
                  setCompleted(false);
                  setIsStatusPickerOpen(false);
                }}
              >
                <Text style={styles.dropdownOptionText}>Pending</Text>
                {!completed && <Icon name="check" size={14} color="#16A34A" />}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dropdownOption}
                onPress={() => {
                  setCompleted(true);
                  setIsStatusPickerOpen(false);
                }}
              >
                <Text style={styles.dropdownOptionText}>Completed</Text>
                {completed && <Icon name="check" size={14} color="#16A34A" />}
              </TouchableOpacity>
            </View>
          )}

          {/* Priority Row with Dropdown */}
          <View style={styles.pickerRow}>
            <Text style={styles.pickerRowLabel}>Priority:</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsPriorityPickerOpen(!isPriorityPickerOpen)}
              style={styles.selectorPill}
            >
              <Text style={styles.selectorPillText}>{priority}</Text>
              <Icon name="chevron-down" size={14} color="#64748B" />
            </TouchableOpacity>
          </View>

          {isPriorityPickerOpen && (
            <View style={styles.inlineDropdownMenu}>
              {(['High', 'Medium', 'Low'] as TaskPriority[]).map(p => (
                <TouchableOpacity
                  key={p}
                  style={styles.dropdownOption}
                  onPress={() => {
                    setPriority(p);
                    setIsPriorityPickerOpen(false);
                  }}
                >
                  <Text style={styles.dropdownOptionText}>{p}</Text>
                  {priority === p && <Icon name="check" size={14} color="#16A34A" />}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Category Row with Dropdown */}
          <View style={styles.pickerRow}>
            <Text style={styles.pickerRowLabel}>Category:</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsCategoryPickerOpen(!isCategoryPickerOpen)}
              style={styles.selectorPill}
            >
              <Text style={styles.selectorPillText}>{category}</Text>
              <Icon name="chevron-down" size={14} color="#64748B" />
            </TouchableOpacity>
          </View>

          {isCategoryPickerOpen && (
            <View style={styles.inlineDropdownMenu}>
              {(['Work', 'Personal', 'Study', 'Health'] as TaskCategory[]).map(c => (
                <TouchableOpacity
                  key={c}
                  style={styles.dropdownOption}
                  onPress={() => {
                    setCategory(c);
                    setIsCategoryPickerOpen(false);
                  }}
                >
                  <Text style={styles.dropdownOptionText}>{c}</Text>
                  {category === c && <Icon name="check" size={14} color="#16A34A" />}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Sub Task List matching Image 2 */}
          <SubTaskList
            subtasks={subtasks}
            onToggleSubTask={handleToggleSubTask}
            onAddSubTask={handleAddSubTask}
            onRemoveSubTask={handleRemoveSubTask}
          />

          {/* Due Date Section matching Image 2 */}
          <View style={styles.dueDateSection}>
            <Text style={styles.sectionHeading}>Due Date:</Text>

            <View style={styles.dueDateGrid}>
              {/* From Column */}
              <View style={styles.dueCol}>
                <Text style={styles.dueSubLabel}>From</Text>
                <TouchableOpacity
                  testID="due-date-from-btn"
                  activeOpacity={0.7}
                  onPress={() => handleOpenDatePicker('from')}
                  style={styles.dateBox}
                  accessibilityLabel="Change start due date"
                >
                  <Text style={styles.dateBoxValue}>{dueDateFrom}</Text>
                  <Icon name="calendar" size={14} color="#64748B" />
                </TouchableOpacity>
                <TouchableOpacity
                  testID="due-time-from-btn"
                  activeOpacity={0.7}
                  onPress={() => handleOpenTimePicker('from')}
                  style={styles.timeBox}
                  accessibilityLabel="Change start due time"
                >
                  <Text style={styles.dateBoxValue}>{dueTimeFrom}</Text>
                  <Icon name="clock" size={14} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* To Column */}
              <View style={styles.dueCol}>
                <Text style={styles.dueSubLabel}>To</Text>
                <TouchableOpacity
                  testID="due-date-to-btn"
                  activeOpacity={0.7}
                  onPress={() => handleOpenDatePicker('to')}
                  style={styles.dateBox}
                  accessibilityLabel="Change end due date"
                >
                  <Text style={styles.dateBoxValue}>{dueDateTo}</Text>
                  <Icon name="calendar" size={14} color="#64748B" />
                </TouchableOpacity>
                <TouchableOpacity
                  testID="due-time-to-btn"
                  activeOpacity={0.7}
                  onPress={() => handleOpenTimePicker('to')}
                  style={styles.timeBox}
                  accessibilityLabel="Change end due time"
                >
                  <Text style={styles.dateBoxValue}>{dueTimeTo}</Text>
                  <Icon name="clock" size={14} color="#64748B" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Attachments Section matching Image 2 */}
          <AttachmentList
            attachments={attachments}
            onAddAttachment={handleAddAttachment}
            onRemoveAttachment={handleRemoveAttachment}
          />

          {/* Personal Notes / Description input */}
          <View style={styles.notesSection}>
            <Text style={styles.sectionHeading}>Personal Notes</Text>
            <TextInput
              style={styles.notesInput}
              value={description}
              onChangeText={setDescription}
              placeholder="Add personal notes, context or requirements..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Bottom Action Buttons matching Image 2 */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={navigateBackToList}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              testID="save-task-button"
              activeOpacity={0.8}
              onPress={handleSave}
              style={styles.saveButton}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Real Native System Date and Time Picker */}
        {showNativePicker && (
          <DateTimePicker
            testID="native-date-time-picker"
            value={pickerDate}
            mode={nativePickerMode}
            is24Hour={false}
            display="default"
            onChange={handleNativePickerChange}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 18,
    color: '#065F46',
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  deleteHeaderBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteHeaderIcon: {
    fontSize: 18,
  },
  headerRightPlaceholder: {
    width: 36,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  errorAlert: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: borderRadius.md,
    padding: 10,
    marginBottom: 14,
  },
  errorAlertRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorAlertText: {
    fontSize: 13,
    color: '#B91C1C',
    fontWeight: '600',
  },
  taskNameInputWrapper: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: borderRadius.pill,
    paddingHorizontal: 16,
    height: 48,
    justifyContent: 'center',
    marginBottom: 16,
  },
  taskNameInput: {
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '500',
    height: 48,
    paddingVertical: 0,
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#F8FAFC',
  },
  pickerRowLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },
  selectorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: borderRadius.md,
    paddingHorizontal: 14,
    paddingVertical: 6,
    minWidth: 110,
    justifyContent: 'space-between',
  },
  selectorPillText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  statusCompletedText: {
    color: '#16A34A',
  },
  statusPendingText: {
    color: '#D97706',
  },
  chevronIcon: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 6,
  },
  inlineDropdownMenu: {
    backgroundColor: '#F8FAFC',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
    overflow: 'hidden',
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  dropdownOptionText: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '500',
  },
  dropdownCheck: {
    color: '#16A34A',
    fontWeight: '700',
  },
  dueDateSection: {
    marginVertical: 12,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  dueDateGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  dueCol: {
    flex: 1,
  },
  dueSubLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 6,
  },
  dateBox: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: borderRadius.md,
    paddingHorizontal: 10,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    backgroundColor: '#FAFAFA',
  },
  timeBox: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: borderRadius.md,
    paddingHorizontal: 10,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAFAFA',
  },
  dateBoxValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
  dateInput: {
    fontSize: 13,
    color: '#1E293B',
    paddingVertical: 0,
  },
  notesSection: {
    marginVertical: 12,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: borderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1E293B',
    minHeight: 74,
    textAlignVertical: 'top',
    backgroundColor: '#FAFAFA',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: borderRadius.pill,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#475569',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#2E7D5A',
    borderRadius: borderRadius.pill,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 0,
    shadowColor: 'transparent',
    shadowOpacity: 0,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
