export const metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
      <form className="space-y-3">
        <input className="w-full rounded border px-3 py-2" placeholder="Email" type="email" required />
        <input className="w-full rounded border px-3 py-2" placeholder="Password" type="password" required />
        <button className="btn btn-primary w-full" type="submit">Continue</button>
      </form>
      <p className="mt-3 text-sm opacity-70">Demo form (no auth wired yet).</p>
    </main>
  );
}