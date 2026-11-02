import { DummyJsonResponse, Task } from '../types/task';
import { enrichDummyJsonTodo } from '../utils/sampleTasks';

const BASE_URL = 'https://dummyjson.com/todos';
const DEFAULT_TIMEOUT_MS = 8000;

export interface FetchTodosResult {
  tasks: Task[];
  total: number;
  skip: number;
  limit: number;
}

export async function fetchTodosApi(
  limit: number = 20,
  skip: number = 0
): Promise<FetchTodosResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(`${BASE_URL}?limit=${limit}&skip=${skip}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data: DummyJsonResponse = await response.json();

    const enrichedTasks = data.todos.map((todo, idx) =>
      enrichDummyJsonTodo(todo, skip + idx)
    );

    return {
      tasks: enrichedTasks,
      total: data.total,
      skip: data.skip,
      limit: data.limit,
    };
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Network request timed out. Please check your connection.');
    }
    throw error;
  }
}

