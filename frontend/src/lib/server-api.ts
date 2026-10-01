import { cookies } from "next/headers";
import axios, { type AxiosInstance } from "axios";
import { API_BASE_URL } from "@/lib/api";

// Server-only axios client that forwards the JWT stored in the access_token cookie.
export async function getServerApiClient(): Promise<AxiosInstance> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  return axios.create({
    baseURL: API_BASE_URL,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}
