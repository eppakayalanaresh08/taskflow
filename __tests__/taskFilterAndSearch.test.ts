import { filterAndSortTasks } from '../src/store/taskStore';
import { Task } from '../src/types/task';

describe('Task Filtering and Search Logic', () => {
  const mockTasks: Task[] = [
    {
      id: 1,
      title: 'Review Q2 marketing plan',
      completed: false,
      category: 'Work',
      priority: 'High',
      description: 'Go through conversion benchmarks and ad spend',
      subtasks: [],
      attachments: [],
      createdAt: '2025-09-01T10:00:00Z',
      updatedAt: '2025-09-01T10:00:00Z',
    },
    {
      id: 2,
      title: 'Buy groceries for the week',
      completed: true,
      category: 'Personal',
      priority: 'Medium',
      description: 'Milk, oats, yogurt, and sourdough bread',
      subtasks: [],
      attachments: [],
      createdAt: '2025-09-02T10:00:00Z',
      updatedAt: '2025-09-02T10:00:00Z',
    },
    {
      id: 3,
      title: 'Finish blog post draft',
      completed: false,
      category: 'Work',
      priority: 'High',
      description: 'Write about React 19 and mobile performance architecture',
      subtasks: [],
      attachments: [],
      createdAt: '2025-09-03T10:00:00Z',
      updatedAt: '2025-09-03T10:00:00Z',
    },
    {
      id: 4,
      title: 'Dentist appointment',
      completed: true,
      category: 'Personal',
      priority: 'Low',
      description: 'Routine checkup and cleaning',
      subtasks: [],
      attachments: [],
      createdAt: '2025-09-04T10:00:00Z',
      updatedAt: '2025-09-04T10:00:00Z',
    },
  ];

  it('filters tasks by status: completed vs pending vs all', () => {
    const completedTasks = filterAndSortTasks(mockTasks, '', 'completed', 'all', 'dueDate');
    expect(completedTasks).toHaveLength(2);
    expect(completedTasks.every(t => t.completed)).toBe(true);

    const pendingTasks = filterAndSortTasks(mockTasks, '', 'pending', 'all', 'dueDate');
    expect(pendingTasks).toHaveLength(2);
    expect(pendingTasks.every(t => !t.completed)).toBe(true);

    const allTasks = filterAndSortTasks(mockTasks, '', 'all', 'all', 'dueDate');
    expect(allTasks).toHaveLength(4);
  });

  it('filters tasks by category: Work vs Personal', () => {
    const workTasks = filterAndSortTasks(mockTasks, '', 'all', 'Work', 'dueDate');
    expect(workTasks).toHaveLength(2);
    expect(workTasks.every(t => t.category === 'Work')).toBe(true);

    const personalTasks = filterAndSortTasks(mockTasks, '', 'all', 'Personal', 'dueDate');
    expect(personalTasks).toHaveLength(2);
    expect(personalTasks.every(t => t.category === 'Personal')).toBe(true);
  });

  it('searches tasks by title and description case-insensitively', () => {
    // Search by title keyword
    const marketingResults = filterAndSortTasks(mockTasks, 'marketing', 'all', 'all', 'dueDate');
    expect(marketingResults).toHaveLength(1);
    expect(marketingResults[0].title).toBe('Review Q2 marketing plan');

    // Search by description keyword
    const sourdoughResults = filterAndSortTasks(mockTasks, 'sourdough', 'all', 'all', 'dueDate');
    expect(sourdoughResults).toHaveLength(1);
    expect(sourdoughResults[0].title).toBe('Buy groceries for the week');

    // Search case insensitive uppercase
    const reactResults = filterAndSortTasks(mockTasks, 'REACT 19', 'all', 'all', 'dueDate');
    expect(reactResults).toHaveLength(1);
    expect(reactResults[0].title).toBe('Finish blog post draft');

    // Search non-existing keyword
    const emptyResults = filterAndSortTasks(mockTasks, 'xyznonexistent', 'all', 'all', 'dueDate');
    expect(emptyResults).toHaveLength(0);
  });

  it('sorts tasks by priority (High > Medium > Low)', () => {
    const sortedByPriority = filterAndSortTasks(mockTasks, '', 'all', 'all', 'priority');
    expect(sortedByPriority[0].priority).toBe('High');
    expect(sortedByPriority[1].priority).toBe('High');
    expect(sortedByPriority[2].priority).toBe('Medium');
    expect(sortedByPriority[3].priority).toBe('Low');
  });

  it('sorts tasks by status (Pending first, Completed second)', () => {
    const sortedByStatus = filterAndSortTasks(mockTasks, '', 'all', 'all', 'status');
    expect(sortedByStatus[0].completed).toBe(false);
    expect(sortedByStatus[1].completed).toBe(false);
    expect(sortedByStatus[2].completed).toBe(true);
    expect(sortedByStatus[3].completed).toBe(true);
  });

  it('sorts tasks by title alphabetically', () => {
    const sortedByTitle = filterAndSortTasks(mockTasks, '', 'all', 'all', 'title');
    expect(sortedByTitle[0].title).toBe('Buy groceries for the week');
    expect(sortedByTitle[1].title).toBe('Dentist appointment');
    expect(sortedByTitle[2].title).toBe('Finish blog post draft');
    expect(sortedByTitle[3].title).toBe('Review Q2 marketing plan');
  });
});
