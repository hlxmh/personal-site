import SignOutButton from "./sign-out-button";

export default function AccessDeniedPage() {
  return (
    <main className="mx-auto my-16 max-w-lg bg-black/50 p-8 shadow-lg">
      <h1 className="mb-3 text-2xl">Access denied</h1>
      <p className="mb-6">
        This GitHub account is signed in, but it is not authorized to manage this site.
      </p>
      <SignOutButton />
    </main>
  );
}
