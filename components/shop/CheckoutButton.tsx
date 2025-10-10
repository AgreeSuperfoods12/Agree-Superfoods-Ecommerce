"use client";

export function CheckoutButton() {
  const go = async () => {
    const res = await fetch("/api/checkout", { method: "POST" });
    const data = await res.json();
    if (data?.url) window.location.href = data.url;
    else alert(data?.error ?? "Checkout error");
  };
  return <button onClick={go} className="rounded bg-[color:var(--color-brand)] text-white px-4 py-2">Checkout</button>;
}