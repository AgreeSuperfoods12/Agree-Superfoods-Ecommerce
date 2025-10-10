export const dynamic = "force-static";

export default function Post() {
  return (
    <main className="mx-auto max-w-3xl p-6 prose">
      <h1>Hello World (Blog)</h1>
      <p>This page is a plain <strong>TSX</strong> route to keep things simple. 
      We can switch the blog to MDX later once you want shortcodes/components.</p>
    </main>
  );
}