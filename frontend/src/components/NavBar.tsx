"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function NavBar() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
          Product Dashboard
        </Link>

        <div className="flex items-center gap-4 text-sm">
          {!loading && user && (
            <Link href="/admin" className="font-medium text-zinc-700 hover:underline dark:text-zinc-300">
              Admin
            </Link>
          )}

          {!loading && user ? (
            <>
              <span className="text-zinc-500 dark:text-zinc-400">{user.name}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md border border-zinc-300 px-3 py-1.5 font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                Logout
              </button>
            </>
          ) : (
            !loading && (
              <>
                <Link href="/login" className="font-medium text-zinc-700 hover:underline dark:text-zinc-300">
                  Login
                </Link>
                {/* <Link href="/register" className="font-medium text-zinc-700 hover:underline dark:text-zinc-300">
                  Register
                </Link> */}
              </>
            )
          )}
        </div>
      </nav>
    </header>
  );
}
