import React, { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { borderRadius, shadows } from '../theme';
import { TaskCategory, TaskPriority } from '../types/task';
import { useTaskStore } from '../store/taskStore';
import { Icon } from './Icon';

interface AIAssistantModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  visible,
  onClose,
}) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{
    title: string;
    category: TaskCategory;
    priority: TaskPriority;
    estimatedTime: string;
    subtasks: string[];
    notes: string;
  } | null>(null);

  const createTask = useTaskStore(state => state.createTask);

  const promptSuggestions = [
    '🚀 Launch campaign',
    '📚 Prepare for exam',
    '🏠 Weekly meal plan',
    '💻 Code focus sprint',
    '🏃 5k Training run',
  ];

  const handleGenerate = (customPrompt?: string) => {
    const text = (customPrompt || prompt).trim();
    if (!text) return;
    if (customPrompt) setPrompt(customPrompt);

    setIsGenerating(true);
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
        notes: `AI Decomposition generated for task: "${cleanTitle}". Optimized for deep focus and high execution throughput.`,
      });
      setIsGenerating(false);
    }, 600);
  };

  const handleApply = () => {
    if (!generatedResult) return;

    createTask({
      title: generatedResult.title,
      category: generatedResult.category,
      priority: generatedResult.priority,
      description: generatedResult.notes,
      subtasks: generatedResult.subtasks.map((st, i) => ({
        id: `ai_st_${Date.now()}_${i}`,
        title: st,
        completed: false,
      })),
      dueDateFrom: '2025/09/02',
      dueTimeFrom: '09:00 AM',
      dueDateTo: '2025/09/02',
      dueTimeTo: '06:00 PM',
    });

    handleClose();
  };

  const handleClose = () => {
    setPrompt('');
    setGeneratedResult(null);
    setIsGenerating(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.sheetContainer}>
              <View style={styles.dragIndicator} />

              <View style={styles.headerRow}>
                <View style={styles.sparkleIconBadge}>
                  <Icon name="sparkle" size={22} color="#4F46E5" />
                </View>
                <View>
                  <Text style={styles.modalTitle}>AI Task Breakdown</Text>
                  <Text style={styles.modalSubtitle}>
                    Smart decomposition into actionable subtasks
                  </Text>
                </View>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <Text style={styles.inputLabel}>What do you want to accomplish?</Text>
                <TextInput
                  style={styles.promptInput}
                  value={prompt}
                  onChangeText={setPrompt}
                  placeholder="e.g. Plan Q3 launch campaign, organize garage, write quarterly report..."
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={3}
                />

                {/* Quick Suggestion Chips */}
                <View style={styles.chipsContainer}>
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

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleGenerate()}
                  disabled={!prompt.trim() || isGenerating}
                  style={[
                    styles.generateButton,
                    (!prompt.trim() || isGenerating) && styles.buttonDisabled,
                  ]}
                >
                  {isGenerating ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <View style={styles.buttonInnerRow}>
                      <Icon name="sparkle" size={16} color="#FFFFFF" />
                      <Text style={styles.generateButtonText}>
                        {' '}Generate Breakdown
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>

                {generatedResult && (
                  <View style={styles.resultCard}>
                    <Text style={styles.resultTitle}>
                      {generatedResult.title}
                    </Text>

                    <View style={styles.tagsRow}>
                      <View style={styles.pillTag}>
                        <Icon name="tag" size={12} color="#4338CA" />
                        <Text style={styles.pillTagText}>
                          {' '}{generatedResult.category}
                        </Text>
                      </View>
                      <View style={styles.pillTag}>
                        <Icon name="fire" size={12} color="#4338CA" />
                        <Text style={styles.pillTagText}>
                          {' '}{generatedResult.priority} Priority
                        </Text>
                      </View>
                      <View style={styles.pillTag}>
                        <Icon name="clock" size={12} color="#4338CA" />
                        <Text style={styles.pillTagText}>
                          {' '}{generatedResult.estimatedTime}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.subtasksHeader}>Generated Subtasks:</Text>
                    {generatedResult.subtasks.map((st, i) => (
                      <View key={i} style={styles.subtaskItem}>
                        <Text style={styles.subtaskNumber}>{i + 1}.</Text>
                        <Text style={styles.subtaskText}>{st}</Text>
                      </View>
                    ))}

                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={handleApply}
                      style={styles.applyButton}
                    >
                      <Text style={styles.applyButtonText}>
                        Add to TaskFlow
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </ScrollView>
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
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    maxHeight: '85%',
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
  },
  dragIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sparkleIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  promptInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: borderRadius.lg,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
    minHeight: 70,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  suggestionChip: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  suggestionChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4F46E5',
  },
  generateButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    borderRadius: borderRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  buttonInnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  generateButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  resultCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: borderRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  pillTag: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.pill,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pillTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4338CA',
  },
  subtasksHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  subtaskNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6366F1',
    width: 20,
  },
  subtaskText: {
    flex: 1,
    fontSize: 13,
    color: '#334155',
  },
  applyButton: {
    backgroundColor: '#16A34A',
    paddingVertical: 12,
    borderRadius: borderRadius.pill,
    alignItems: 'center',
    marginTop: 12,
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
