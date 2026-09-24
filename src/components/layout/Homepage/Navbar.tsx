"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  Activity, Sun, Moon, Menu, X, User, LogOut, LayoutDashboard, ChevronDown,
  Users, CreditCard, QrCode, Salad, BarChart3, BellRing, Settings, ArrowRight,
} from "lucide-react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elementName: string]: any;
    }
  }
}

/* ---------- content ---------- */
const platform = [
  { icon: Users, title: "Member management", desc: "Profiles, plans and imports in one place" },
  { icon: CreditCard, title: "Billing and dues", desc: "bKash, Nagad and automatic receipts" },
  { icon: QrCode, title: "Smart check-in", desc: "QR entry that works offline" },
  { icon: BellRing, title: "Renewal reminders", desc: "Bangla SMS that recover unpaid dues" },
  { icon: Salad, title: "AI meal planner", desc: "Local food plans inside the member app" },
  { icon: BarChart3, title: "Owner insights", desc: "Revenue, churn and peak hours live" },
];

const links = [
  { id: "features", name: "Features", href: "#features", mega: true },
  { id: "solutions", name: "Solutions", href: "#solutions" },
  { id: "pricing", name: "Pricing", href: "#pricing" },
];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [pill, setPill] = useState({ left: 0, width: 0, on: false });

  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const profileRef = useRef<HTMLDivElement>(null);
  const megaRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const hovering = useRef(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();

  // Dummy state for UI design purposes (set true to preview the account menu)
  const isAuthenticated = false;

  /* scroll state */
  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* scroll-spy for the active section */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-40% 0px -55% 0px" }
    );
    links.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  /* sliding highlight */
  const movePill = useCallback((el: HTMLElement | null) => {
    if (!el) return setPill((p) => ({ ...p, on: false }));
    setPill({ left: el.offsetLeft, width: el.offsetWidth, on: true });
  }, []);

  useEffect(() => {
    if (!hovering.current) movePill(active ? itemRefs.current[active] : null);
  }, [active, movePill, scrolled]);

  /* outside click + Escape */
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (profileRef.current && !profileRef.current.contains(t)) setProfileOpen(false);
      if (megaRef.current && !megaRef.current.contains(t)) setMegaOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setProfileOpen(false);
        setMegaOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  /* lock page scroll behind the mobile sheet */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const openMega = () => { clearTimeout(closeTimer.current); setMegaOpen(true); };
  const closeMega = () => { closeTimer.current = setTimeout(() => setMegaOpen(false), 120); };

  const ThemeToggle = ({ className = "" }: { className?: string }) =>
    mounted ? (
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
        className={`relative grid h-10 w-10 place-items-center rounded-full text-slate-500 transition-colors hover:bg-slate-900/5 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white ${focusRing} ${className}`}
      >
        <Sun className={`absolute h-[18px] w-[18px] transition-all duration-300 motion-reduce:transition-none ${isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0"}`} />
        <Moon className={`absolute h-[18px] w-[18px] transition-all duration-300 motion-reduce:transition-none ${isDark ? "rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100"}`} />
      </button>
    ) : (
      <span className="h-10 w-10" />
    );

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 sm:px-6">
        {/* Bar: full-width at rest, morphs into a floating glass pill on scroll */}
        <div
          style={{ maxWidth: scrolled ? 1040 : 1280 }}
          className={`mx-auto transition-[max-width,margin,background-color,box-shadow,border-radius] duration-500 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none ${
            scrolled
              ? "mt-3 rounded-full bg-white/75 shadow-[0_8px_30px_-12px_rgba(15,23,42,.25)] ring-1 ring-slate-900/[0.06] backdrop-blur-xl dark:bg-slate-900/70 dark:ring-white/10"
              : "mt-0 rounded-none bg-transparent ring-0"
          }`}
        >
          <div className={`flex items-center justify-between transition-all duration-500 motion-reduce:transition-none ${scrolled ? "h-14 pl-4 pr-2.5 sm:pl-5" : "h-[72px] px-1 sm:px-2"}`}>
            {/* Brand */}
            <Link href="/" aria-label="FitEngine home" className={`group flex items-center gap-2.5 rounded-xl ${focusRing}`}>
              <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-700 shadow-[inset_0_1px_0_rgba(255,255,255,.35),0_4px_12px_-2px_rgba(5,150,105,.5)] transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none">
                <Activity className="h-[18px] w-[18px] text-white" strokeWidth={2.5} />
              </span>
              <span className="text-[19px] font-extrabold tracking-tight text-slate-900 dark:text-white">
                Fit<span className="text-emerald-600 dark:text-emerald-400">Engine</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav
              aria-label="Primary"
              className="relative hidden items-center md:flex"
              onMouseLeave={() => {
                hovering.current = false;
                movePill(active ? itemRefs.current[active] : null);
              }}
            >
              <span
                aria-hidden
                style={{ width: pill.width, transform: `translateX(${pill.left}px)`, opacity: pill.on ? 1 : 0 }}
                className="absolute inset-y-0 left-0 my-auto h-9 rounded-full bg-slate-900/[0.06] transition-[transform,width,opacity] duration-300 ease-out motion-reduce:transition-none dark:bg-white/10"
              />
              {links.map((l) => {
                const isActive = active === l.id;
                const cls = `relative z-10 flex h-9 items-center gap-1 rounded-full px-4 text-sm font-semibold transition-colors ${focusRing} ${
                  isActive ? "text-slate-900 dark:text-white" : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                }`;
                return (
                  <div
                    key={l.id}
                    ref={(el) => { itemRefs.current[l.id] = el; }}
                    className="relative"
                    onMouseEnter={(e) => {
                      hovering.current = true;
                      movePill(e.currentTarget);
                      l.mega ? openMega() : setMegaOpen(false);
                    }}
                  >
                    {l.mega ? (
                      <div ref={megaRef} onMouseLeave={closeMega}>
                        <button
                          aria-expanded={megaOpen}
                          aria-haspopup="true"
                          onClick={() => setMegaOpen((v) => !v)}
                          className={cls}
                        >
                          {l.name}
                          <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${megaOpen ? "rotate-180" : ""}`} />
                        </button>

                        {/* Mega panel */}
                        <div
                          className={`absolute left-1/2 top-full z-20 w-[600px] -translate-x-1/2 pt-4 transition-all duration-200 ease-out motion-reduce:transition-none ${
                            megaOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
                          }`}
                          onMouseEnter={openMega}
                        >
                          <div className="overflow-hidden rounded-3xl bg-white shadow-[0_24px_60px_-20px_rgba(15,23,42,.35)] ring-1 ring-slate-900/[0.07] dark:bg-slate-900 dark:ring-white/10">
                            <div className="grid grid-cols-2 gap-1 p-2.5">
                              {platform.map(({ icon: Icon, title, desc }) => (
                                <Link
                                  key={title}
                                  href="#features"
                                  onClick={() => setMegaOpen(false)}
                                  tabIndex={megaOpen ? 0 : -1}
                                  className={`group flex gap-3 rounded-2xl p-3 transition-colors hover:bg-slate-50 dark:hover:bg-white/5 ${focusRing}`}
                                >
                                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white dark:bg-emerald-500/10 dark:text-emerald-400 dark:group-hover:bg-emerald-500 dark:group-hover:text-white">
                                    <Icon className="h-5 w-5" />
                                  </span>
                                  <span>
                                    <span className="block text-sm font-bold text-slate-900 dark:text-white">{title}</span>
                                    <span className="mt-0.5 block text-[13px] leading-snug text-slate-500 dark:text-slate-400">{desc}</span>
                                  </span>
                                </Link>
                              ))}
                            </div>
                            <Link
                              href="#features"
                              onClick={() => setMegaOpen(false)}
                              tabIndex={megaOpen ? 0 : -1}
                              className="group flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-3.5 text-sm font-semibold text-slate-700 transition-colors hover:text-emerald-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300 dark:hover:text-emerald-400"
                            >
                              Explore every feature
                              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Link href={l.href} className={cls}>{l.name}</Link>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Desktop actions */}
            <div className="hidden items-center gap-1.5 md:flex">
              <ThemeToggle />

              {isAuthenticated ? (
                <div className="relative ml-1" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen((v) => !v)}
                    aria-expanded={profileOpen}
                    aria-haspopup="menu"
                    className={`flex items-center gap-2 rounded-full bg-white/70 p-1 pr-3 ring-1 ring-slate-900/10 transition-all hover:ring-emerald-500/60 dark:bg-white/5 dark:ring-white/10 ${focusRing}`}
                  >
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600 text-white">
                      <User className="h-4 w-4" />
                    </span>
                    <span className="max-w-[100px] truncate text-sm font-bold text-slate-700 dark:text-slate-200">Account</span>
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${profileOpen ? "rotate-180" : ""}`} />
                  </button>

                  <div
                    role="menu"
                    className={`absolute right-0 top-full w-64 origin-top-right pt-3 transition-all duration-200 motion-reduce:transition-none ${
                      profileOpen ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden rounded-2xl bg-white py-1.5 shadow-[0_24px_60px_-20px_rgba(15,23,42,.35)] ring-1 ring-slate-900/[0.07] dark:bg-slate-900 dark:ring-white/10">
                      <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 dark:border-white/10">
                        <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-100 dark:bg-emerald-500/15">
                          <User className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-900 dark:text-white">User Name</p>
                          <p className="truncate text-xs text-slate-500 dark:text-slate-400">user@example.com</p>
                        </div>
                      </div>
                      {[
                        { icon: LayoutDashboard, label: "Admin dashboard", href: "/dashboard" },
                        { icon: Settings, label: "Account settings", href: "/settings" },
                      ].map(({ icon: Icon, label, href }) => (
                        <Link
                          key={label}
                          href={href}
                          role="menuitem"
                          tabIndex={profileOpen ? 0 : -1}
                          onClick={() => setProfileOpen(false)}
                          className="mx-1.5 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5"
                        >
                          <Icon className="h-4 w-4 text-emerald-500" />
                          {label}
                        </Link>
                      ))}
                      <div className="mx-3 my-1.5 h-px bg-slate-100 dark:bg-white/10" />
                      <button
                        role="menuitem"
                        tabIndex={profileOpen ? 0 : -1}
                        onClick={() => setProfileOpen(false)}
                        className="mx-1.5 flex w-[calc(100%-0.75rem)] items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="ml-1 flex items-center gap-1.5">
                  <Link href="/login" className={`rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white ${focusRing}`}>
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className={`group inline-flex items-center gap-1.5 rounded-full bg-gradient-to-b from-emerald-500 to-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,.3),0_6px_16px_-4px_rgba(5,150,105,.55)] transition-all hover:-translate-y-px hover:shadow-[inset_0_1px_0_rgba(255,255,255,.3),0_10px_22px_-4px_rgba(5,150,105,.65)] active:translate-y-0 motion-reduce:transform-none ${focusRing}`}
                  >
                    Get started
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile controls */}
            <div className="flex items-center gap-1 md:hidden">
              <ThemeToggle />
              <button
                onClick={() => setMobileOpen((v) => !v)}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                className={`grid h-10 w-10 place-items-center rounded-full text-slate-700 transition-colors hover:bg-slate-900/5 dark:text-slate-200 dark:hover:bg-white/10 ${focusRing}`}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile sheet */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 motion-reduce:transition-none ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!mobileOpen}
      >
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
        <div
          className={`absolute inset-x-3 top-[76px] max-h-[calc(100dvh-92px)] overflow-y-auto rounded-3xl bg-white p-3 shadow-2xl ring-1 ring-slate-900/[0.07] transition-all duration-300 ease-out motion-reduce:transition-none dark:bg-slate-900 dark:ring-white/10 ${
            mobileOpen ? "translate-y-0 scale-100" : "-translate-y-2 scale-[0.98]"
          }`}
        >
          <div className="grid grid-cols-2 gap-2 pb-3">
            {platform.map(({ icon: Icon, title }) => (
              <Link
                key={title}
                href="#features"
                onClick={() => setMobileOpen(false)}
                tabIndex={mobileOpen ? 0 : -1}
                className="flex flex-col gap-2 rounded-2xl bg-slate-50 p-3.5 dark:bg-white/5"
              >
                <Icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[13px] font-bold leading-tight text-slate-800 dark:text-slate-100">{title}</span>
              </Link>
            ))}
          </div>

          <div className="border-t border-slate-100 py-2 dark:border-white/10">
            {links.map((l) => (
              <Link
                key={l.id}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                tabIndex={mobileOpen ? 0 : -1}
                className={`flex items-center justify-between rounded-xl px-3 py-3.5 text-base font-bold transition-colors hover:bg-slate-50 dark:hover:bg-white/5 ${
                  active === l.id ? "text-emerald-700 dark:text-emerald-400" : "text-slate-800 dark:text-slate-100"
                }`}
              >
                {l.name}
                <ArrowRight className="h-4 w-4 text-slate-300 dark:text-slate-600" />
              </Link>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-3 dark:border-white/10">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3.5 font-bold text-white">
                  <LayoutDashboard className="h-5 w-5" /> Open dashboard
                </Link>
                <button onClick={() => setMobileOpen(false)} className="flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3.5 font-bold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10">
                  <LogOut className="h-5 w-5" /> Sign out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/login" onClick={() => setMobileOpen(false)} className="rounded-2xl px-4 py-3.5 text-center font-bold text-slate-700 ring-1 ring-slate-200 dark:text-slate-200 dark:ring-white/15">
                  Log in
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)} className="rounded-2xl bg-gradient-to-b from-emerald-500 to-emerald-600 px-4 py-3.5 text-center font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,.3)]">
                  Get started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
