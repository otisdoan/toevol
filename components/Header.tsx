"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#f1eaea] bg-[#fcfafa]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-4 text-[#1a1616]"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e54d42]/10 text-[#e54d42]">
            <span className="material-symbols-outlined text-2xl">school</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#1a1616]">
            ToeVol
          </h1>
        </Link>

        <nav className="hidden md:flex flex-1 justify-end gap-8">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className={`relative text-sm font-medium transition-colors py-1 ${
                isActive("/") && !isActive("/review")
                  ? "text-[#e54d42] font-semibold after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-[#e54d42] after:rounded-full"
                  : "text-[#6b5c5c] hover:text-[#1a1616]"
              }`}
            >
              Vocabulary
            </Link>
            <Link
              href="/review"
              className={`relative text-sm font-medium transition-colors py-1 ${
                isActive("/review")
                  ? "text-[#e54d42] font-semibold after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-[#e54d42] after:rounded-full"
                  : "text-[#6b5c5c] hover:text-[#1a1616]"
              }`}
            >
              Review
            </Link>
          </div>

          <div className="h-6 w-px bg-[#f1eaea] mx-2"></div>

          <div className="flex items-center gap-3">
            <button className="flex items-center justify-center rounded-full p-2 text-[#6b5c5c] hover:bg-black/5">
              <span className="material-symbols-outlined text-[20px]">
                notifications
              </span>
            </button>
            <button className="h-8 w-8 overflow-hidden rounded-full border border-[#f1eaea] bg-[#e54d42]/10 flex items-center justify-center text-[#e54d42]">
              <span className="material-symbols-outlined text-sm">person</span>
            </button>
          </div>
        </nav>

        <button className="md:hidden flex items-center p-2 text-[#1a1616]">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>
    </header>
  );
}
