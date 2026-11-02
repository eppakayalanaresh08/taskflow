import { useContext, useSyncExternalStore } from 'react';
import { ReactReduxContext } from 'react-redux';
import { store, RootState, AppDispatch, useAppDispatch, useAppSelector } from './index';
import {
  taskSlice,
  taskActions,
  initStore,
  fetchInitialTasks,
  fetchMoreTasks,
  refreshTasks,
  buildNewTask,
  TaskState,
  STORAGE_KEY_TASKS,
  STORAGE_KEY_OFFLINE,
} from './taskSlice';
import {
  Attachment,
  SubTask,
  Task,
  TaskCategory,
  TaskPriority,
  TaskSortBy,
  TaskStatusFilter,
} from '../types/task';

export interface TaskStoreState extends TaskState {
  // Actions
  initStore: () => Promise<void>;
  fetchInitialTasks: () => Promise<void>;
  fetchMoreTasks: () => Promise<void>;
  refreshTasks: () => Promise<void>;

  createTask: (params: {
    title: string;
    description?: string;
    category: TaskCategory;
    priority: TaskPriority;
    subtasks?: SubTask[];
    dueDateFrom?: string;
    dueTimeFrom?: string;
    dueDateTo?: string;
    dueTimeTo?: string;
    attachments?: Attachment[];
  }) => Task;

  updateTask: (taskId: string | number, updates: Partial<Task>) => void;
  deleteTask: (taskId: string | number) => void;
  toggleTaskStatus: (taskId: string | number) => void;

  toggleSubTask: (taskId: string | number, subTaskId: string) => void;
  addSubTask: (taskId: string | number, title: string) => void;
  removeSubTask: (taskId: string | number, subTaskId: string) => void;

  addAttachment: (taskId: string | number, attachment: Attachment) => void;
  removeAttachment: (taskId: string | number, attachmentId: string) => void;

  setSearchQuery: (query: string) => void;
  setStatusFilter: (filter: TaskStatusFilter) => void;
  setCategoryFilter: (category: string) => void;
  setSortBy: (sortBy: TaskSortBy) => void;
  setIsOffline: (isOffline: boolean) => void;

  openTaskDetail: (taskId: string | number) => void;
  openCreateTask: () => void;
  navigateBackToList: () => void;
  setSortModalOpen: (open: boolean) => void;
  setAIModalOpen: (open: boolean) => void;
  setActiveBottomTab: (tab: 'today' | 'tasks' | 'plan' | 'focus' | 'settings') => void;
}

function createBoundActions(dispatch: AppDispatch) {
  return {
    initStore: async () => {
      await dispatch(initStore());
    },
    fetchInitialTasks: async () => {
      await dispatch(fetchInitialTasks());
    },
    fetchMoreTasks: async () => {
      await dispatch(fetchMoreTasks());
    },
    refreshTasks: async () => {
      await dispatch(refreshTasks());
    },
    createTask: (params: Parameters<typeof buildNewTask>[0]) => {
      const task = buildNewTask(params);
      dispatch(taskActions.taskCreated(task));
      return task;
    },
    updateTask: (taskId: string | number, updates: Partial<Task>) => {
      dispatch(taskActions.updateTask({ taskId, updates }));
    },
    deleteTask: (taskId: string | number) => {
      dispatch(taskActions.deleteTask(taskId));
    },
    toggleTaskStatus: (taskId: string | number) => {
      dispatch(taskActions.toggleTaskStatus(taskId));
    },
    toggleSubTask: (taskId: string | number, subTaskId: string) => {
      dispatch(taskActions.toggleSubTask({ taskId, subTaskId }));
    },
    addSubTask: (taskId: string | number, title: string) => {
      dispatch(taskActions.addSubTask({ taskId, title }));
    },
    removeSubTask: (taskId: string | number, subTaskId: string) => {
      dispatch(taskActions.removeSubTask({ taskId, subTaskId }));
    },
    addAttachment: (taskId: string | number, attachment: Attachment) => {
      dispatch(taskActions.addAttachment({ taskId, attachment }));
    },
    removeAttachment: (taskId: string | number, attachmentId: string) => {
      dispatch(taskActions.removeAttachment({ taskId, attachmentId }));
    },
    setSearchQuery: (query: string) => {
      dispatch(taskActions.setSearchQuery(query));
    },
    setStatusFilter: (filter: TaskStatusFilter) => {
      dispatch(taskActions.setStatusFilter(filter));
    },
    setCategoryFilter: (category: string) => {
      dispatch(taskActions.setCategoryFilter(category));
    },
    setSortBy: (sortBy: TaskSortBy) => {
      dispatch(taskActions.setSortBy(sortBy));
    },
    setIsOffline: (isOffline: boolean) => {
      dispatch(taskActions.setIsOffline(isOffline));
    },
    openTaskDetail: (taskId: string | number) => {
      dispatch(taskActions.openTaskDetail(taskId));
    },
    openCreateTask: () => {
      dispatch(taskActions.openCreateTask());
    },
    navigateBackToList: () => {
      dispatch(taskActions.navigateBackToList());
    },
    setSortModalOpen: (open: boolean) => {
      dispatch(taskActions.setSortModalOpen(open));
    },
    setAIModalOpen: (open: boolean) => {
      dispatch(taskActions.setAIModalOpen(open));
    },
    setActiveBottomTab: (tab: 'today' | 'tasks' | 'plan' | 'focus' | 'settings') => {
      dispatch(taskActions.setActiveBottomTab(tab));
    },
  };
}

const defaultBoundActions = createBoundActions(store.dispatch);

function getFullState(targetStore = store): TaskStoreState {
  const taskState = targetStore.getState().tasks;
  const actions = targetStore === store ? defaultBoundActions : createBoundActions(targetStore.dispatch);
  return {
    ...taskState,
    ...actions,
  };
}

export function useTaskStore<T = TaskStoreState>(
  selector?: (state: TaskStoreState) => T
): T {
  const reduxContext = useContext(ReactReduxContext);
  const activeStore = (reduxContext && reduxContext.store) ? (reduxContext.store as typeof store) : store;

  const getSnapshot = () => {
    const fullState = getFullState(activeStore);
    return selector ? selector(fullState) : (fullState as unknown as T);
  };

  return useSyncExternalStore(activeStore.subscribe, getSnapshot, getSnapshot);
}

// Static helpers on useTaskStore for compatibility and direct access
useTaskStore.getState = () => getFullState(store);
useTaskStore.setState = (partial: Partial<TaskStoreState>) => {
  store.dispatch(taskActions.setStoreState(partial));
};
useTaskStore.subscribe = store.subscribe;

// Pure selector function for filtering & sorting tasks (usable outside or inside hook)
export function filterAndSortTasks(
  tasks: Task[],
  searchQuery: string,
  statusFilter: TaskStatusFilter,
  categoryFilter: string,
  sortBy: TaskSortBy
): Task[] {
  let filtered = tasks;

  // 1. Status Filter
  if (statusFilter === 'completed') {
    filtered = filtered.filter(t => t.completed);
  } else if (statusFilter === 'pending') {
    filtered = filtered.filter(t => !t.completed);
  }

  // 2. Category Filter
  if (categoryFilter && categoryFilter.toLowerCase() !== 'all') {
    filtered = filtered.filter(
      t => t.category.toLowerCase() === categoryFilter.toLowerCase()
    );
  }

  // 3. Search Query
  if (searchQuery.trim()) {
    const query = searchQuery.trim().toLowerCase();
    filtered = filtered.filter(
      t =>
        t.title.toLowerCase().includes(query) ||
        (t.description && t.description.toLowerCase().includes(query))
    );
  }

  // 4. Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityWeight: Record<TaskPriority, number> = {
        High: 3,
        Medium: 2,
        Low: 1,
      };
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    }
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === 'status') {
      // Pending first, completed second
      return (a.completed ? 1 : 0) - (b.completed ? 1 : 0);
    }
    // Default: 'dueDate' or section (Today first, then Tomorrow, then Upcoming)
    const sectionWeight = { TODAY: 1, TOMORROW: 2, UPCOMING: 3 };
    const weightA = a.section ? sectionWeight[a.section] || 4 : 4;
    const weightB = b.section ? sectionWeight[b.section] || 4 : 4;
    if (weightA !== weightB) {
      return weightA - weightB;
    }
    return String(a.createdAt || '').localeCompare(String(b.createdAt || ''));
  });

  return sorted;
}

export {
  store,
  useAppDispatch,
  useAppSelector,
  taskSlice,
  taskActions,
  initStore,
  fetchInitialTasks,
  fetchMoreTasks,
  refreshTasks,
  buildNewTask,
  STORAGE_KEY_TASKS,
  STORAGE_KEY_OFFLINE,
};
export type { RootState, AppDispatch };
