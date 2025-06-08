export interface Todo {
  task: string;
  completed: boolean;
  priority: 1 | 2 | 3;
  createdAt: string;
  completedAt?: string;
}