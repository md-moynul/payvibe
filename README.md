# 💳 PayVibe — Enterprise Digital Banking & Financial Management Platform

<p align="center">
  <img src="https://raw.githubusercontent.com/md-moynul/payvibe/main/public/favicon.ico" alt="PayVibe Logo" width="64" height="64" />
</p>

<p align="center">
  <strong>A modern, enterprise-grade, role-based digital banking platform built with Next.js 16 (App Router), TypeScript, HeroUI, Redux Toolkit, Auth.js (NextAuth v5), and MongoDB.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.4.6-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.3.0-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/HeroUI-3.2-purple?style=for-the-badge" alt="HeroUI" />
  <img src="https://img.shields.io/badge/Redux_Toolkit-RTK_Query-764ABC?style=for-the-badge&logo=redux" alt="Redux Toolkit" />
  <img src="https://img.shields.io/badge/MongoDB-6.x-green?style=for-the-badge&logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Auth.js-v5_Beta-orange?style=for-the-badge" alt="Auth.js" />
</p>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Key Features by Role](#-key-features-by-role)
  - [👑 Administrator Portal](#-administrator-portal)
  - [🏦 Bank Staff Operations Portal](#-bank-staff-operations-portal)
  - [👤 Customer Banking Portal](#-customer-banking-portal)
- [Security & Access Control Architecture](#-security--access-control-architecture)
  - [Next.js 16 Proxy Route Protection](#nextjs-16-proxy-route-protection)
  - [Role Normalization & Defense-in-Depth](#role-normalization--defense-in-depth)
  - [Dedicated 403 Forbidden Unauthorized Page](#dedicated-403-forbidden-unauthorized-page)
  - [Server-Side API Guards & Ownership Verification](#server-side-api-guards--ownership-verification)
- [Role Access Matrix](#-role-access-matrix)
- [Tech Stack](#-tech-stack)
- [Project Architecture & Directory Structure](#-project-architecture--directory-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Running the App](#running-the-app)
- [Available Scripts](#-available-scripts)
- [API Endpoints Overview](#-api-endpoints-overview)
- [License](#-license)


---

## 🌟 Overview

**PayVibe** is a high-performance, full-stack digital banking application engineered to handle day-to-day banking workflows, liquidity oversight, fund transfers, transaction ledgers, loan origination, and customer verification. 

It provides strict separation of duties between **Bank Administrators**, **Staff Officers**, and **Banking Customers** through hardware-isolated middleware route guards, cryptographically secure PIN authentication, and rigorous ownership validation on all financial mutations.

---

## 🎯 Key Features by Role

### 👑 Administrator Portal (`/dashboard/admin`)
- **Executive Analytics Dashboard:** Real-time visibility into overall bank liquidity, customer metrics, transaction velocity, and active loan volumes with interactive Recharts data visualizations.
- **Customer Directory & KYC Management:** Review and approve customer KYC documents, manage account verification statuses (`Active`, `Inactive`, `Flagged`), and inspect individual customer portfolios.
- **Bank Accounts Management:** Unified, sortable table view of all accounts (`Savings`, `Current`, `Business`). Set daily limits, single transaction maximums, and execute instantaneous **Freeze / Unfreeze** actions.
- **Bank Staff Administration:** Provision new staff credentials, assign operational permissions, and audit staff activities.
- **Loan Appraisal & Disbursement:** Review loan risk profiles, inspect customer repayment track records, and approve or reject loan applications with automatic balance disbursement.
- **Deposit & Withdrawal Processing:** Final authorization of high-value cash deposits and withdrawal requests.

### 🏦 Bank Staff Operations Portal (`/dashboard/staff`)
- **Customer Desk Operations:** Search and view customer information, assist in account setups, and review KYC verification queues.
- **Transaction Auditing:** Live ledger auditing, flagging suspicious transaction activity, and providing receipt inspection.
- **Deposit & Withdrawal Desk:** Review customer deposit slips and withdrawal tickets with instant approval/rejection workflows and rejection reason notes.
- **Loan Risk Appraisal (`/dashboard/loans/[loanId]/applicant`):** Deep inspection of applicant employment, income stability, existing account standing, and previous loan repayment timeliness (`Timely Paid`, `Late / Missed Installment`).

### 👤 Customer Banking Portal (`/dashboard/customer`)
- **Personalized Financial Dashboard:** Dynamic cards displaying available balance, cumulative deposits, cumulative withdrawals, and active loan balances.
- **My Bank Accounts (`/dashboard/customer/account`):** View account numbers, account types, balances, currency, and real-time transaction limit status.
- **Instant Fund Transfers (`/dashboard/customer/transfers`):** Send funds to any PayVibe account with multi-digit PIN verification, account freeze checks, daily limit tracking, and instant recipient balance credit.
- **Live Transaction Ledger (`/dashboard/customer/transactions`):** Full transaction history with instant filtering by Transaction ID, transaction type (`Transfer`, `Deposit`, `Withdrawal`, `Loan Disbursement`, `Loan Repayment`), date range, and downloadable/printable receipts.
- **Deposit & Withdrawal Requests (`/dashboard/customer/deposits-withdrawals`):** Submit digital deposit slips and withdrawal requests with real-time status updates (`Pending`, `Approved`, `Rejected`).
- **Loans & Credit Facility (`/dashboard/customer/loans`):** Apply for personal and business loans with transparent interest calculation, track approved loans, and repay monthly installments directly from active bank accounts.

---

## 🛡️ Security & Access Control Architecture

PayVibe adheres to a zero-trust, multi-layered security model:

```
[ Incoming Request ]
         │
         ▼
[ Next.js 16 Proxy Guard (src/proxy.ts) ] ── (Unauthenticated) ──► Redirect to /login
         │
         ├─► [ Normalized Role Evaluator (src/lib/role.helper.ts) ]
         │         │
         │         ├─► (Authorized Role) ────────► Allowed to Page / Route
         │         └─► (Cross-Role / Forbidden) ──► Redirect to /unauthorized?from=...
         ▼
[ Server Component / Layout Defense ]
         │
         ▼
[ Protected REST API Handlers (src/app/api/*) ]
         │
         ├─► checkRole / checkAdminRole / checkCustomerRole
         └─► verifyResourceOwnership (Strict customer isolation)
```

### Next.js 16 Proxy Route Protection
Route protection is implemented in `src/proxy.ts` (Next.js 16's official replacement for deprecated `middleware.ts`), running on Node.js runtime before routes are rendered:
- Automatically validates JWT sessions via Auth.js v5.
- Intercepts unauthorized cross-role route visits (e.g. customer attempting `/dashboard/admin/*`) and immediately redirects.
- Seamlessly redirects generic `/dashboard` access to each role's dedicated home.

### Role Normalization & Defense-in-Depth
Roles are normalized case-insensitively using `normalizeUserRole()`:
- Handles case variations (`ADMIN`, `admin`, `Admin`) and string variations (`bank staff`, `bank-staff`, `Staff`, `USER`, `customer`).
- **Mathematical Loop Prevention:** All redirect destinations are guaranteed to resolve strictly within the authenticated user's allowed domain, preventing redirect loops.

### Dedicated 403 Forbidden Unauthorized Page (`/unauthorized`)
- Tailored banking-grade 403 error page designed with HeroUI and Lucide icons.
- Displays current user credentials, assigned role chip, and the exact blocked route (`?from=...`).
- Direct action controls: **Return to My Dashboard**, **Go Back**, and **Sign in with another account**.

### Server-Side API Guards & Ownership Verification
- Every protected endpoint in `src/app/api/` enforces server-side role validation via `checkRole()`, `checkAdminRole()`, or `checkCustomerRole()`.
- Customer ownership checks ensure customers can **never** query or mutate bank accounts, transactions, or loans belonging to other users.

---

## 📊 Role Access Matrix

| Feature / Route Path | Admin | Bank Staff | Customer | Guest |
| :--- | :---: | :---: | :---: | :---: |
| `/dashboard/admin/*` | ✅ Full Access | ⛔ 403 Redirect | ⛔ 403 Redirect | 🔒 `/login` |
| `/dashboard/staff/*` | ⛔ 403 Redirect | ✅ Full Access | ⛔ 403 Redirect | 🔒 `/login` |
| `/dashboard/customer/*` | ⛔ 403 Redirect | ⛔ 403 Redirect | ✅ Own Data Only | 🔒 `/login` |
| `/dashboard/loans/*` (Credit Review) | ✅ Full Access | ✅ Full Access | ⛔ 403 Redirect | 🔒 `/login` |
| `/unauthorized` | ✅ Allowed | ✅ Allowed | ✅ Allowed | ✅ Allowed |
| `/dashboard` (Root) | 🔀 `/dashboard/admin` | 🔀 `/dashboard/staff` | 🔀 `/dashboard/customer` | 🔒 `/login` |
| Approve / Reject Loans | ✅ Yes | ❌ No | ❌ No | ❌ No |
| KYC Document Verification | ✅ Yes | 👁️ View Only | ❌ No | ❌ No |
| Freeze / Unfreeze Accounts | ✅ Yes | ✅ Yes | ❌ No | ❌ No |
| Fund Transfers with PIN | ❌ N/A | ❌ N/A | ✅ Own Account | ❌ No |
| Apply for Loans & Repay | ❌ N/A | ❌ N/A | ✅ Own Account | ❌ No |

---

## 💻 Tech Stack

### Core Framework & Language
- **[Next.js 16](https://nextjs.org/)** — App Router, Server Components, Route Handlers, Turbopack, and Next.js 16 `proxy.ts`.
- **[React 19](https://react.dev/)** — Modern React primitives, Actions, and Hooks.
- **[TypeScript 5](https://www.typescriptlang.org/)** — Strict type safety across UI, API routes, and database layers.

### UI & Styling
- **[HeroUI](https://heroui.com/)** (`@heroui/react`, `@heroui/styles`) — Modern, accessible, banking-ready React component system.
- **[Tailwind CSS v4](https://tailwindcss.com/)** — Utility-first styling with modern token support.
- **[Lucide React](https://lucide.dev/)** — Consistent icon ecosystem.
- **[Recharts](https://recharts.org/)** — Financial charts and volume metric visualizations.

### State Management & Data Fetching
- **[Redux Toolkit](https://redux-toolkit.js.org/)** — Centralized client-side state management.
- **[RTK Query](https://redux-toolkit.js.org/rtk-query/overview)** — Efficient API querying, caching, cache invalidation, and optimistic UI updates.

### Authentication & Database
- **[Auth.js (NextAuth v5 Beta)](https://authjs.dev/)** — Session management with JWT strategy and credentials provider.
- **[Bcrypt.js](https://github.com/dcodeIO/bcrypt.js)** — Strong cryptographic hashing for user passwords and transaction PINs.
- **[MongoDB Node Driver](https://www.mongodb.com/)** — High-throughput document database connectivity.

---

## 📂 Project Architecture & Directory Structure

```text
payvibe/
├── src/
│   ├── app/                                 # Next.js App Router
│   │   ├── api/                             # REST API Route Handlers
│   │   │   ├── accounts/                    # Bank accounts API (CRUD, freeze, limits)
│   │   │   ├── auth/                        # NextAuth handlers & customer registration
│   │   │   ├── customers/                   # Customer directory & KYC review
│   │   │   ├── loans/                       # Loan applications, appraisal & repayment
│   │   │   ├── requests/                    # Deposit & withdrawal request management
│   │   │   ├── staff/                       # Staff provisioning & administration
│   │   │   └── transactions/                # Ledger, receipt & transfer processing
│   │   ├── dashboard/                       # Protected Multi-Role Dashboards
│   │   │   ├── admin/                       # Administrator views & management
│   │   │   ├── staff/                       # Bank staff desk operations
│   │   │   ├── customer/                    # Customer banking, accounts & transfers
│   │   │   ├── loans/                       # Internal applicant risk evaluation
│   │   │   ├── layout.tsx                   # Dashboard sidebar & layout wrapper
│   │   │   └── page.tsx                     # Smart role-redirect entry point
│   │   ├── login/                           # Authentication sign-in portal
│   │   ├── unauthorized/                    # Dedicated 403 Forbidden page
│   │   ├── layout.tsx                       # Root layout & providers
│   │   └── not-found.tsx                    # Custom 404 Error page
│   ├── components/                          # Modular Reusable React Components
│   │   ├── account/                         # AccountsTable, ActionButtons, Modal
│   │   ├── customer/                        # CustomerTable, KYC review modals
│   │   ├── dashboard/                       # StatsCards, Charts, Overview widgets
│   │   ├── loan/                            # LoanCards, ApplicationForms, Appraisal
│   │   ├── shared/                          # DashboardSidebar, Navbar, Receipts
│   │   └── transaction/                     # TransactionTable, TransferModal
│   ├── lib/                                 # Core Server & Utility Libraries
│   │   ├── auth.ts                          # NextAuth configuration & callbacks
│   │   ├── checkRole.ts                     # Server-side API role & ownership guards
│   │   ├── db.ts                            # MongoDB connection pool singleton
│   │   ├── loan.helper.ts                   # Financial calculations & interest rates
│   │   ├── role.helper.ts                   # Role normalization & route access logic
│   │   └── proxy.ts                         # Proxy export bridge
│   ├── proxy.ts                             # Next.js 16 Edge / Proxy Route Guard
│   ├── redux/                               # Redux Store & RTK Query
│   │   ├── store.ts                         # Store configuration
│   │   ├── rootReducer.ts                   # Combined feature reducers
│   │   ├── baseApi.ts                       # RTK Query base API definition
│   │   └── features/                        # Feature slices & endpoints
│   │       ├── account/                     # Account endpoints & state
│   │       ├── auth/                        # Session state & selectors
│   │       ├── customer/                    # Customer management queries
│   │       ├── loan/                        # Loan queries & mutations
│   │       ├── request/                     # Deposit/withdraw request hooks
│   │       └── transaction/                 # Transaction ledger queries
│   └── types/                               # TypeScript Type Definitions
│       ├── account.type.ts
│       ├── auth.type.ts
│       ├── customer.type.ts
│       ├── loan.type.ts
│       └── transaction.type.ts
├── public/                                  # Static assets & brand graphics
├── .env.example                             # Environment template
├── package.json                             # Dependencies & scripts
└── tsconfig.json                            # TypeScript configuration
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your environment:
- **Node.js**: `v20.x` or higher (tested with `v24.x`)
- **npm** or **pnpm**
- **MongoDB**: A running MongoDB instance locally or on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/md-moynul/payvibe.git
   cd payvibe
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

### Environment Configuration

Create a `.env.local` or `.env` file in the root directory:

```env
# NextAuth / Auth.js Configuration
AUTH_SECRET=your_super_secret_auth_token_here_generate_with_openssl_rand_base64_32

# MongoDB Database Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=payvibe_db

# Environment
NODE_ENV=development
```

> **Tip:** You can generate a secure `AUTH_SECRET` by running:
> ```bash
> openssl rand -base64 32
> ```

### Running the App

Start the development server with Turbopack:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to experience PayVibe.

---

## 🛠️ Available Scripts

| Script | Command | Purpose |
| :--- | :--- | :--- |
| `npm run dev` | `next dev` | Starts local development server with Turbopack |
| `npm run build` | `next build` | Compiles optimized production build |
| `npm run start` | `next start` | Runs the production build server |
| `npm run lint` | `eslint` | Runs ESLint to inspect code quality and conventions |
| `npx tsc --noEmit` | `tsc --noEmit` | Performs comprehensive TypeScript type-checking |

---

## 🔌 API Endpoints Overview

| Method | Endpoint | Description | Protected Roles |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new customer account | Public |
| `GET` | `/api/accounts` | Retrieve bank accounts (owned or all) | Authenticated |
| `GET` | `/api/accounts/[id]` | Inspect specific account details | Authenticated + Ownership |
| `PATCH` | `/api/accounts/[id]` | Freeze / Unfreeze / Update daily limits | Admin / Bank Staff |
| `GET` | `/api/customers` | Query customer directory | Admin / Bank Staff |
| `PATCH` | `/api/customers/[id]/kyc` | Approve / Reject KYC verification | Admin Only |
| `GET` | `/api/staff` | List bank staff officers | Admin Only |
| `POST` | `/api/staff` | Provision a new bank staff member | Admin Only |
| `GET` | `/api/transactions` | Query ledger transactions with filters | Authenticated + Ownership |
| `POST` | `/api/transactions/transfer`| Execute instant fund transfer with PIN | Customer |
| `GET` | `/api/loans` | List loan applications (own or all) | Authenticated + Ownership |
| `PATCH` | `/api/loans/[id]` | Approve, reject, or annotate loans | Admin / Bank Staff |
| `POST` | `/api/loans/[id]/repay` | Repay monthly loan installment | Customer (Owner) |
| `GET` | `/api/requests` | List deposit & withdrawal requests | Authenticated + Ownership |
| `PATCH` | `/api/requests/[id]` | Approve / Reject deposit/withdrawal ticket | Admin / Bank Staff |

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<p align="center">
  Crafted with precision for modern, resilient digital banking.
</p>
