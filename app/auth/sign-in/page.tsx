import { Suspense } from "react";
import { redirect } from "next/navigation";

import { getAuthenticatedUser, isConfiguredAdmin } from "lib/auth/server";

import SignInButton from "./sign-in-button";

async function SignInContent() {
  const user = await getAuthenticatedUser();

  if (user) {
    if (isConfiguredAdmin(user.id)) {
      redirect("/admin/posts");
    }

    redirect("/auth/access-denied");
  }

  return (
    <>
      <h1 className="mb-3 text-2xl">Sign in</h1>
      <p className="mb-6">Use the site owner’s GitHub account to manage posts.</p>
      <SignInButton />
    </>
  );
}

export default function SignInPage() {
  return (
    <main className="mx-auto my-16 max-w-lg bg-black/50 p-8 shadow-lg">
      <Suspense fallback={<p>Checking your session…</p>}>
        <SignInContent />
      </Suspense>
    </main>
  );
}
