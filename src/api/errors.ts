// api/errors.ts
export type ApiErrorCode =
  | 'NETWORK'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION'
  | 'HTTP_ERROR';

export type ApiError = {
  code: ApiErrorCode;
  status?: number;
  message: string;
  details?: any;
};
