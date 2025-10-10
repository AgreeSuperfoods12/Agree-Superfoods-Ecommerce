"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const BUS = "header:close-all";

type Props = {
  button: React.ReactNode;
  buttonClassName?: string;
  panelClassName?: string;
  children: React.ReactNode;
  ariaLabel?: string;
};

export default function Popover({
  button,
  buttonClassName = "",
  panelClassName = "",
  children,
  ariaLabel,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // close on route change
  useEffect(() => setOpen(false), [pathname]);

  // close on outside click / esc
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // close when any other popover opens
  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener(BUS, close);
    return () => window.removeEventListener(BUS, close);
  }, []);

  const toggle = () => {
    const next = !open;
    if (next) window.dispatchEvent(new Event(BUS));
    setOpen(next);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        className={buttonClassName}
        onClick={toggle}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={ariaLabel}
      >
        {button}
      </button>

      {open && (
        <div role="menu" className={panelClassName}>
          {children}
        </div>
      )}
    </div>
  );
}
