import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Attachment,
  SubTask,
  Task,
  TaskCategory,
  TaskPriority,
  TaskSortBy,
  TaskStatusFilter,
} from '../types/task';
import { fetchTodosApi } from '../api/taskApi';
import { initialDesignTasks } from '../utils/sampleTasks';
import { to12HourFormat } from '../utils/nativePickerService';

export const STORAGE_KEY_TASKS = '@taskflow_stored_tasks_v1';
export const STORAGE_KEY_OFFLINE = '@taskflow_offline_flag';

// Helper to persist tasks to AsyncStorage safely
export async function persistTasks(tasks: Task[]) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
  } catch (err) {
    console.warn('Failed to persist tasks to AsyncStorage:', err);
  }
}

export interface TaskState {
  // Data
  tasks: Task[];
  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  error: string | null;
  skip: number;
  limit: number;
  total: number;
  hasMore: boolean;
  isOffline: boolean;

  // Filters & Search
  searchQuery: string;
  statusFilter: TaskStatusFilter;
  categoryFilter: string; // 'all' | 'Personal' | 'Work' | etc.
  sortBy: TaskSortBy;

  // Navigation & UI Modals
  selectedTaskId: string | number | null;
  activeScreen: 'list' | 'detail';
  isCreatingNewTask: boolean;
  isSortModalOpen: boolean;
  isAIModalOpen: boolean;
  activeBottomTab: 'today' | 'tasks' | 'plan' | 'focus' | 'settings';
}

export const initialState: TaskState = {
  tasks: [],
  isLoading: false,
  isRefreshing: false,
  isLoadingMore: false,
  error: null,
  skip: 0,
  limit: 20,
  total: 0,
  hasMore: true,
  isOffline: false,

  searchQuery: '',
  statusFilter: 'all',
  categoryFilter: 'all',
  sortBy: 'dueDate',

  selectedTaskId: null,
  activeScreen: 'list',
  isCreatingNewTask: false,
  isSortModalOpen: false,
  isAIModalOpen: false,
  activeBottomTab: 'tasks',
};

export function buildNewTask(params: {
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
}): Task {
  const now = new Date().toISOString();
  return {
    id: `task_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    title: params.title.trim(),
    description: params.description || '',
    category: params.category,
    priority: params.priority,
    completed: false,
    subtasks: params.subtasks || [],
    dueDateFrom: params.dueDateFrom || '2025/09/02',
    dueTimeFrom: to12HourFormat(params.dueTimeFrom || '09:00 AM'),
    dueDateTo: params.dueDateTo || '2025/09/02',
    dueTimeTo: to12HourFormat(params.dueTimeTo || '06:00 PM'),
    estimatedTime: '30m',
    attachments: params.attachments || [],
    section: 'TODAY',
    createdAt: now,
    updatedAt: now,
    isLocal: true,
  };
}

// Async thunks
export const fetchInitialTasks = createAsyncThunk(
  'tasks/fetchInitialTasks',
  async (_, { getState, rejectWithValue }) => {
    try {
      const result = await fetchTodosApi(20, 0);
      const state = getState() as { tasks: TaskState };
      const currentTasks = state.tasks.tasks;
      const localTasks = currentTasks.filter(t => t.isLocal);

      const mergedApiTasks = result.tasks.map(apiTask => {
        const existing = currentTasks.find(t => String(t.id) === String(apiTask.id));
        if (existing && existing.isLocal) {
          return existing;
        }
        return apiTask;
      });

      const finalTasks = [
        ...localTasks.filter(lt => !mergedApiTasks.some(mt => String(mt.id) === String(lt.id))),
        ...mergedApiTasks,
      ];

      await persistTasks(finalTasks);

      return {
        tasks: finalTasks,
        total: result.total + localTasks.length,
        skip: 20,
        hasMore: result.total > 20,
      };
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to load tasks');
    }
  }
);

export const initStore = createAsyncThunk(
  'tasks/initStore',
  async (_, { dispatch }) => {
    try {
      const cached = await AsyncStorage.getItem(STORAGE_KEY_TASKS);
      if (cached) {
        try {
          const parsed: Task[] = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const sanitized = parsed.map(t => ({
              ...t,
              dueTimeFrom: t.dueTimeFrom ? to12HourFormat(t.dueTimeFrom) : '09:00 AM',
              dueTimeTo: t.dueTimeTo ? to12HourFormat(t.dueTimeTo) : '06:00 PM',
            }));
            dispatch(taskSlice.actions.setTasks(sanitized));
          } else {
            dispatch(taskSlice.actions.setTasks(initialDesignTasks));
            await persistTasks(initialDesignTasks);
          }
        } catch {
          dispatch(taskSlice.actions.setTasks(initialDesignTasks));
          await persistTasks(initialDesignTasks);
        }
      } else {
        dispatch(taskSlice.actions.setTasks(initialDesignTasks));
        await persistTasks(initialDesignTasks);
      }
    } catch (err) {
      console.warn('Init store cache read error:', err);
    }

    await dispatch(fetchInitialTasks());
  }
);

export const fetchMoreTasks = createAsyncThunk(
  'tasks/fetchMoreTasks',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { tasks: TaskState };
    const { skip, isLoadingMore, hasMore, isOffline, tasks: currentTasks } = state.tasks;
    if (isLoadingMore || !hasMore || isOffline) return null;

    try {
      const result = await fetchTodosApi(20, skip);
      const currentIds = new Set(currentTasks.map(t => String(t.id)));
      const newUnique = result.tasks.filter(t => !currentIds.has(String(t.id)));
      const combined = [...currentTasks, ...newUnique];
      const newSkip = skip + 20;

      await persistTasks(combined);

      return {
        tasks: combined,
        skip: newSkip,
        hasMore: newSkip < result.total,
      };
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to load more tasks');
    }
  }
);

export const refreshTasks = createAsyncThunk(
  'tasks/refreshTasks',
  async (_, { getState, rejectWithValue }) => {
    try {
      const result = await fetchTodosApi(20, 0);
      const state = getState() as { tasks: TaskState };
      const currentTasks = state.tasks.tasks;
      const localTasks = currentTasks.filter(t => t.isLocal);

      const mergedApiTasks = result.tasks.map(apiTask => {
        const existing = currentTasks.find(t => String(t.id) === String(apiTask.id));
        if (existing && existing.isLocal) {
          return existing;
        }
        return apiTask;
      });

      const finalTasks = [
        ...localTasks.filter(lt => !mergedApiTasks.some(mt => String(mt.id) === String(lt.id))),
        ...mergedApiTasks,
      ];

      await persistTasks(finalTasks);

      return {
        tasks: finalTasks,
        skip: 20,
        hasMore: result.total > 20,
      };
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Refresh failed');
    }
  }
);

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    taskCreated: (state, action: PayloadAction<Task>) => {
      state.tasks.unshift(action.payload);
      state.activeScreen = 'list';
      state.selectedTaskId = null;
      state.isCreatingNewTask = false;
      persistTasks(state.tasks);
    },
    updateTask: (
      state,
      action: PayloadAction<{ taskId: string | number; updates: Partial<Task> }>
    ) => {
      const { taskId, updates } = action.payload;
      const task = state.tasks.find(t => String(t.id) === String(taskId));
      if (task) {
        const sanitizedUpdates = { ...updates };
        if (sanitizedUpdates.dueTimeFrom) {
          sanitizedUpdates.dueTimeFrom = to12HourFormat(sanitizedUpdates.dueTimeFrom);
        }
        if (sanitizedUpdates.dueTimeTo) {
          sanitizedUpdates.dueTimeTo = to12HourFormat(sanitizedUpdates.dueTimeTo);
        }
        Object.assign(task, sanitizedUpdates, {
          isLocal: true,
          updatedAt: new Date().toISOString(),
        });
        persistTasks(state.tasks);
      }
    },
    deleteTask: (state, action: PayloadAction<string | number>) => {
      state.tasks = state.tasks.filter(t => String(t.id) !== String(action.payload));
      state.activeScreen = 'list';
      state.selectedTaskId = null;
      persistTasks(state.tasks);
    },
    toggleTaskStatus: (state, action: PayloadAction<string | number>) => {
      const task = state.tasks.find(t => String(t.id) === String(action.payload));
      if (task) {
        task.completed = !task.completed;
        task.isLocal = true;
        task.updatedAt = new Date().toISOString();
        persistTasks(state.tasks);
      }
    },
    toggleSubTask: (
      state,
      action: PayloadAction<{ taskId: string | number; subTaskId: string }>
    ) => {
      const task = state.tasks.find(t => String(t.id) === String(action.payload.taskId));
      if (task) {
        const sub = task.subtasks.find(s => s.id === action.payload.subTaskId);
        if (sub) {
          sub.completed = !sub.completed;
          task.isLocal = true;
          task.updatedAt = new Date().toISOString();
          persistTasks(state.tasks);
        }
      }
    },
    addSubTask: (
      state,
      action: PayloadAction<{ taskId: string | number; title: string }>
    ) => {
      if (!action.payload.title.trim()) return;
      const task = state.tasks.find(t => String(t.id) === String(action.payload.taskId));
      if (task) {
        task.subtasks.push({
          id: `st_${Date.now()}`,
          title: action.payload.title.trim(),
          completed: false,
        });
        task.isLocal = true;
        task.updatedAt = new Date().toISOString();
        persistTasks(state.tasks);
      }
    },
    removeSubTask: (
      state,
      action: PayloadAction<{ taskId: string | number; subTaskId: string }>
    ) => {
      const task = state.tasks.find(t => String(t.id) === String(action.payload.taskId));
      if (task) {
        task.subtasks = task.subtasks.filter(s => s.id !== action.payload.subTaskId);
        task.isLocal = true;
        task.updatedAt = new Date().toISOString();
        persistTasks(state.tasks);
      }
    },
    addAttachment: (
      state,
      action: PayloadAction<{ taskId: string | number; attachment: Attachment }>
    ) => {
      const task = state.tasks.find(t => String(t.id) === String(action.payload.taskId));
      if (task) {
        task.attachments.push(action.payload.attachment);
        task.isLocal = true;
        task.updatedAt = new Date().toISOString();
        persistTasks(state.tasks);
      }
    },
    removeAttachment: (
      state,
      action: PayloadAction<{ taskId: string | number; attachmentId: string }>
    ) => {
      const task = state.tasks.find(t => String(t.id) === String(action.payload.taskId));
      if (task) {
        task.attachments = task.attachments.filter(a => a.id !== action.payload.attachmentId);
        task.isLocal = true;
        task.updatedAt = new Date().toISOString();
        persistTasks(state.tasks);
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<TaskStatusFilter>) => {
      state.statusFilter = action.payload;
    },
    setCategoryFilter: (state, action: PayloadAction<string>) => {
      state.categoryFilter = action.payload;
    },
    setSortBy: (state, action: PayloadAction<TaskSortBy>) => {
      state.sortBy = action.payload;
    },
    setIsOffline: (state, action: PayloadAction<boolean>) => {
      state.isOffline = action.payload;
    },
    openTaskDetail: (state, action: PayloadAction<string | number>) => {
      state.selectedTaskId = action.payload;
      state.activeScreen = 'detail';
      state.isCreatingNewTask = false;
    },
    openCreateTask: (state) => {
      state.selectedTaskId = null;
      state.activeScreen = 'detail';
      state.isCreatingNewTask = true;
    },
    navigateBackToList: (state) => {
      state.activeScreen = 'list';
      state.selectedTaskId = null;
      state.isCreatingNewTask = false;
    },
    setSortModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isSortModalOpen = action.payload;
    },
    setAIModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isAIModalOpen = action.payload;
    },
    setActiveBottomTab: (
      state,
      action: PayloadAction<'today' | 'tasks' | 'plan' | 'focus' | 'settings'>
    ) => {
      state.activeBottomTab = action.payload;
    },
    setStoreState: (state, action: PayloadAction<Partial<TaskState>>) => {
      Object.assign(state, action.payload);
      if (action.payload.tasks) {
        persistTasks(state.tasks);
      }
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    // initStore
    builder
      .addCase(initStore.pending, (state) => {
        state.isLoading = state.tasks.length === 0;
        state.error = null;
      })
      .addCase(initStore.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(initStore.rejected, (state) => {
        state.isLoading = false;
      });

    // fetchInitialTasks
    builder
      .addCase(fetchInitialTasks.pending, (state) => {
        state.isLoading = state.tasks.length === 0;
        state.error = null;
      })
      .addCase(fetchInitialTasks.fulfilled, (state, action) => {
        state.tasks = action.payload.tasks;
        state.total = action.payload.total;
        state.skip = action.payload.skip;
        state.hasMore = action.payload.hasMore;
        state.isLoading = false;
        state.error = null;
        state.isOffline = false;
      })
      .addCase(fetchInitialTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = state.tasks.length > 0 ? null : ((action.payload as string) || 'Failed to load tasks');
        state.isOffline = true;
      });

    // fetchMoreTasks
    builder
      .addCase(fetchMoreTasks.pending, (state) => {
        state.isLoadingMore = true;
      })
      .addCase(fetchMoreTasks.fulfilled, (state, action) => {
        if (action.payload) {
          state.tasks = action.payload.tasks;
          state.skip = action.payload.skip;
          state.hasMore = action.payload.hasMore;
        }
        state.isLoadingMore = false;
      })
      .addCase(fetchMoreTasks.rejected, (state) => {
        state.isLoadingMore = false;
      });

    // refreshTasks
    builder
      .addCase(refreshTasks.pending, (state) => {
        state.isRefreshing = true;
        state.error = null;
      })
      .addCase(refreshTasks.fulfilled, (state, action) => {
        state.tasks = action.payload.tasks;
        state.skip = action.payload.skip;
        state.hasMore = action.payload.hasMore;
        state.isRefreshing = false;
        state.isOffline = false;
        state.error = null;
      })
      .addCase(refreshTasks.rejected, (state) => {
        state.isRefreshing = false;
        state.isOffline = true;
      });
  },
});

export const taskActions = taskSlice.actions;
