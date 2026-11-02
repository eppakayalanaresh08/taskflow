import React from 'react';
import { useTaskStore } from '../store/taskStore';
import { TaskListScreen } from '../screens/TaskListScreen';
import { TaskDetailScreen } from '../screens/TaskDetailScreen';
import {
  TodayScreen,
  PlanScreen,
  AIAssistantScreen,
  SettingsScreen,
} from '../screens/PlaceholderTabs';
import { AIAssistantModal } from '../components/AIAssistantModal';

export const AppNavigator: React.FC = () => {
  const activeScreen = useTaskStore(state => state.activeScreen);
  const activeBottomTab = useTaskStore(state => state.activeBottomTab);
  const isAIModalOpen = useTaskStore(state => state.isAIModalOpen);
  const setAIModalOpen = useTaskStore(state => state.setAIModalOpen);

  const renderContent = () => {
    if (activeScreen === 'detail') {
      return <TaskDetailScreen />;
    }

    switch (activeBottomTab) {
      case 'today':
        return <TodayScreen />;
      case 'plan':
        return <PlanScreen />;
      case 'focus':
        return <AIAssistantScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'tasks':
      default:
        return <TaskListScreen />;
    }
  };

  return (
    <>
      {renderContent()}
      <AIAssistantModal
        visible={isAIModalOpen}
        onClose={() => setAIModalOpen(false)}
      />
    </>
  );
};

