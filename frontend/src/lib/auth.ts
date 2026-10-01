import { apiClient } from "@/lib/api";
import type {
  AuthResponse,
  AuthUser,
  LoginValues,
  RegisterValues,
} from "@/types/auth";

export async function login(values: LoginValues): Promise<AuthResponse> {
  const { data } = await apiClient.post<{ data: AuthResponse }>("/login", values);
  return data.data;
}

export async function register(values: RegisterValues): Promise<AuthResponse> {
  const { data } = await apiClient.post<{ data: AuthResponse }>("/register", values);
  return data.data;
}

export async function logout(): Promise<void> {
  await apiClient.post("/logout");
}

export async function me(): Promise<AuthUser> {
  const { data } = await apiClient.get<{ data: AuthUser }>("/me");
  return data.data;
}
