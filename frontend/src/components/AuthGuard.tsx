"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

// Redirects to /login when there is no authenticated user.
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-16 text-center text-sm text-zinc-500">
        Checking authentication…
      </div>
    );
  }

  return <>{children}</>;
}
