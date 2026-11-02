import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTaskStore } from '../store/taskStore';
import { borderRadius } from '../theme';
import { TaskCategory, TaskPriority } from '../types/task';
import { Header } from '../components/Header';
import { BottomTabBar } from '../components/BottomTabBar';
import { Icon } from '../components/Icon';

export const TodayScreen: React.FC = () => {
  const tasks = useTaskStore(state => state.tasks);
  const activeBottomTab = useTaskStore(state => state.activeBottomTab);
  const setActiveBottomTab = useTaskStore(state => state.setActiveBottomTab);
  const openTaskDetail = useTaskStore(state => state.openTaskDetail);
  const setAIModalOpen = useTaskStore(state => state.setAIModalOpen);

  const todayTasks = tasks.filter(t => t.section === 'TODAY' || !t.completed);

  return (
    <View style={styles.screen}>
      <Header title="Today's Flow" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.heroTitleRow}>
            <Text style={styles.heroTitle}>Today's Overview</Text>
            <Icon name="sparkle" size={18} color="#4F46E5" />
          </View>
          <Text style={styles.heroSubtitle}>
            You have {todayTasks.filter(t => !t.completed).length} pending tasks to crush today!
          </Text>
        </View>

        {/* Separate AI Planning Assistant Banner */}
        <TouchableOpacity
          style={styles.aiTodayBanner}
          activeOpacity={0.8}
          onPress={() => setAIModalOpen(true)}
        >
          <View style={styles.aiTodayBannerIcon}>
            <Icon name="sparkle" size={18} color="#4F46E5" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.aiTodayBannerTitle}>AI Assistant</Text>
            <Text style={styles.aiTodayBannerSubtitle}>
              Break down complex projects into actionable sprints
            </Text>
          </View>
          <Text style={styles.aiTodayBannerArrow}>→</Text>
        </TouchableOpacity>

        <Text style={styles.subheading}>Priority Items</Text>
        {todayTasks.slice(0, 4).map(task => (
          <TouchableOpacity
            key={task.id}
            style={styles.simpleCard}
            onPress={() => openTaskDetail(task.id)}
          >
            <Text style={styles.taskTitle}>{task.title}</Text>
            <Text style={styles.taskMeta}>
              {task.category} • {task.priority} Priority • {task.estimatedTime || '15m'}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <BottomTabBar
        activeTab={activeBottomTab}
        onSelectTab={setActiveBottomTab}
      />
    </View>
  );
};

export const PlanScreen: React.FC = () => {
  const activeBottomTab = useTaskStore(state => state.activeBottomTab);
  const setActiveBottomTab = useTaskStore(state => state.setActiveBottomTab);

  return (
    <View style={styles.screen}>
      <Header title="Weekly Plan" />
      <View style={styles.container}>
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Smart Planning ⏰</Text>
          <Text style={styles.heroSubtitle}>
            Calendar scheduling and time-block timeline view.
          </Text>
        </View>
        <View style={styles.timelinePlaceholder}>
          <Text style={styles.timelineHour}>09:00 AM</Text>
          <View style={styles.timelineBlock}>
            <Text style={styles.timelineBlockText}>Review Q2 marketing plan</Text>
          </View>

          <Text style={styles.timelineHour}>11:00 AM</Text>
          <View style={styles.timelineBlock}>
            <Text style={styles.timelineBlockText}>Code review for PR #42</Text>
          </View>

          <Text style={styles.timelineHour}>02:00 PM</Text>
          <View style={styles.timelineBlock}>
            <Text style={styles.timelineBlockText}>Finish blog post draft</Text>
          </View>
        </View>
      </View>
      <BottomTabBar
        activeTab={activeBottomTab}
        onSelectTab={setActiveBottomTab}
      />
    </View>
  );
};

export const AIAssistantScreen: React.FC = () => {
  const activeBottomTab = useTaskStore(state => state.activeBottomTab);
  const setActiveBottomTab = useTaskStore(state => state.setActiveBottomTab);
  const createTask = useTaskStore(state => state.createTask);

  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasAdded, setHasAdded] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{
    title: string;
    category: TaskCategory;
    priority: TaskPriority;
    estimatedTime: string;
    subtasks: string[];
    notes: string;
  } | null>(null);

  const promptSuggestions = [
    '🚀 Launch campaign',
    '📚 Prepare for exam',
    '🏠 Weekly meal plan',
    '💻 Code feature sprint',
    '🏃 5k Training run',
  ];

  const handleGenerate = (customPrompt?: string) => {
    const text = (customPrompt || prompt).trim();
    if (!text) return;
    if (customPrompt) setPrompt(customPrompt);

    setIsGenerating(true);
    setHasAdded(false);

    setTimeout(() => {
      const lower = text.toLowerCase();
      let category: TaskCategory = 'Work';
      let priority: TaskPriority = 'High';
      let estimatedTime = '45m';

      if (
        lower.includes('grocery') ||
        lower.includes('buy') ||
        lower.includes('family') ||
        lower.includes('home') ||
        lower.includes('clean') ||
        lower.includes('dinner') ||
        lower.includes('meal')
      ) {
        category = 'Personal';
        priority = 'Medium';
        estimatedTime = '30m';
      } else if (
        lower.includes('study') ||
        lower.includes('exam') ||
        lower.includes('book') ||
        lower.includes('learn') ||
        lower.includes('course')
      ) {
        category = 'Study';
        priority = 'Medium';
        estimatedTime = '1h';
      } else if (
        lower.includes('run') ||
        lower.includes('gym') ||
        lower.includes('workout') ||
        lower.includes('training') ||
        lower.includes('health')
      ) {
        category = 'Health';
        priority = 'High';
        estimatedTime = '45m';
      }

      const cleanTitle = text.replace(/^[^\w\s]+/, '').trim();
      const generatedSubtasks = [
        `Research requirements & gather context for "${cleanTitle}"`,
        `Draft core execution steps and checkpoints`,
        `Complete main deliverables and verify quality`,
        `Final review & notify collaborators`,
      ];

      setGeneratedResult({
        title: cleanTitle,
        category,
        priority,
        estimatedTime,
        subtasks: generatedSubtasks,
        notes: `AI Breakdown generated for "${cleanTitle}".`,
      });
      setIsGenerating(false);
    }, 400);
  };

  const handleAddGoal = () => {
    if (!generatedResult) return;

    createTask({
      title: generatedResult.title,
      category: generatedResult.category,
      priority: generatedResult.priority,
      description: generatedResult.notes,
      subtasks: generatedResult.subtasks.map((st, i) => ({
        id: `ai_tab_st_${Date.now()}_${i}`,
        title: st,
        completed: false,
      })),
      dueDateFrom: '2025/09/02',
      dueTimeFrom: '09:00 AM',
      dueDateTo: '2025/09/02',
      dueTimeTo: '06:00 PM',
    });

    setHasAdded(true);
  };

  const handleClear = () => {
    setPrompt('');
    setGeneratedResult(null);
    setHasAdded(false);
    setIsGenerating(false);
  };

  return (
    <View style={styles.screen}>
      <Header title="AI Assistant" showAIButton={false} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Clean Input Card */}
        <View style={styles.aiHeroCard}>
          <View style={styles.aiHeroHeader}>
            <View style={styles.aiIconBadge}>
              <Icon name="sparkle" size={20} color="#4F46E5" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.aiHeroTitle}>Smart Task Breakdown</Text>
              <Text style={styles.aiHeroSubtitle}>
                Enter your goal to generate clean, actionable tasks
              </Text>
            </View>
          </View>

          {/* Clean Input Area */}
          <View style={styles.aiInputWrapper}>
            <TextInput
              testID="ai-prompt-input"
              style={styles.aiTextInput}
              placeholder="e.g. Plan Q3 product launch, Learn React 19..."
              placeholderTextColor="#94A3B8"
              value={prompt}
              onChangeText={setPrompt}
              multiline
              numberOfLines={3}
              returnKeyType="done"
            />
            {prompt.length > 0 && (
              <TouchableOpacity
                onPress={() => setPrompt('')}
                style={styles.aiClearInputBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Icon name="close" size={14} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>

          {/* Quick Suggestions Chips */}
          <View style={styles.suggestionsRow}>
            {promptSuggestions.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.7}
                style={styles.suggestionChip}
                onPress={() => handleGenerate(item)}
              >
                <Text style={styles.suggestionChipText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Generate Button */}
          <TouchableOpacity
            testID="generate-ai-task-button"
            activeOpacity={0.8}
            onPress={() => handleGenerate()}
            disabled={!prompt.trim() || isGenerating}
            style={[
              styles.generateBtn,
              (!prompt.trim() || isGenerating) && styles.generateBtnDisabled,
            ]}
          >
            {isGenerating ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Icon name="sparkle" size={16} color="#FFFFFF" />
                <Text style={styles.generateBtnText}>Generate Breakdown</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Generated Result */}
        {generatedResult && (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultSectionTitle}>Generated Plan</Text>
              <TouchableOpacity onPress={handleClear}>
                <Text style={styles.resultClearText}>Clear</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.resultTaskTitle}>{generatedResult.title}</Text>

            {/* Badges */}
            <View style={styles.resultTagsRow}>
              <View style={[styles.tagBadge, { backgroundColor: '#EFF6FF' }]}>
                <Text style={[styles.tagBadgeText, { color: '#2563EB' }]}>
                  {generatedResult.category}
                </Text>
              </View>
              <View
                style={[
                  styles.tagBadge,
                  {
                    backgroundColor:
                      generatedResult.priority === 'High'
                        ? '#FEF2F2'
                        : generatedResult.priority === 'Medium'
                        ? '#FFFBEB'
                        : '#ECFDF5',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.tagBadgeText,
                    {
                      color:
                        generatedResult.priority === 'High'
                          ? '#DC2626'
                          : generatedResult.priority === 'Medium'
                          ? '#D97706'
                          : '#059669',
                    },
                  ]}
                >
                  {generatedResult.priority} Priority
                </Text>
              </View>
              <View style={[styles.tagBadge, { backgroundColor: '#F3E8FF' }]}>
                <Text style={[styles.tagBadgeText, { color: '#7E22CE' }]}>
                  ⏱ {generatedResult.estimatedTime}
                </Text>
              </View>
            </View>

            {/* Subtasks */}
            <Text style={styles.subtasksLabel}>Actionable Subtasks</Text>
            {generatedResult.subtasks.map((st, i) => (
              <View key={i} style={styles.subtaskItem}>
                <View style={styles.subtaskCheckCircle}>
                  <Text style={styles.subtaskIndex}>{i + 1}</Text>
                </View>
                <Text style={styles.subtaskText}>{st}</Text>
              </View>
            ))}

            {/* Add to Tasks Button */}
            {hasAdded ? (
              <View style={styles.successBox}>
                <Text style={styles.successText}>✓ Task added to your list!</Text>
                <TouchableOpacity
                  style={styles.viewTasksBtn}
                  onPress={() => setActiveBottomTab('tasks')}
                >
                  <Text style={styles.viewTasksBtnText}>View in Tasks →</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                testID="add-ai-task-button"
                activeOpacity={0.8}
                style={styles.addToTasksBtn}
                onPress={handleAddGoal}
              >
                <Icon name="check" size={16} color="#FFFFFF" />
                <Text style={styles.addToTasksBtnText}>Add to My Tasks</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>

      <BottomTabBar
        activeTab={activeBottomTab}
        onSelectTab={setActiveBottomTab}
      />
    </View>
  );
};

export const FocusScreen = AIAssistantScreen;

export const SettingsScreen: React.FC = () => {
  const activeBottomTab = useTaskStore(state => state.activeBottomTab);
  const setActiveBottomTab = useTaskStore(state => state.setActiveBottomTab);
  const refreshTasks = useTaskStore(state => state.refreshTasks);
  const isOffline = useTaskStore(state => state.isOffline);
  const tasks = useTaskStore(state => state.tasks);
  const deleteTask = useTaskStore(state => state.deleteTask);

  // Real user preference switches
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dailyReminders, setDailyReminders] = useState(true);
  const [autoArchive, setAutoArchive] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(true);

  const completedCount = tasks.filter(t => t.completed).length;

  const handleClearCompleted = () => {
    if (completedCount === 0) {
      Alert.alert('No Completed Tasks', 'There are no completed tasks to clear.');
      return;
    }
    Alert.alert(
      'Clear Completed Tasks',
      `Are you sure you want to remove ${completedCount} completed task${completedCount > 1 ? 's' : ''}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            tasks.filter(t => t.completed).forEach(t => deleteTask(t.id));
            Alert.alert('Cleaned Up', 'Completed tasks have been removed.');
          },
        },
      ]
    );
  };

  const handleSyncNow = () => {
    refreshTasks();
    Alert.alert('Sync Successful', 'Tasks updated with latest items.');
  };

  return (
    <View style={styles.screen}>
      <Header title="Settings" />
      <ScrollView
        style={styles.settingsScroll}
        contentContainerStyle={styles.settingsScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Section 1: Notifications & Reminders */}
        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>Notifications</Text>

          <View style={styles.settingsToggleRow}>
            <View style={styles.toggleTextCol}>
              <Text style={styles.settingsLabel}>Task Reminders</Text>
              <Text style={styles.settingsDescription}>Alerts for scheduled tasks</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
              thumbColor={notificationsEnabled ? '#2563EB' : '#F1F5F9'}
            />
          </View>

          <View style={styles.settingsToggleRow}>
            <View style={styles.toggleTextCol}>
              <Text style={styles.settingsLabel}>Daily Briefing</Text>
              <Text style={styles.settingsDescription}>Morning summary of upcoming flow</Text>
            </View>
            <Switch
              value={dailyReminders}
              onValueChange={setDailyReminders}
              trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
              thumbColor={dailyReminders ? '#2563EB' : '#F1F5F9'}
            />
          </View>
        </View>

        {/* Section 2: Task Preferences */}
        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>Preferences</Text>

          <View style={styles.settingsToggleRow}>
            <View style={styles.toggleTextCol}>
              <Text style={styles.settingsLabel}>Auto-Archive</Text>
              <Text style={styles.settingsDescription}>Hide tasks once marked completed</Text>
            </View>
            <Switch
              value={autoArchive}
              onValueChange={setAutoArchive}
              trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
              thumbColor={autoArchive ? '#2563EB' : '#F1F5F9'}
            />
          </View>

          <View style={styles.settingsToggleRow}>
            <View style={styles.toggleTextCol}>
              <Text style={styles.settingsLabel}>Confirm Deletion</Text>
              <Text style={styles.settingsDescription}>Ask confirmation before deleting</Text>
            </View>
            <Switch
              value={confirmDelete}
              onValueChange={setConfirmDelete}
              trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
              thumbColor={confirmDelete ? '#2563EB' : '#F1F5F9'}
            />
          </View>
        </View>

        {/* Section 3: Data & Storage */}
        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>Data & Storage</Text>

          <View style={styles.settingsRow}>
            <Text style={styles.settingsLabel}>Connection</Text>
            <View style={styles.statusBadge}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: isOffline ? '#F59E0B' : '#10B981' },
                ]}
              />
              <Text
                style={[
                  styles.statusBadgeText,
                  { color: isOffline ? '#B45309' : '#047857' },
                ]}
              >
                {isOffline ? 'Offline' : 'Online'}
              </Text>
            </View>
          </View>

          <View style={styles.settingsRow}>
            <Text style={styles.settingsLabel}>Stored Tasks</Text>
            <Text style={styles.settingsValue}>{tasks.length} items</Text>
          </View>

          <TouchableOpacity style={styles.primaryActionBtn} onPress={handleSyncNow}>
            <Icon name="refresh" size={16} color="#2563EB" />
            <Text style={styles.primaryActionBtnText}>Sync Tasks</Text>
          </TouchableOpacity>

          {completedCount > 0 && (
            <TouchableOpacity style={styles.dangerActionBtn} onPress={handleClearCompleted}>
              <Icon name="trash" size={16} color="#DC2626" />
              <Text style={styles.dangerActionBtnText}>Clear Completed Tasks ({completedCount})</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Section 4: App Info */}
        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>About</Text>
          <View style={styles.settingsRow}>
            <Text style={styles.settingsLabel}>Version</Text>
            <Text style={styles.settingsValue}>1.0.0</Text>
          </View>
          <View style={[styles.settingsRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.settingsLabel}>TaskFlow</Text>
            <Text style={styles.settingsValue}>Daily Productivity</Text>
          </View>
        </View>
      </ScrollView>
      <BottomTabBar
        activeTab={activeBottomTab}
        onSelectTab={setActiveBottomTab}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#EEF4FA',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  containerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  buttonInnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#64748B',
  },
  subheading: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  simpleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  taskMeta: {
    fontSize: 12,
    color: '#64748B',
  },
  timelinePlaceholder: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
  },
  timelineHour: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 6,
    marginTop: 8,
  },
  timelineBlock: {
    backgroundColor: '#EFF6FF',
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    borderRadius: borderRadius.md,
    padding: 10,
    marginBottom: 8,
  },
  timelineBlockText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E40AF',
  },
  timerCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#FFFFFF',
    borderWidth: 6,
    borderColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  timerNumber: {
    fontSize: 44,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -1,
  },
  timerLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 4,
  },
  timerControls: {
    flexDirection: 'row',
    gap: 14,
  },
  timerButtonPrimary: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: borderRadius.pill,
  },
  timerButtonPrimaryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  timerButtonSecondary: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: borderRadius.pill,
  },
  timerButtonSecondaryText: {
    color: '#334155',
    fontSize: 15,
    fontWeight: '600',
  },
  settingsScroll: {
    flex: 1,
  },
  settingsScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 30,
  },
  settingsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  settingsSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10,
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#F8FAFC',
  },
  settingsToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#F8FAFC',
  },
  toggleTextCol: {
    flex: 1,
    paddingRight: 12,
  },
  settingsLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
  },
  settingsDescription: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  settingsValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.pill,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  primaryActionBtn: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    paddingVertical: 11,
    borderRadius: borderRadius.pill,
    gap: 6,
  },
  primaryActionBtnText: {
    color: '#2563EB',
    fontSize: 13,
    fontWeight: '700',
  },
  dangerActionBtn: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    paddingVertical: 11,
    borderRadius: borderRadius.pill,
    gap: 6,
  },
  dangerActionBtnText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '600',
  },
  aiTodayBanner: {
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#C7D2FE',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aiTodayBannerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiTodayBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#312E81',
  },
  aiTodayBannerSubtitle: {
    fontSize: 12,
    color: '#4F46E5',
    marginTop: 2,
  },
  aiTodayBannerArrow: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4F46E5',
    paddingHorizontal: 4,
  },

  // AI Assistant Screen Styles
  aiHeroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  aiHeroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  aiIconBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiHeroTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  aiHeroSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  aiInputWrapper: {
    position: 'relative',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 12,
  },
  aiTextInput: {
    fontSize: 14,
    color: '#0F172A',
    minHeight: 64,
    textAlignVertical: 'top',
    paddingRight: 24,
  },
  aiClearInputBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 4,
  },
  suggestionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  suggestionChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.pill,
  },
  suggestionChipText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F46E5',
    paddingVertical: 13,
    borderRadius: borderRadius.pill,
    gap: 8,
  },
  generateBtnDisabled: {
    backgroundColor: '#A5B4FC',
  },
  generateBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  resultSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  resultClearText: {
    fontSize: 13,
    color: '#EF4444',
    fontWeight: '600',
  },
  resultTaskTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10,
  },
  resultTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tagBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.pill,
  },
  tagBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  subtasksLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 10,
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  subtaskCheckCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtaskIndex: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F46E5',
  },
  subtaskText: {
    fontSize: 13,
    color: '#334155',
    flex: 1,
  },
  addToTasksBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 13,
    borderRadius: borderRadius.pill,
    gap: 8,
    marginTop: 16,
  },
  addToTasksBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  successBox: {
    backgroundColor: '#ECFDF5',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    gap: 10,
    marginTop: 16,
  },
  successText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#059669',
  },
  viewTasksBtn: {
    backgroundColor: '#059669',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: borderRadius.pill,
  },
  viewTasksBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
