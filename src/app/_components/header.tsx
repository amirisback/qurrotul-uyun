"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useFavorites } from "@/lib/use-favorites";
import { SearchModal } from "./search-modal";
import { MobileDrawer } from "./mobile-drawer";
import { ThemeSwitcher } from "./theme-switcher";
import { LanguageSwitcher } from "./language-switcher";
import { RubElHizb } from "./islamic-ornaments";

export function Header() {
  const pathname = usePathname();
  const { totalFavorites, isLoaded } = useFavorites();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/kitab", label: "Kitab" },
    { href: "/doa", label: "Doa" },
    { href: "/panduan-waktu", label: "Waktu Jima'" },
    { href: "/siklus-haid", label: "Siklus Haid" },
    { href: "/favorit", label: "Favorit" },
    { href: "/tentang", label: "Tentang" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/85 backdrop-blur-md transition-colors">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4 max-w-6xl">
          {/* Brand Logo & Title */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center p-1.5 transition-transform group-hover:scale-105">
              <Image
                src="/logo.svg"
                alt="Logo Qurrotul Uyun"
                width={24}
                height={24}
                className="w-full h-auto text-primary"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base md:text-lg tracking-tight text-foreground group-hover:text-primary transition-colors leading-tight">
                Qurrotul Uyun
              </span>
              <div className="flex items-center gap-1.5">
                <RubElHizb size="sm" className="w-2.5 h-2.5 text-accent/80" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                  Fiqih Pernikahan
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search Trigger Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border/70 bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground text-xs md:text-sm transition-all"
              aria-label="Cari Bab dan Doa"
            >
              <svg
                className="w-4 h-4 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span className="hidden sm:inline">Cari...</span>
              <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] bg-background border border-border rounded font-mono text-muted-foreground">
                ⌘K
              </kbd>
            </button>

            {/* Bookmark Quick Access */}
            <Link
              href="/favorit"
              className="relative p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Item Favorit"
            >
              <svg
                className="w-5 h-5 text-accent"
                fill={totalFavorites > 0 ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              {isLoaded && totalFavorites > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-accent text-[10px] font-bold text-accent-foreground flex items-center justify-center leading-none">
                  {totalFavorites}
                </span>
              )}
            </Link>

            {/* Mobile Drawer Hamburger */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="md:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Buka Menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Switchers preserved but hidden per GUIDELINE.md pasal 14 */}
            <div className="hidden" aria-hidden="true">
              <ThemeSwitcher />
              <LanguageSwitcher />
            </div>
          </div>
        </div>
        {/* Subtle Ramadan Golden Rim */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-accent/30 dark:via-accent/40 to-transparent" />
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Drawer Menu */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />
    </>
  );
}
