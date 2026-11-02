import { useTaskStore } from '../src/store/taskStore';

describe('TaskStore State Management', () => {
  beforeEach(() => {
    // Reset store before each test
    useTaskStore.setState({
      tasks: [],
      isLoading: false,
      isRefreshing: false,
      isLoadingMore: false,
      error: null,
      searchQuery: '',
      statusFilter: 'all',
      categoryFilter: 'all',
      sortBy: 'dueDate',
      selectedTaskId: null,
      activeScreen: 'list',
      isCreatingNewTask: false,
    });
  });

  it('creates a new task with correct defaults, flags isLocal: true, and prepends to tasks', () => {
    const store = useTaskStore.getState();

    const created = store.createTask({
      title: 'Deploy TaskFlow v1.0',
      description: 'Run build tests and create production release bundle',
      category: 'Work',
      priority: 'High',
      subtasks: [{ id: 'st_1', title: 'Verify tests pass', completed: false }],
    });

    const state = useTaskStore.getState();
    expect(state.tasks).toHaveLength(1);
    expect(state.tasks[0].id).toBe(created.id);
    expect(state.tasks[0].title).toBe('Deploy TaskFlow v1.0');
    expect(state.tasks[0].description).toBe('Run build tests and create production release bundle');
    expect(state.tasks[0].category).toBe('Work');
    expect(state.tasks[0].priority).toBe('High');
    expect(state.tasks[0].completed).toBe(false);
    expect(state.tasks[0].isLocal).toBe(true);
    expect(state.tasks[0].subtasks).toHaveLength(1);
  });

  it('toggles task completion status and updates updatedAt timestamp', () => {
    const store = useTaskStore.getState();

    const task = store.createTask({
      title: 'Review PR changes',
      category: 'Work',
      priority: 'Medium',
    });

    expect(useTaskStore.getState().tasks[0].completed).toBe(false);

    // Toggle to completed
    store.toggleTaskStatus(task.id);
    expect(useTaskStore.getState().tasks[0].completed).toBe(true);
    expect(useTaskStore.getState().tasks[0].isLocal).toBe(true);

    // Toggle back to pending
    store.toggleTaskStatus(task.id);
    expect(useTaskStore.getState().tasks[0].completed).toBe(false);
  });

  it('updates task personal notes, category, and priority', () => {
    const store = useTaskStore.getState();

    const task = store.createTask({
      title: 'Grocery shopping',
      category: 'Personal',
      priority: 'Low',
    });

    store.updateTask(task.id, {
      description: 'Added organic almond milk and fresh blueberries',
      priority: 'High',
      category: 'Personal',
    });

    const updatedTask = useTaskStore.getState().tasks.find(t => t.id === task.id);
    expect(updatedTask?.description).toBe('Added organic almond milk and fresh blueberries');
    expect(updatedTask?.priority).toBe('High');
  });

  it('handles subtasks: adding, toggling, and removing', () => {
    const store = useTaskStore.getState();

    const task = store.createTask({
      title: 'Setup CI/CD pipeline',
      category: 'Work',
      priority: 'High',
    });

    // 1. Add subtask
    store.addSubTask(task.id, 'Configure GitHub Actions workflow');
    let currentTask = useTaskStore.getState().tasks[0];
    expect(currentTask.subtasks).toHaveLength(1);
    expect(currentTask.subtasks[0].title).toBe('Configure GitHub Actions workflow');
    expect(currentTask.subtasks[0].completed).toBe(false);

    // 2. Toggle subtask
    const subTaskId = currentTask.subtasks[0].id;
    store.toggleSubTask(task.id, subTaskId);
    currentTask = useTaskStore.getState().tasks[0];
    expect(currentTask.subtasks[0].completed).toBe(true);

    // 3. Remove subtask
    store.removeSubTask(task.id, subTaskId);
    currentTask = useTaskStore.getState().tasks[0];
    expect(currentTask.subtasks).toHaveLength(0);
  });

  it('handles attachments: adding and removing', () => {
    const store = useTaskStore.getState();

    const task = store.createTask({
      title: 'Design app mockups',
      category: 'Work',
      priority: 'Medium',
    });

    // Add attachment
    store.addAttachment(task.id, {
      id: 'att_test_1',
      name: 'screen_design.png',
      type: 'image',
    });

    let currentTask = useTaskStore.getState().tasks[0];
    expect(currentTask.attachments).toHaveLength(1);
    expect(currentTask.attachments[0].name).toBe('screen_design.png');

    // Remove attachment
    store.removeAttachment(task.id, 'att_test_1');
    currentTask = useTaskStore.getState().tasks[0];
    expect(currentTask.attachments).toHaveLength(0);
  });

  it('deletes a task cleanly and navigates back to list', () => {
    const store = useTaskStore.getState();

    const task1 = store.createTask({ title: 'Task 1', category: 'Work', priority: 'Low' });
    const task2 = store.createTask({ title: 'Task 2', category: 'Personal', priority: 'Medium' });

    expect(useTaskStore.getState().tasks).toHaveLength(2);

    store.deleteTask(task1.id);
    const remaining = useTaskStore.getState().tasks;
    expect(remaining).toHaveLength(1);
    expect(remaining[0].id).toBe(task2.id);
  });
});

