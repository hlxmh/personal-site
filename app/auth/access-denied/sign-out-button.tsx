"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "lib/auth/client";

export default function SignOutButton() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function signOut() {
    setError(null);
    setIsPending(true);

    try {
      const result = await authClient.signOut();

      if (result.error) {
        setError("Sign out failed. Please try again.");
        setIsPending(false);
        return;
      }

      router.push("/txt");
      router.refresh();
    } catch {
      setError("Sign out failed. Please try again.");
      setIsPending(false);
    }
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={signOut}
        disabled={isPending}
        className="border border-white px-4 py-2 disabled:cursor-wait disabled:opacity-60"
      >
        {isPending ? "Signing out…" : "Sign out"}
      </button>
      {error ? (
        <p role="alert" className="text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}
