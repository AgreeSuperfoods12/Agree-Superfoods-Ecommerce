import { login } from "../actions";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };
export default async function AdminLogin({ searchParams }: Props) {
  const sp = await searchParams;
  const showError = sp.error ? true : false;

  return (
    <main className="mx-auto max-w-sm px-6 py-12">
      <h1 className="text-2xl font-semibold">Admin Login</h1>
      {showError && <p className="mt-3 text-sm text-red-600">Invalid credentials</p>}
      <form action={login} className="mt-6 grid gap-3">
        <label className="grid gap-1">
          <span className="text-sm">Username</span>
          <input name="user" required className="rounded-lg border px-3 py-2" defaultValue="admin12" />
        </label>
        <label className="grid gap-1">
          <span className="text-sm">Password</span>
          <input name="pass" type="password" required className="rounded-lg border px-3 py-2" defaultValue="admin1122" />
        </label>
        <button className="rounded-lg bg-[color:var(--color-brand)] px-4 py-2 text-white">Sign in</button>
      </form>
    </main>
  );
}
