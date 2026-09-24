import Link from "next/link";
import { ArrowRight, Check, Play, QrCode, Salad, Wallet, TrendingUp } from "lucide-react";

/* ---------- content ---------- */
const proof = ["Bangla SMS reminders", "Offline QR check-in", "bKash and Nagad payments"];

const stats = [
  { label: "Collected today", value: "৳48,600", note: "+12% vs last Sat", up: true },
  { label: "Dues outstanding", value: "৳1,12,400", note: "38 members", up: false },
  { label: "Active members", value: "642", note: "9 joined this week", up: true },
];

const week = [
  { d: "Sat", h: 42 }, { d: "Sun", h: 58 }, { d: "Mon", h: 47 }, { d: "Tue", h: 71 },
  { d: "Wed", h: 64 }, { d: "Thu", h: 88 }, { d: "Fri", h: 76 },
];

const expiring = [
  { name: "Tanvir Ahmed", left: "2 days left", init: "TA" },
  { name: "Nusrat Jahan", left: "3 days left", init: "NJ" },
  { name: "Sabbir Hasan", left: "5 days left", init: "SH" },
];

const rise = (ms: number) => ({ animationDelay: `${ms}ms` });

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-white pb-20 pt-32 dark:bg-slate-950 sm:pt-36 lg:pb-28 lg:pt-40"
    >
      {/* one-time entrance + chart grow; disabled for reduced motion */}
      <style>{`
        @keyframes fe-rise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
        @keyframes fe-grow{from{transform:scaleY(0)}to{transform:scaleY(1)}}
        .fe-rise{opacity:0;animation:fe-rise .9s cubic-bezier(.22,1,.36,1) forwards}
        .fe-grow{transform-origin:bottom;transform:scaleY(0);animation:fe-grow .9s cubic-bezier(.22,1,.36,1) forwards}
        @media (prefers-reduced-motion:reduce){.fe-rise{opacity:1;animation:none}.fe-grow{transform:none;animation:none}}
      `}</style>

      {/* faint grid, fades out downward */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgba(100,116,139,.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,116,139,.10)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-[1fr_1.08fr] lg:gap-12 lg:px-8">
        {/* ---------- copy ---------- */}
        <div className="max-w-xl">
          <Link
            href="#features"
            className="fe-rise group inline-flex items-center gap-2 rounded-full bg-emerald-50 py-1 pl-1 pr-3 text-[13px] font-semibold text-emerald-800 ring-1 ring-emerald-600/15 transition-colors hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20 dark:hover:bg-emerald-500/15"
            style={rise(0)}
          >
            <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[11px] font-bold text-white">New</span>
            AI meal plans with local Bangladeshi food
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <h1
            className="fe-rise mt-6 text-[1.6rem] font-extrabold leading-[1.04] tracking-[-0.03em] text-slate-900 dark:text-white sm:text-6xl lg:text-[44px]"
            style={rise(80)}
          >
            Recover unpaid dues. Keep members longer.
          </h1>

          <p className="fe-rise mt-6 max-w-lg text-md leading-relaxed text-slate-600 dark:text-slate-400" style={rise(160)}>
            FitEngine runs billing, check-ins, class booking and nutrition for your gym, so you always know who
            paid, who is about to leave, and what to do next.
          </p>

          <div className="fe-rise mt-9 flex flex-col gap-3 sm:flex-row" style={rise(240)}>
            <Link
              href="/register"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-emerald-500 to-emerald-600 px-7 py-4 text-[15px] font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,.3),0_10px_24px_-6px_rgba(5,150,105,.6)] transition-all hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,.3),0_16px_30px_-6px_rgba(5,150,105,.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
            >
              Start free trial
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="#workflow"
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-white px-6 py-4 text-[15px] font-bold text-slate-900 ring-1 ring-slate-900/10 transition-all hover:bg-slate-50 hover:ring-slate-900/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:bg-white/5 dark:text-white dark:ring-white/15 dark:hover:bg-white/10"
            >
              <span className="grid h-6 w-6 place-items-center rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                <Play className="h-3 w-3 translate-x-px fill-current" />
              </span>
              See how it works
            </Link>
          </div>

          <ul className="fe-rise mt-8 flex flex-wrap gap-x-6 gap-y-2.5" style={rise(320)}>
            {proof.map((p) => (
              <li key={p} className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-100 dark:bg-emerald-500/15">
                  <Check className="h-3 w-3 text-emerald-700 dark:text-emerald-400" strokeWidth={3} />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* ---------- product ---------- */}
        <div className="fe-rise relative pb-8 lg:pb-10" style={rise(200)}>
          {/* dashboard frame */}
          <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_50px_90px_-40px_rgba(15,23,42,.45)] ring-1 ring-slate-900/10 dark:bg-slate-900 dark:ring-white/10">
            <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/80 px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
              <span className="mx-auto rounded-md bg-white px-10 py-1 text-[11px] font-medium text-slate-400 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-500 dark:ring-white/10">
                yourgym.fitengine.app
              </span>
            </div>

            <div className="space-y-4 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-bold text-slate-900 dark:text-white">Good morning, Karim</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Here is where Gulshan branch stands today</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:bg-white/10 dark:text-slate-200">
                  Gulshan branch
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                {stats.map((s) => (
                  <div key={s.label} className="rounded-2xl bg-slate-50 p-3 dark:bg-white/[0.04] sm:p-4">
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 sm:text-xs">{s.label}</p>
                    <p className="mt-1 text-base font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-xl">{s.value}</p>
                    <p className={`mt-1 flex items-center gap-1 text-[11px] font-semibold ${s.up ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                      {s.up && <TrendingUp className="h-3 w-3" />}
                      {s.note}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid gap-3 md:grid-cols-5">
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/[0.04] md:col-span-3">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Revenue this week</p>
                  <div className="mt-4 flex h-28 items-end gap-2">
                    {week.map((b, i) => (
                      <div key={b.d} className="flex flex-1 flex-col items-center gap-1.5">
                        <div className="flex h-full w-full items-end">
                          <div
                            className={`fe-grow w-full rounded-md ${i === 5 ? "bg-emerald-500" : "bg-emerald-500/25 dark:bg-emerald-400/25"}`}
                            style={{ height: `${b.h}%`, animationDelay: `${500 + i * 70}ms` }}
                          />
                        </div>
                        <span className="text-[10px] font-medium text-slate-400">{b.d}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/[0.04] md:col-span-2">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Expiring this week</p>
                  <ul className="mt-3 space-y-2.5">
                    {expiring.map((m) => (
                      <li key={m.name} className="flex items-center gap-2.5">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-100 text-[11px] font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                          {m.init}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-xs font-semibold text-slate-800 dark:text-slate-100">{m.name}</span>
                          <span className="block text-[11px] text-slate-500 dark:text-slate-400">{m.left}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 rounded-lg bg-slate-900 py-2 text-center text-[11px] font-bold text-white dark:bg-white dark:text-slate-900">
                    Send 3 reminders
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* floating: payment */}
          <div
            className="fe-rise absolute -right-3 -top-5 hidden items-center gap-3 rounded-2xl bg-white p-3 pr-5 shadow-[0_20px_40px_-16px_rgba(15,23,42,.4)] ring-1 ring-slate-900/[0.08] dark:bg-slate-800 dark:ring-white/10 sm:flex lg:-right-8"
            style={rise(700)}
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600 text-white">
              <Wallet className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-bold text-slate-900 dark:text-white">৳2,500 received</span>
              <span className="block text-xs text-slate-500 dark:text-slate-400">Rafi Islam paid by bKash</span>
            </span>
          </div>

          {/* floating: live check-in */}
          <div
            className="fe-rise absolute -bottom-2 -left-3 flex items-center gap-3 rounded-2xl bg-white p-3 pr-5 shadow-[0_20px_40px_-16px_rgba(15,23,42,.4)] ring-1 ring-slate-900/[0.08] dark:bg-slate-800 dark:ring-white/10 lg:-left-10"
            style={rise(900)}
          >
            <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
              <QrCode className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:animate-none" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-800" />
              </span>
            </span>
            <span>
              <span className="block text-sm font-bold text-slate-900 dark:text-white">Nadia checked in</span>
              <span className="block text-xs text-slate-500 dark:text-slate-400">6:42 AM, membership active</span>
            </span>
          </div>

          {/* floating: meal plan */}
          <div
            className="fe-rise absolute -bottom-4 right-4 hidden w-52 rounded-2xl bg-white p-3.5 shadow-[0_20px_40px_-16px_rgba(15,23,42,.4)] ring-1 ring-slate-900/[0.08] dark:bg-slate-800 dark:ring-white/10 lg:block xl:-right-6"
            style={rise(1100)}
          >
            <div className="flex items-center gap-2">
              <Salad className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">Today&apos;s plan, 2,150 kcal</span>
            </div>
            {[
              { k: "Protein", w: "70%" },
              { k: "Carbs", w: "55%" },
              { k: "Fat", w: "40%" },
            ].map((m) => (
              <div key={m.k} className="mt-2 flex items-center gap-2">
                <span className="w-11 text-[10px] font-medium text-slate-500 dark:text-slate-400">{m.k}</span>
                <span className="h-1.5 flex-1 rounded-full bg-slate-100 dark:bg-white/10">
                  <span className="block h-full rounded-full bg-emerald-500" style={{ width: m.w }} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}