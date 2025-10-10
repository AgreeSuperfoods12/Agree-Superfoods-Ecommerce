import Link from "next/link";
import MegaMenu from "./MegaMenu";
import { mainNav } from "./nav-data";

export default function HeaderDesktop() {
  return (
    <nav aria-label="Main" className="hidden sm:flex items-center gap-2">
      <MegaMenu />
      {mainNav.slice(1).map((item) => {
        const isSale = item.tone === "sale";
        return (
          <Link
            key={`${item.href}-${item.label}`}
            href={item.href}
            className={`group rounded px-2 py-1 text-sm hover:bg-gray-100 ${
              isSale ? "text-red-600" : ""
            }`}
          >
            <span className="align-middle">{item.label}</span>
            {item.badge && (
              <span
                className={`ml-2 inline-block rounded px-1.5 py-0.5 text-[11px] leading-none ${
                  isSale ? "bg-red-500 text-white" : "bg-gray-900 text-white"
                }`}
              >
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
