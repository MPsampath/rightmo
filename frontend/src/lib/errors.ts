import axios from "axios";

export interface ApiErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
}

export function isValidationError(
  error: unknown
): error is import("axios").AxiosError<ApiErrorResponse> {
  return axios.isAxiosError<ApiErrorResponse>(error) && error.response?.status === 422;
}

export function getValidationErrors(error: unknown): Record<string, string[]> {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.errors ?? {};
  }
  return {};
}

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again."
): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message ?? fallback;
  }
  return fallback;
}
