# GymOS: Gym SaaS Platform Blueprint

**Stack:** Next.js (App Router) · Tailwind CSS + shadcn/ui · Supabase (Postgres, Storage, Realtime, Edge Functions) · Firebase Auth · JWT · Redis (Upstash) · Vercel

---

## 1. Product vision

A multi-tenant platform where each gym (tenant) gets an admin dashboard, staff tools, and a member portal, with local payments (bKash/Nagad), automated reminders, offline check-in, and an AI meal planner using Bangladeshi food data.

**Positioning:** "Recover dues, reduce churn, earn more per member."

---

## 2. Feature map

### Core (MVP)

| Module                | Features                                                                         |
|-----------------------|----------------------------------------------------------------------------------|
| Tenant and branding   | Gym onboarding, logo/colors, subdomain, branches, feature flags per plan         |
| Auth and RBAC         | Phone/email login, 2FA for owners, roles, permission matrix                      |
| Members               | Profiles, health info, documents, import from Excel/CSV, tags                    |
| Plans and memberships | Packages, PT bundles, freeze/pause, discounts, auto-expiry                       |
| Billing               | Invoices, dues, receipts, refunds, bKash/Nagad/SSLCommerz, cash entry with audit |
| Attendance            | QR check-in, staff scan, offline queue, payment-status gate                      |
| Notifications         | SMS/WhatsApp/push/email templates, renewal and due reminders (Bangla)            |
| Owner dashboard       | Live revenue, dues, expiring members, attendance, new joins                      |

### Growth (Phase 2)

Class scheduling and booking with waitlists, trainer commission and payroll, workout plans and progress tracking, lead CRM, churn-risk list, POS/inventory, multi-branch reports.

### Differentiators (Phase 3)

AI meal planner, wearables, challenges/leaderboards, upsell engine, white-label mobile app, public API and webhooks.

### Platform owner (you)

Tenant management, SaaS subscriptions, usage metering (SMS, AI), impersonation with audit, support tools, global analytics.

---

## 3. Architecture

Do not start with many separate services. Use a **modular monolith in Next.js** plus **Supabase Edge Functions** for isolated workloads. Split later only where load demands it.

```mermaid
flowchart TB
  subgraph Client
    W[Next.js Web App<br/>Admin / Staff / Member]
    P[PWA + Offline Check-in]
  end
  subgraph Edge
    CDN[Vercel CDN + Middleware<br/>tenant resolve, rate limit]
  end
  subgraph Auth
    FB[Firebase Auth<br/>ID Token + Custom Claims]
  end
  subgraph Backend
    API[Next.js Route Handlers<br/>BFF / Domain modules]
    EF[Supabase Edge Functions<br/>webhooks, cron, AI worker]
    Q[(Job Queue<br/>pgmq / Upstash QStash)]
    RD[(Redis Cache<br/>rate limits, sessions)]
  end
  subgraph Data
    PG[(Supabase Postgres<br/>RLS by tenant_id)]
    ST[(Supabase Storage)]
    RT[Realtime]
  end
  subgraph External
    PAY[bKash / Nagad / SSLCommerz]
    SMS[SMS / WhatsApp Provider]
    LLM[Claude API]
  end
  W --> CDN --> API
  P --> CDN
  W --> FB
  API -->|verify JWT| FB
  API --> PG
  API --> RD
  API --> Q --> EF
  EF --> SMS
  EF --> LLM
  PAY -->|webhook| EF --> PG
  PG --> RT --> W
  API --> ST
```

### Logical services (modules now, separable later)

| Module                  | Runs as                            | Notes                                     |
|-------------------------|------------------------------------|-------------------------------------------|
| Identity and Tenant     | Next.js + Firebase                 | Claims: `tenant_id`, `role`, `branch_ids` |
| Members and Memberships | Next.js modules                    | Core CRUD via Supabase                    |
| Billing and Payments    | Next.js + Edge Function (webhooks) | Idempotent, signed webhooks               |
| Attendance              | Next.js + offline sync endpoint    | Batch sync, conflict rules                |
| Notifications           | Edge Function + queue              | Retry, delivery logs, cost metering       |
| AI Meal Planner         | Isolated Edge Function/worker      | Rate-limited, cost tracked per tenant     |
| Analytics               | Postgres views/materialized views  | Refreshed by cron                         |

---

## 4. Auth and security design

**Firebase Auth + Supabase:** Configure Supabase's third-party auth to accept Firebase ID tokens. RLS policies then read claims from the token.

```mermaid
sequenceDiagram
  participant U as User
  participant FB as Firebase Auth
  participant AD as Firebase Admin (server)
  participant API as Next.js API
  participant DB as Supabase Postgres (RLS)
  U->>FB: Login (phone OTP / email)
  FB-->>U: ID Token (JWT)
  U->>API: Request + Bearer token
  API->>FB: Verify token (Admin SDK)
  API->>DB: Query with user's JWT
  DB->>DB: RLS checks tenant_id + role claims
  DB-->>API: Only permitted rows
  API-->>U: Response
  Note over AD,FB: On onboarding/role change, Admin SDK sets custom claims, then refresh token
```

### Security checklist

- **RLS on every tenant table:** `tenant_id = auth.jwt() ->> 'tenant_id'`. Write automated tests that prove tenant A cannot read tenant B.
- Never expose the Supabase **service role key** to the browser; use it only in server code and Edge Functions.
- Short-lived ID tokens (1h), refresh tokens revoked on role change or staff removal.
- Owner/finance actions need recent re-auth or 2FA.
- Validate all input with **Zod** on the server; parameterized queries only.
- Payment webhooks: verify signature, store `event_id` for **idempotency**, never trust client-reported payment status.
- Encrypt sensitive fields (national ID, medical notes); Supabase encrypts at rest, and TLS is in transit.
- **Audit log** (append-only) for money, role, and data-export actions.
- Rate limiting by IP + user + tenant (Redis); CAPTCHA on OTP endpoints; CSP and security headers.
- Daily backups + point-in-time recovery; quarterly restore drill.
- Consent capture for health data; data export/delete endpoints.

---

## 5. Performance and reliability

| Goal                        | Technique                                                                            |
|-----------------------------|--------------------------------------------------------------------------------------|
| Fast dashboards             | Materialized views, indexes on `(tenant_id, created_at)`, Redis cache with short TTL |
| Smooth UI                   | Server Components, streaming, optimistic updates, skeleton loaders, TanStack Query   |
| Live feel                   | Supabase Realtime for check-ins, payments, dashboard counters                        |
| Heavy work off request path | Queue: reports, bulk SMS, invoice generation, AI calls                               |
| Failures                    | Retries with exponential backoff, dead-letter queue, idempotency keys                |
| Power/internet cuts         | PWA service worker, IndexedDB queue for check-ins, sync on reconnect                 |
| Observability               | Sentry, structured logs with `tenant_id` and `request_id`, uptime checks, alerts     |
| Cost control                | Per-tenant metering for SMS and AI tokens tied to plan limits                        |

### Payment workflow

```mermaid
sequenceDiagram
  participant M as Member/Staff
  participant API as Next.js API
  participant PG as Payment Gateway
  participant EF as Webhook Function
  participant DB as Postgres
  participant N as Notification Queue
  M->>API: Pay invoice #123
  API->>DB: Create payment (status=pending, idempotency_key)
  API->>PG: Create payment session
  PG-->>M: Checkout (bKash/Nagad)
  PG->>EF: Webhook (signed)
  EF->>EF: Verify signature, check event_id unused
  EF->>DB: Mark paid, update invoice, extend membership (transaction)
  EF->>N: Enqueue receipt SMS
  DB-->>M: Realtime: "Payment successful"
```

### Offline check-in workflow

```mermaid
flowchart LR
  A[Scan QR] --> B{Online?}
  B -- Yes --> C[Verify membership status] --> D[Record check-in]
  B -- No --> E[Check cached active-member list] --> F[Save to IndexedDB queue]
  F --> G[Reconnect] --> H[Batch sync endpoint]
  H --> I{Conflict?<br/>expired, duplicate}
  I -- No --> D
  I -- Yes --> J[Flag for staff review]
```

---

## 6. Database design

### Conventions

- UUID primary keys, `tenant_id` on every tenant-owned table, `created_at`, `updated_at`, `deleted_at` (soft delete), money stored as integer **poisha** or `numeric(12,2)`.
- Enums for statuses; indexes on `(tenant_id, foreign_key)`.

### Table groups

| Group                  | Tables                                                                                                       |
|------------------------|--------------------------------------------------------------------------------------------------------------|
| Platform               | `tenants`, `saas_plans`, `tenant_subscriptions`, `feature_flags`, `usage_meters`                             |
| Identity               | `users`, `roles`, `user_roles`, `staff_profiles`, `branches`                                                 |
| Members                | `members`, `member_health_profiles`, `member_documents`, `member_measurements`                               |
| Membership and billing | `membership_plans`, `memberships`, `invoices`, `invoice_items`, `payments`, `refunds`, `discounts`           |
| Attendance             | `attendance_logs`, `access_devices`                                                                          |
| Scheduling             | `classes`, `class_sessions`, `bookings`, `pt_sessions`                                                       |
| Workouts               | `exercises`, `workout_plans`, `workout_plan_items`, `workout_logs`                                           |
| Nutrition/AI           | `foods`, `food_nutrients`, `meal_plans`, `meal_plan_days`, `meals`, `meal_items`, `meal_logs`, `ai_requests` |
| CRM                    | `leads`, `lead_activities`                                                                                   |
| Comms                  | `notification_templates`, `notifications`, `campaigns`                                                       |
| System                 | `audit_logs`, `webhook_events`, `jobs`                                                                       |

### ER diagram (core)

```mermaid
erDiagram
  TENANTS ||--o{ BRANCHES : has
  TENANTS ||--o{ USERS : has
  TENANTS ||--|| TENANT_SUBSCRIPTIONS : subscribes
  SAAS_PLANS ||--o{ TENANT_SUBSCRIPTIONS : defines
  USERS ||--o{ USER_ROLES : assigned
  ROLES ||--o{ USER_ROLES : grants
  USERS ||--o| STAFF_PROFILES : is
  USERS ||--o| MEMBERS : is
  BRANCHES ||--o{ MEMBERS : home_of
  MEMBERS ||--o| MEMBER_HEALTH_PROFILES : has
  MEMBERS ||--o{ MEMBER_MEASUREMENTS : logs
  MEMBERSHIP_PLANS ||--o{ MEMBERSHIPS : template
  MEMBERS ||--o{ MEMBERSHIPS : owns
  MEMBERS ||--o{ INVOICES : billed
  MEMBERSHIPS ||--o{ INVOICES : generates
  INVOICES ||--o{ INVOICE_ITEMS : contains
  INVOICES ||--o{ PAYMENTS : paid_by
  PAYMENTS ||--o{ REFUNDS : refunded
  MEMBERS ||--o{ ATTENDANCE_LOGS : checks_in
  BRANCHES ||--o{ ATTENDANCE_LOGS : at
  CLASSES ||--o{ CLASS_SESSIONS : schedules
  CLASS_SESSIONS ||--o{ BOOKINGS : receives
  MEMBERS ||--o{ BOOKINGS : makes
  STAFF_PROFILES ||--o{ CLASS_SESSIONS : trains
  STAFF_PROFILES ||--o{ PT_SESSIONS : delivers
  MEMBERS ||--o{ PT_SESSIONS : attends
  MEMBERS ||--o{ WORKOUT_PLANS : follows
  WORKOUT_PLANS ||--o{ WORKOUT_PLAN_ITEMS : includes
  EXERCISES ||--o{ WORKOUT_PLAN_ITEMS : used_in
  MEMBERS ||--o{ MEAL_PLANS : receives
  MEAL_PLANS ||--o{ MEAL_PLAN_DAYS : spans
  MEAL_PLAN_DAYS ||--o{ MEALS : contains
  MEALS ||--o{ MEAL_ITEMS : lists
  FOODS ||--o{ MEAL_ITEMS : referenced
  FOODS ||--o{ FOOD_NUTRIENTS : has
  MEALS ||--o{ MEAL_LOGS : logged
  TENANTS ||--o{ AI_REQUESTS : meters
  TENANTS ||--o{ NOTIFICATIONS : sends
  TENANTS ||--o{ AUDIT_LOGS : records
  TENANTS ||--o{ LEADS : tracks

  TENANTS {
    uuid id PK
    text name
    text subdomain
    jsonb branding
    text status
  }
  MEMBERS {
    uuid id PK
    uuid tenant_id FK
    uuid branch_id FK
    text full_name
    text phone
    date dob
    text qr_token
    text status
  }
  MEMBERSHIPS {
    uuid id PK
    uuid tenant_id FK
    uuid member_id FK
    uuid plan_id FK
    date starts_on
    date ends_on
    text status
    int freeze_days_used
  }
  INVOICES {
    uuid id PK
    uuid tenant_id FK
    uuid member_id FK
    numeric total
    numeric amount_due
    text status
    date due_date
  }
  PAYMENTS {
    uuid id PK
    uuid tenant_id FK
    uuid invoice_id FK
    numeric amount
    text method
    text gateway_txn_id
    text idempotency_key
    text status
  }
  ATTENDANCE_LOGS {
    uuid id PK
    uuid tenant_id FK
    uuid member_id FK
    timestamptz checked_in_at
    text source
    bool synced_offline
  }
  MEAL_PLANS {
    uuid id PK
    uuid tenant_id FK
    uuid member_id FK
    int target_kcal
    jsonb macros
    text status
    uuid approved_by FK
  }
  FOODS {
    uuid id PK
    uuid tenant_id FK
    text name_en
    text name_bn
    numeric kcal_per_100g
    numeric est_cost_bdt
  }
```

### RLS pattern (example)

```sql
alter table members enable row level security;

create policy tenant_isolation on members
  using (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

create policy member_self_read on members for select
  using (user_id = (auth.jwt() ->> 'sub')::text
         or (auth.jwt() ->> 'role') in ('owner','manager','staff'));
```

### Indexing essentials

`members(tenant_id, phone)`, `memberships(tenant_id, ends_on, status)`, `invoices(tenant_id, status, due_date)`, `attendance_logs(tenant_id, checked_in_at desc)`, unique `payments(idempotency_key)`, unique `webhook_events(provider, event_id)`.

---

## 7. AI meal planner design

```mermaid
flowchart LR
  A[Member profile + goal] --> B[Deterministic engine<br/>BMR/TDEE, kcal, macros]
  B --> C[Constraint builder<br/>allergies, halal, budget, cuisine]
  C --> D[LLM: pick and arrange foods<br/>structured JSON]
  D --> E[Validator<br/>schema + food DB lookup + recompute macros]
  E -->|fail| D
  E -->|pass| F{Medical flag?}
  F -- Yes --> G[Nutritionist approval]
  F -- No --> H[Publish plan]
  G --> H
  H --> I[Meal logging, adherence, weekly adapt]
```

Rules: LLM never computes calories; all numbers come from your `foods` table. Enforce minimum calorie floors, block plans for flagged conditions (pregnancy, diabetes, eating disorders) without professional review, log every request in `ai_requests` for cost metering.

---

## 8. UI/UX and product design plan

*Working as designer and product lead together: the goal is calm, fast, and trustworthy, since owners check numbers and members check plans on their phones daily.*

### Users and top jobs

| User       | Top job                           | Success metric                        |
|------------|-----------------------------------|---------------------------------------|
| Owner      | "How is my business today?"       | Answered in under 5 seconds on mobile |
| Front desk | Check in and collect payment fast | Under 3 taps per member               |
| Trainer    | See assigned members and plans    | Zero searching                        |
| Member     | Check plan, pay, book, log meals  | One-thumb usable                      |

### Design principles

1.  **Numbers first:** the most important metric is the largest thing on screen.
2.  **One primary action per screen.**
3.  **Instant feedback:** optimistic updates, skeletons, toasts, no blank states.
4.  **Mobile-first, then desktop density.**
5.  **Bangla and English** everywhere; test long Bangla strings.
6.  **Tenant branding** applied via CSS variables.

### Design system

- **Type:** Inter (Latin) + Noto Sans Bengali; scale 12/14/16/20/24/32.
- **Color tokens:** `--brand` (tenant-set), neutral slate scale, semantic `success/warning/danger/info`. Default brand: deep indigo with an energetic accent. Dark mode from day one.
- **Spacing:** 4px grid; radius 12px cards, 8px inputs; soft shadows, 1px borders.
- **Components (shadcn/ui):** Button, Input, Select, DataTable (sortable, filter, bulk actions), Command palette (Ctrl+K), Sheet/Drawer, Dialog, Tabs, Badge, Stat card, Chart (Recharts), Calendar, Toast, Skeleton, Empty state.
- **Motion:** 150 to 200ms ease-out; no decorative animation.
- **Accessibility:** WCAG AA contrast, keyboard navigation, focus rings, 44px touch targets.

### Information architecture

```mermaid
flowchart TB
  subgraph Admin
    A1[Dashboard] --- A2[Members] --- A3[Billing] --- A4[Attendance]
    A5[Classes] --- A6[Staff] --- A7[Nutrition] --- A8[Reports] --- A9[Settings]
  end
  subgraph Member
    M1[Home] --- M2[My Plan] --- M3[Book] --- M4[Meals] --- M5[Progress] --- M6[Profile]
  end
  subgraph Platform
    P1[Tenants] --- P2[Plans] --- P3[Usage] --- P4[Support]
  end
```

### Key screens (design these first)

1.  **Owner dashboard:** revenue today/month, dues, expiring in 7 days, live check-ins, churn-risk list, quick actions.
2.  **Members list:** search, filters (status, branch, expiring), bulk SMS reminder, row status badges.
3.  **Member profile:** header (photo, status, QR), tabs: Overview, Payments, Attendance, Plans, Notes.
4.  **Front-desk check-in:** big scan area, instant green/red result with dues warning, "collect payment" button.
5.  **Invoice and payment:** amount due, method picker (bKash, Nagad, cash), receipt share.
6.  **Member mobile home:** membership status card, next class, today's meals, streak.
7.  **Meal planner:** goal summary, day tabs, meal cards with kcal/macros/cost, swap and log buttons.
8.  **Onboarding wizard:** gym details, branding, import CSV, invite staff.

### Frontend structure

    /app
      /(marketing)
      /(auth)/login
      /(admin)/[tenant]/dashboard|members|billing|...
      /(member)/home|plan|meals|...
      /(platform)/tenants|plans|usage
      /api/(payments|webhooks|checkin|ai)
    /modules   (members, billing, attendance, nutrition: each with schema, service, queries)
    /components/ui  (design system)
    /lib       (supabase, firebase, rbac, logger)
    /middleware.ts (tenant resolve, auth guard, rate limit)

---

## 9. Step-by-step delivery plan

**Phase 0: Discovery (Weeks 1-2)**

1.  Interview 10-15 gym owners; finalize pain-point list.
2.  Lock MVP scope, pricing hypotheses, SMS/payment provider choices.
3.  Start payment gateway and SMS sender registration (long lead time).

**Phase 1: Foundation (Weeks 3-5)** 4. Repo, CI/CD, environments (dev/staging/prod), lint, tests, Sentry. 5. Supabase schema migrations, RLS policies, seed data, tenant isolation tests. 6. Firebase Auth + custom claims + RBAC middleware. 7. Design system and tokens in Tailwind; build component library.

**Phase 2: Core MVP (Weeks 6-11)** 8. Tenant onboarding and branding. 9. Members CRUD + CSV import. 10. Plans, memberships, invoices, dues. 11. Payments (bKash/Nagad) with webhooks and idempotency. 12. QR check-in + offline PWA sync. 13. Notification queue: renewal and due reminders in Bangla. 14. Owner dashboard and member portal.

**Phase 3: Pilot (Weeks 12-16)** 15. Free pilot with 2-3 gyms; migrate their data; collect metrics. 16. Fix bugs, refine UX from observed usage, write case studies.

**Phase 4: Differentiators (Weeks 17-24)** 17. Bangladeshi food database + AI meal planner with approval flow. 18. Scheduling, trainer commissions, workout plans. 19. Churn-risk and upsell engine; SaaS billing and feature flags.

**Phase 5: Scale** 20. White-label app, public API, wearables, load testing, security audit, extract services that need independent scaling.

---

## 10. Definition of done for each feature

- RLS policy + isolation test
- Zod validation + error states
- Audit log for sensitive actions
- Loading, empty, and error UI
- Bangla and English strings
- Analytics event and Sentry coverage
- Documented API and migration

---

## 11. Key risks

| Risk                              | Mitigation                                                       |
|-----------------------------------|------------------------------------------------------------------|
| Tenant data leak                  | RLS + automated cross-tenant tests, security review              |
| Gateway onboarding delays         | Start in week 1; support manual entry meanwhile                  |
| SMS cost overruns                 | Metering, plan limits, credit packs                              |
| Firebase/Supabase claim sync bugs | Central claims service, token refresh on role change             |
| Scope creep                       | Ship Phase 2 only before pilot                                   |
| Health-data liability             | Consent, professional approval, disclaimers, conservative limits |
