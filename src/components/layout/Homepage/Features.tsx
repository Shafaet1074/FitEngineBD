import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Wallet, QrCode, BellRing, Salad, TrendingDown, CalendarClock, WifiOff, ArrowRight,
  Building2, ShieldCheck, FileSpreadsheet, Smartphone, ScrollText, Languages, BadgeCheck, TriangleAlert,
} from "lucide-react";

/* ---------- small helpers ---------- */
type Tone = "green" | "amber" | "red" | "slate";
const tones: Record<Tone, string> = {
  green: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
  amber: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  red: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
  slate: "bg-slate-200/70 text-slate-700 dark:bg-white/10 dark:text-slate-300",
};

function Pill({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${tones[tone]}`}>{children}</span>;
}

function Card({
  icon: Icon, title, desc, className = "", children,
}: { icon: LucideIcon; title: string; desc: string; className?: string; children: React.ReactNode }) {
  return (
    <article
      className={`flex flex-col overflow-hidden rounded-[28px] bg-white p-6 ring-1 ring-slate-900/[0.07] dark:bg-slate-900 dark:ring-white/10 sm:p-8 ${className}`}
    >
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-600 text-white shadow-[inset_0_1px_0_rgba(255,255,255,.3)]">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="mt-5 max-w-sm text-xl font-bold leading-snug tracking-tight text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-2 max-w-md text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">{desc}</p>
      <div className="mt-7 flex-1">{children}</div>
    </article>
  );
}

const panel = "rounded-2xl bg-slate-50 p-3.5 dark:bg-white/[0.04]";

/* ---------- data ---------- */
const invoices = [
  { n: "Rafi Islam", p: "Monthly, Gold", a: "৳2,500", s: "Paid", t: "green" as Tone },
  { n: "Sadia Rahman", p: "Quarterly", a: "৳6,000", s: "Due today", t: "amber" as Tone },
  { n: "Imran Hossain", p: "Monthly", a: "৳1,500", s: "5 days late", t: "red" as Tone },
  { n: "Farhana Akter", p: "Yearly", a: "৳18,000", s: "Paid", t: "green" as Tone },
];

const meals = [
  { m: "Breakfast", f: "Ruti, egg bhaji, banana", k: 420 },
  { m: "Lunch", f: "Rice, masoor dal, chicken curry, salad", k: 640 },
  { m: "Snack", f: "Roasted chola, tea without sugar", k: 180 },
  { m: "Dinner", f: "Ruti, mixed vegetables, hilsa", k: 560 },
];

const atRisk = [
  { n: "Tanvir Ahmed", note: "No visit in 12 days", bars: [8, 7, 5, 3, 1, 0], t: "red" as Tone, r: "High risk" },
  { n: "Nusrat Jahan", note: "Down from 4 to 1 a week", bars: [7, 6, 5, 4, 3, 2], t: "amber" as Tone, r: "Watch" },
];

const slots = [
  { t: "6:00 AM", c: "Morning yoga", s: "12 of 15", tone: "green" as Tone },
  { t: "7:00 AM", c: "HIIT circuit", s: "Full, 3 waiting", tone: "amber" as Tone },
  { t: "6:30 PM", c: "Strength basics", s: "9 of 20", tone: "green" as Tone },
];

const extras = [
  { icon: Building2, t: "Multi-branch reports" },
  { icon: ShieldCheck, t: "Role-based access" },
  { icon: FileSpreadsheet, t: "Import from Excel" },
  { icon: Smartphone, t: "Member mobile app" },
  { icon: ScrollText, t: "Full audit log" },
  { icon: Languages, t: "Bangla and English" },
];

export default function Features() {
  return (
    <section id="features" className="relative scroll-mt-24 bg-slate-50 py-20 dark:bg-slate-950 sm:py-28">
      <div className=" px-4 sm:px-6 lg:px-6">
        {/* heading */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="">
            <h2 className="text-3xl font-extrabold leading-[1.1] tracking-[-0.025em] text-slate-900 dark:text-white sm:text-3xl">
             Features
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
               Everything your front desk, trainers and members need
            </p>
          </div>
          {/* <Link
            href="#pricing"
            className="group inline-flex shrink-0 items-center gap-2 text-[15px] font-bold text-emerald-700 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            See plans and pricing
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link> */}
        </div>

        {/* bento */}
        <div className="mt-14 grid gap-4 sm:gap-5 lg:grid-cols-6">
          {/* Billing */}
          <Card
            icon={Wallet}
            title="Know who has paid before they walk in"
            desc="Take bKash, Nagad and cash payments, send receipts automatically, and see every unpaid due in one list."
            className="lg:col-span-4"
          >
            <div className={`${panel} space-y-1`}>
              {invoices.map((i) => (
                <div key={i.n} className="flex items-center gap-3 rounded-xl px-2 py-2.5 sm:px-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-xs font-bold text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-white/10">
                    {i.n.split(" ").map((w) => w[0]).join("")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-slate-900 dark:text-white">{i.n}</span>
                    <span className="block truncate text-xs text-slate-500 dark:text-slate-400">{i.p}</span>
                  </span>
                  <span className="text-sm font-bold tabular-nums text-slate-900 dark:text-white">{i.a}</span>
                  <span className="hidden w-24 justify-end sm:flex"><Pill tone={i.t}>{i.s}</Pill></span>
                </div>
              ))}
            </div>
          </Card>

          {/* Check-in */}
          <Card
            icon={QrCode}
            title="Check-in that works without internet"
            desc="Scan a member's QR code at the door. Entries are saved offline and sync when you reconnect."
            className="lg:col-span-2"
          >
            <div className="space-y-2.5">
              <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-3.5 ring-1 ring-emerald-600/15 dark:bg-emerald-500/10 dark:ring-emerald-400/20">
                <BadgeCheck className="h-6 w-6 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>
                  <span className="block text-sm font-bold text-slate-900 dark:text-white">Nadia Karim</span>
                  <span className="block text-xs text-slate-600 dark:text-slate-400">Active, 12 days left</span>
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-amber-50 p-3.5 ring-1 ring-amber-600/15 dark:bg-amber-500/10 dark:ring-amber-400/20">
                <TriangleAlert className="h-6 w-6 shrink-0 text-amber-600 dark:text-amber-400" />
                <span>
                  <span className="block text-sm font-bold text-slate-900 dark:text-white">Imran Hossain</span>
                  <span className="block text-xs text-slate-600 dark:text-slate-400">৳1,500 due, ask for payment</span>
                </span>
              </div>
              <p className="flex items-center gap-2 pt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                <WifiOff className="h-3.5 w-3.5" /> Offline: 14 entries waiting to sync
              </p>
            </div>
          </Card>

          {/* Reminders */}
          <Card
            icon={BellRing}
            title="Reminders members actually read"
            desc="Bangla SMS and WhatsApp messages go out before a plan ends and after a payment is missed."
            className="lg:col-span-2"
          >
            <div className={`${panel} space-y-3`}>
              <div className="ml-auto max-w-[92%] rounded-2xl rounded-br-md bg-emerald-600 px-4 py-3 text-[13px] leading-relaxed text-white">
                আপনার মেম্বারশিপ ৩ দিনে শেষ হবে। বিকাশে এখনই রিনিউ করুন।
              </div>
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400">
                <span>Sent automatically to 24 members</span>
                <Pill tone="green">Delivered</Pill>
              </div>
            </div>
          </Card>

          {/* Meal planner */}
          <Card
            icon={Salad}
            title="Meal plans built on rice, dal and hilsa"
            desc="Members get a weekly plan for their goal, budget and food habits. Your nutritionist approves it before it goes out."
            className="lg:col-span-4"
          >
            <div className={panel}>
              <div className="mb-2 flex items-center justify-between px-1.5">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Saturday, fat loss, 1,800 kcal</span>
                <Pill tone="green">Approved by nutritionist</Pill>
              </div>
              {meals.map((m) => (
                <div key={m.m} className="flex items-center gap-3 rounded-xl px-1.5 py-2 sm:gap-4">
                  <span className="w-16 shrink-0 text-xs font-bold text-slate-500 dark:text-slate-400 sm:w-20">{m.m}</span>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800 dark:text-slate-200">{m.f}</span>
                  <span className="text-xs font-bold tabular-nums text-slate-900 dark:text-white">{m.k} kcal</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Insights */}
          <Card
            icon={TrendingDown}
            title="See who is about to leave"
            desc="Members whose visits drop are flagged early, so you can call before they cancel."
            className="lg:col-span-3"
          >
            <div className="space-y-2.5">
              {atRisk.map((m) => (
                <div key={m.n} className={`${panel} flex items-center gap-4`}>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-slate-900 dark:text-white">{m.n}</span>
                    <span className="block truncate text-xs text-slate-500 dark:text-slate-400">{m.note}</span>
                  </span>
                  <span className="flex h-8 items-end gap-1" aria-hidden>
                    {m.bars.map((b, i) => (
                      <span key={i} className="w-1.5 rounded-sm bg-emerald-500/60" style={{ height: `${Math.max(b, 0.5) * 12.5}%` }} />
                    ))}
                  </span>
                  <Pill tone={m.t}>{m.r}</Pill>
                </div>
              ))}
            </div>
          </Card>

          {/* Classes */}
          <Card
            icon={CalendarClock}
            title="Classes and trainers, without the phone calls"
            desc="Members book from their phone. Sessions and trainer commissions are tracked for you."
            className="lg:col-span-3"
          >
            <div className="space-y-2.5">
              {slots.map((s) => (
                <div key={s.t} className={`${panel} flex items-center gap-4`}>
                  <span className="w-16 shrink-0 text-xs font-bold tabular-nums text-slate-500 dark:text-slate-400">{s.t}</span>
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-900 dark:text-white">{s.c}</span>
                  <Pill tone={s.tone}>{s.s}</Pill>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* also included */}
        <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-5 rounded-[28px] bg-white p-6 ring-1 ring-slate-900/[0.07] dark:bg-slate-900 dark:ring-white/10 sm:mt-5 sm:p-8 md:grid-cols-3 lg:grid-cols-6">
          {extras.map(({ icon: Icon, t }) => (
            <div key={t} className="flex items-center gap-3">
              <Icon className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}