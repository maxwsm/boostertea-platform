export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: ApiError;
  meta?: PaginationMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface AgentHandoff {
  agent: 'kimi' | 'runable' | 'claude';
  taskId: string;
  status: 'complete' | 'partial' | 'blocked';
  artifacts: string[];
  interfacesUsed: string[];
  interfacesExposed: string[];
  tests: string[];
  dependencies: string[];
  notes: string;
}
