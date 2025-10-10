// components/shop/ShareButton.tsx
"use client";

export function ShareButton({ url, title }: { url: string; title: string }) {
  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ url, title });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Link copied!");
      }
    } catch {
      // user cancelled or not supported
    }
  };
  return (
    <button
      type="button"
      onClick={share}
      className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
    >
      Share
    </button>
  );
}
