"use client";

import { useState } from "react";

import { authClient } from "lib/auth/client";

export default function SignInButton() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function signInWithGitHub() {
    setError(null);
    setIsPending(true);

    try {
      const result = await authClient.signIn.social({
        provider: "github",
        callbackURL: "/admin/posts",
      });

      if (result.error) {
        setError("GitHub sign-in could not be started. Please try again.");
        setIsPending(false);
      }
    } catch {
      setError("GitHub sign-in could not be started. Please try again.");
      setIsPending(false);
    }
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={signInWithGitHub}
        disabled={isPending}
        className="border border-white px-4 py-2 disabled:cursor-wait disabled:opacity-60"
      >
        {isPending ? "Connecting to GitHub…" : "Sign in with GitHub"}
      </button>
      {error ? (
        <p role="alert" className="text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}
