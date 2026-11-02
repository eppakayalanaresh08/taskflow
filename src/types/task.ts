export type TaskPriority = 'High' | 'Medium' | 'Low';

export type TaskCategory = 'Work' | 'Personal' | 'Study' | 'Health' | 'Other';

export type TaskStatusFilter = 'all' | 'completed' | 'pending';

export type TaskSortBy = 'dueDate' | 'priority' | 'title' | 'status';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'doc' | 'video';
  uri?: string;
  size?: string;
}

export interface Task {
  id: string | number;
  title: string;
  completed: boolean;
  userId?: number;
  description?: string; // Personal notes
  category: TaskCategory;
  priority: TaskPriority;
  subtasks: SubTask[];
  dueDateFrom?: string; // e.g. '2025/09/02'
  dueTimeFrom?: string; // e.g. '09:24 AM'
  dueDateTo?: string; // e.g. '2025/09/02'
  dueTimeTo?: string; // e.g. '07:34 PM'
  estimatedTime?: string; // e.g. '15m', '30m', '45m'
  attachments: Attachment[];
  section?: 'TODAY' | 'TOMORROW' | 'UPCOMING';
  createdAt: string;
  updatedAt: string;
  isLocal?: boolean; // Flagged when created or edited locally by user
}

export interface DummyJsonTodo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

export interface DummyJsonResponse {
  todos: DummyJsonTodo[];
  total: number;
  skip: number;
  limit: number;
}

