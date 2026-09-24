import Link from "next/link";
import { ArrowRight, Check, Clock, Smartphone, MessageCircle, Gift } from "lucide-react";

/* ---------- helpers ---------- */
const panel =
  "rounded-2xl bg-white p-4 ring-1 ring-slate-900/[0.07] shadow-[0_20px_40px_-28px_rgba(15,23,42,.25)] dark:bg-slate-900 dark:ring-white/10 sm:p-5";

type Tone = "green" | "amber" | "slate";
const tones: Record<Tone, string> = {
  green: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
  amber: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  slate: "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300",
};
const Pill = ({ tone, children }: { tone: Tone; children: React.ReactNode }) => (
  <span className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-bold ${tones[tone]}`}>{children}</span>
);

function Step({ when, title, desc, children }: { when: string; title: string; desc: string; children: React.ReactNode }) {
  return (
    <li className="relative grid gap-8 pl-9 sm:pl-12 lg:grid-cols-2 lg:items-center lg:gap-14">
      <span className="absolute left-0 top-1.5 grid h-[18px] w-[18px] place-items-center rounded-full bg-slate-50 ring-1 ring-emerald-500/60 dark:bg-slate-950">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      <div>
        <p className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-[13px] font-bold text-emerald-800 ring-1 ring-emerald-600/15 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20">
          {when}
        </p>
        <h3 className="mt-4 text-2xl font-bold leading-snug tracking-tight text-slate-900 dark:text-white sm:text-[28px]">{title}</h3>
        <p className="mt-3 max-w-md text-base leading-relaxed text-slate-600 dark:text-slate-400">{desc}</p>
      </div>
      <div>{children}</div>
    </li>
  );
}

function Row({ ok = true, children, tail }: { ok?: boolean; children: React.ReactNode; tail?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${ok ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" : "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"}`}>
        {ok ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : <Clock className="h-3.5 w-3.5" />}
      </span>
      <span className="min-w-0 flex-1 text-sm font-medium text-slate-800 dark:text-slate-200">{children}</span>
      {tail && <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{tail}</span>}
    </div>
  );
}

const qr = ["1110111", "1010101", "1110110", "0001011", "1101101", "0101010", "1110111"];

/* ---------- section ---------- */
export default function Workflow() {
  return (
    <section id="workflow" className="relative scroll-mt-24 overflow-hidden bg-slate-100 py-10 dark:bg-slate-950 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-extrabold leading-[1.1] tracking-[-0.025em] text-slate-900 dark:text-white sm:text-2xl">
            Set it up once. It runs the rest.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            Five steps take you from an empty account to a gym that collects dues, checks members in and follows up
            on its own.
          </p>
        </div>

        <div className="relative mt-16 sm:mt-20">
          <div aria-hidden className="absolute bottom-2 left-[8px] top-2 w-px bg-gradient-to-b from-emerald-500/60 via-slate-300/60 to-transparent dark:via-white/10" />

          <ol className="space-y-16 sm:space-y-20">
            <Step
              when="You, once"
              title="Set up your gym"
              desc="Add your branches and membership plans, invite staff with the right roles, add your logo and connect bKash and Nagad."
            >
              <div className={panel}>
                <div className="divide-y divide-slate-100 dark:divide-white/5">
                  {[
                    { n: "Monthly", p: "৳1,500" },
                    { n: "Quarterly", p: "৳4,000" },
                    { n: "Yearly", p: "৳14,000" },
                  ].map((x) => (
                    <div key={x.n} className="flex items-center justify-between py-3">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">{x.n} plan</span>
                      <span className="flex items-center gap-3">
                        <span className="text-sm font-bold tabular-nums text-slate-900 dark:text-white">{x.p}</span>
                        <Pill tone="green">Active</Pill>
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-4 dark:border-white/5">
                  <Pill tone="slate">Gulshan branch</Pill>
                  <Pill tone="slate">3 staff roles</Pill>
                  <Pill tone="green">bKash connected</Pill>
                </div>
              </div>
            </Step>

            <Step
              when="Front desk, every new member"
              title="Enrol members in a minute"
              desc="Add a member, pick a plan and take payment by bKash, Nagad or cash. They get a digital membership card with a QR code on their phone."
            >
              <div className={`${panel} flex items-center gap-5`}>
                <div className="grid shrink-0 grid-cols-7 gap-[3px] rounded-xl bg-slate-900 p-3 dark:bg-white" aria-hidden>
                  {qr.join("").split("").map((c, i) => (
                    <span key={i} className={`h-2.5 w-2.5 rounded-[2px] sm:h-3 sm:w-3 ${c === "1" ? "bg-white dark:bg-slate-900" : "bg-transparent"}`} />
                  ))}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-base font-bold text-slate-900 dark:text-white">Rafi Islam</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Monthly, Gold plan</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Pill tone="green">Paid ৳2,500 by bKash</Pill>
                  </div>
                  <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <Smartphone className="h-3.5 w-3.5" /> Card sent to member app
                  </p>
                </div>
              </div>
            </Step>

            <Step
              when="Every day"
              title="Check members in at the door"
              desc="Members scan their QR code. The screen shows green for active, and flags unpaid dues so your staff can ask before they enter."
            >
              <div className={`${panel} divide-y divide-slate-100 dark:divide-white/5`}>
                {[
                  { t: "6:42 AM", n: "Nadia Karim", s: "Checked in", tone: "green" as Tone },
                  { t: "6:51 AM", n: "Imran Hossain", s: "৳1,500 due", tone: "amber" as Tone },
                  { t: "7:03 AM", n: "Sabbir Hasan", s: "Checked in", tone: "green" as Tone },
                ].map((r) => (
                  <div key={r.t} className="flex items-center gap-4 py-3">
                    <span className="w-16 shrink-0 text-xs font-bold tabular-nums text-slate-500 dark:text-slate-400">{r.t}</span>
                    <span className="flex-1 text-sm font-semibold text-slate-900 dark:text-white">{r.n}</span>
                    <Pill tone={r.tone}>{r.s}</Pill>
                  </div>
                ))}
              </div>
            </Step>

            <Step
              when="Automatically"
              title="Reminders go out on their own"
              desc="Members hear from you in Bangla before a plan ends and after a payment is missed, with a link to renew by bKash. You do nothing."
            >
              <div className={`${panel} divide-y divide-slate-100 py-2 dark:divide-white/5 sm:py-3`}>
                <Row tail="Day -3">Renewal SMS sent to 24 members</Row>
                <Row tail="Day +2">WhatsApp reminder for missed payment</Row>
                <Row tail="Just now">Rafi renewed by bKash, receipt sent</Row>
              </div>
            </Step>

            <Step
              when="Every week"
              title="Review the numbers and grow"
              desc="See renewals, recovered dues and new members at a glance. Offer AI meal plans and personal training to the members most likely to buy."
            >
              <div className={panel}>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { v: "31", l: "Renewals" },
                    { v: "৳38,400", l: "Dues recovered" },
                    { v: "9", l: "New members" },
                  ].map((s) => (
                    <div key={s.l} className="rounded-xl bg-slate-50 p-3 dark:bg-white/[0.04] sm:p-4">
                      <p className="text-lg font-extrabold tabular-nums text-slate-900 dark:text-white sm:text-xl">{s.v}</p>
                      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 sm:text-xs">{s.l}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-[13px] font-medium text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-200">
                  <Gift className="h-4 w-4 shrink-0" /> 24 members would likely buy a meal plan add-on
                </p>
              </div>
            </Step>
          </ol>
        </div>

        <div className="mt-20 flex flex-col gap-8 rounded-[28px] bg-white p-6 ring-1 ring-slate-900/[0.07] dark:bg-slate-900 dark:ring-white/10 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <ul className="grid gap-4 sm:grid-cols-3 lg:gap-8">
            {[
              { icon: Gift, t: "Start with a free trial", d: "No card needed." },
              { icon: MessageCircle, t: "Training in Bangla", d: "For you and your staff." },
              { icon: Smartphone, t: "Works on any phone", d: "Nothing to install for staff." },
            ].map(({ icon: Icon, t, d }) => (
              <li key={t} className="flex items-start gap-3">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>
                  <span className="block text-sm font-bold text-slate-900 dark:text-white">{t}</span>
                  <span className="block text-sm text-slate-600 dark:text-slate-400">{d}</span>
                </span>
              </li>
            ))}
          </ul>
          <Link
            href="/register"
            className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-b from-emerald-500 to-emerald-600 px-7 py-4 text-[15px] font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,.3),0_10px_24px_-6px_rgba(5,150,105,.6)] transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
          >
            Start free trial
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}