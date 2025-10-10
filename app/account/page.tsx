export const metadata = { title: "My Account" };

export default async function AccountPage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold mb-4">My Account</h1>
      <p className="opacity-80">Sign in to view orders & addresses.</p>
      <div className="mt-4 flex gap-3">
        <a className="btn btn-primary" href="/signin">Sign in</a>
        <a className="btn btn-outline" href="/signup">Create account</a>
      </div>
    </main>
  );
}