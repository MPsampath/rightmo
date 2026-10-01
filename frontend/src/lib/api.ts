import axios from "axios";

// On the server (SSR/Docker), prefer an internal network URL (e.g. http://backend:8000/api)
// when provided; the browser always uses the publicly reachable NEXT_PUBLIC_API_URL.
export const API_BASE_URL =
  (typeof window === "undefined" ? process.env.API_INTERNAL_URL : undefined) ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// On an unauthorized/expired session, clear local auth state and send the user to log in.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      window.localStorage.removeItem("access_token");
      window.localStorage.removeItem("auth_user");
      document.cookie = "access_token=; path=/; max-age=0";

      if (!window.location.pathname.startsWith("/login")) {
        const next = window.location.pathname + window.location.search;
        // Hard navigation (outside React) forces a clean reload of auth state; router.push isn't available here.
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.href = `/login?next=${encodeURIComponent(next)}`;
      }
    }
    return Promise.reject(error);
  }
);

// Resolves a product's image_path into a fully-qualified URL for <img> tags.
export function resolveImageUrl(imagePath: string | null): string | null {
  if (!imagePath) return null;
  if (/^https?:\/\//i.test(imagePath)) return imagePath;
  const storageBase = API_BASE_URL.replace(/\/api\/?$/, "");
  return `${storageBase}/storage/${imagePath}`;
}
