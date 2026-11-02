import { store } from '../src/store';
import {
  taskActions,
  buildNewTask,
} from '../src/store/taskSlice';

describe('Redux Toolkit Store & Slice', () => {
  beforeEach(() => {
    store.dispatch(taskActions.resetState());
  });

  it('initializes with default state values', () => {
    const state = store.getState().tasks;
    expect(state.tasks).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.statusFilter).toBe('all');
    expect(state.categoryFilter).toBe('all');
    expect(state.sortBy).toBe('dueDate');
    expect(state.activeScreen).toBe('list');
  });

  it('dispatches taskCreated action to add a task', () => {
    const newTask = buildNewTask({
      title: 'RTK Native Test Task',
      description: 'Testing Redux Toolkit actions',
      category: 'Work',
      priority: 'High',
      subtasks: [{ id: 'st_1', title: 'Subtask 1', completed: false }],
    });

    store.dispatch(taskActions.taskCreated(newTask));

    const state = store.getState().tasks;
    expect(state.tasks).toHaveLength(1);
    expect(state.tasks[0].id).toBe(newTask.id);
    expect(state.tasks[0].title).toBe('RTK Native Test Task');
    expect(state.tasks[0].isLocal).toBe(true);
  });

  it('dispatches updateTask and updates task details', () => {
    const newTask = buildNewTask({
      title: 'Original Title',
      category: 'Personal',
      priority: 'Low',
    });
    store.dispatch(taskActions.taskCreated(newTask));

    store.dispatch(
      taskActions.updateTask({
        taskId: newTask.id,
        updates: { title: 'Updated Title', priority: 'High' },
      })
    );

    const state = store.getState().tasks;
    expect(state.tasks[0].title).toBe('Updated Title');
    expect(state.tasks[0].priority).toBe('High');
  });

  it('dispatches toggleTaskStatus to flip completed state', () => {
    const newTask = buildNewTask({
      title: 'Toggle Me',
      category: 'Work',
      priority: 'Medium',
    });
    store.dispatch(taskActions.taskCreated(newTask));

    expect(store.getState().tasks.tasks[0].completed).toBe(false);

    store.dispatch(taskActions.toggleTaskStatus(newTask.id));
    expect(store.getState().tasks.tasks[0].completed).toBe(true);

    store.dispatch(taskActions.toggleTaskStatus(newTask.id));
    expect(store.getState().tasks.tasks[0].completed).toBe(false);
  });

  it('dispatches filter and modal navigation actions correctly', () => {
    store.dispatch(taskActions.setSearchQuery('project'));
    expect(store.getState().tasks.searchQuery).toBe('project');

    store.dispatch(taskActions.setStatusFilter('completed'));
    expect(store.getState().tasks.statusFilter).toBe('completed');

    store.dispatch(taskActions.setCategoryFilter('Work'));
    expect(store.getState().tasks.categoryFilter).toBe('Work');

    store.dispatch(taskActions.setSortBy('priority'));
    expect(store.getState().tasks.sortBy).toBe('priority');

    store.dispatch(taskActions.openCreateTask());
    expect(store.getState().tasks.activeScreen).toBe('detail');
    expect(store.getState().tasks.isCreatingNewTask).toBe(true);

    store.dispatch(taskActions.navigateBackToList());
    expect(store.getState().tasks.activeScreen).toBe('list');
    expect(store.getState().tasks.isCreatingNewTask).toBe(false);
  });

  it('dispatches deleteTask to remove task from store', () => {
    const task1 = buildNewTask({ title: 'Task 1', category: 'Work', priority: 'Low' });
    const task2 = buildNewTask({ title: 'Task 2', category: 'Study', priority: 'Medium' });

    store.dispatch(taskActions.taskCreated(task1));
    store.dispatch(taskActions.taskCreated(task2));

    expect(store.getState().tasks.tasks).toHaveLength(2);

    store.dispatch(taskActions.deleteTask(task1.id));
    expect(store.getState().tasks.tasks).toHaveLength(1);
    expect(store.getState().tasks.tasks[0].id).toBe(task2.id);
  });
});
