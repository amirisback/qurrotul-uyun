"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ThemeSwitcher } from "./theme-switcher";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
}

export function MobileDrawer({ isOpen, onClose, onOpenSearch }: MobileDrawerProps) {
  const pathname = usePathname();

  if (!isOpen) return null;

  const links = [
    { href: "/", label: "Beranda", icon: "🕌" },
    { href: "/kitab", label: "Kitab (20 Bab)", icon: "📖" },
    { href: "/doa", label: "Kumpulan Doa", icon: "🤲" },
    { href: "/panduan-waktu", label: "Panduan Waktu Jima'", icon: "⏳" },
    { href: "/siklus-haid", label: "Siklus Haid & Masa Subur", icon: "🩸" },
    { href: "/favorit", label: "Favorit Tersimpan", icon: "⭐" },
    { href: "/tentang", label: "Tentang Kitab & Penulis", icon: "📜" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-4/5 max-w-xs bg-card h-full shadow-2xl z-10 flex flex-col border-r border-border p-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center p-2">
              <Image
                src="/logo.svg"
                alt="Logo Qurrotul Uyun"
                width={28}
                height={28}
                className="w-full h-auto text-primary"
              />
            </div>
            <div>
              <h2 className="font-bold text-foreground text-base tracking-tight leading-none">
                Qurrotul Uyun
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">Panduan Rumah Tangga</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
            aria-label="Tutup Menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search Quick Action */}
        <button
          onClick={() => {
            onClose();
            onOpenSearch();
          }}
          className="mt-4 flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-muted/60 hover:bg-muted text-muted-foreground text-sm font-medium border border-border/80 transition-colors w-full text-left"
        >
          <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span>Cari bab atau doa...</span>
        </button>

        {/* Navigation Links */}
        <nav className="mt-6 flex-1 space-y-1.5 overflow-y-auto">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                    : "text-foreground hover:bg-muted hover:text-primary"
                }`}
              >
                <span className="text-lg leading-none">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Theme Preferences Section */}
        <div className="pt-4 pb-2 border-t border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
            Tema Tampilan
          </p>
          <ThemeSwitcher variant="drawer" />
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-border text-xs text-muted-foreground text-center">
          <p className="font-medium text-foreground">Syarah Nadzam Ibni Yamun</p>
          <p className="mt-0.5">Versi Web Progressive App</p>
        </div>
      </div>
    </div>
  );
}
