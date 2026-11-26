# PayVibe — Digital Banking Management System

A modular, role-based digital banking management dashboard built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **HeroUI**, **Redux Toolkit**, **RTK Query**, **Auth.js / NextAuth**, and **MongoDB**. Designed to support administrative control, bank staff operations, and customer banking workflows with strict server-side authorization and transaction integrity.

---

## Project Overview

PayVibe provides a multi-role banking workspace where:
- **Administrators** oversee bank liquidity, customer profiles, KYC approvals, bank accounts, limits/freeze states, staff accounts, loan approvals/disbursements, and analytics charts.
- **Bank Staff** assist with customer onboarding/accounts, review deposit/withdrawal requests, inspect/flag transactions, and review/forward loan applications with internal notes.
- **Customers** manage their accounts, submit deposit/withdrawal requests, transfer funds, view transaction history, apply for loans, and pay monthly installments within the permitted repayment window.

---

## Application Features

- **Role-Based Dashboards & Navigation:** Dedicated views for Admin (`/dashboard/admin`), Bank Staff (`/dashboard/staff`), and Customer (`/dashboard/customer`).
- **Customer & Account Administration:** Customer registration, KYC verification, customer status updates (`Active`, `Inactive`, `Flagged`), bank account creation, account table view with dynamic details routing (`/accounts/[id]`), freeze/unfreeze controls, and transaction limit configuration.
- **Transaction & Request Workflows:** Support for `Deposit`, `Withdrawal`, `Fund Transfer`, `Loan Disbursement`, and `Loan Repayment` transactions, plus deposit/withdrawal approval workflows.
- **Loan Management & Repayment:** Loan application submission, staff review & internal notes, admin approval/rejection with disbursement recording, installment schedule & repayment history modal, and a monthly repayment window (1st–10th of each month).
- **Data Visualization:** Interactive charts built with **Recharts** backed by real application data.

---

## User Roles & Permissions

| Capability / Area | Admin | Bank Staff | Customer |
| :--- | :---: | :---: | :---: |
| Admin Dashboard & Analytics | Full Access | Restricted | Denied |
| Staff Dashboard & Operations | Full Access | Full Access | Denied |
| Customer Dashboard & Own Finances | Restricted | Restricted | Own Data Only |
| Approve Customer KYC & Status | Yes | View / Assist Only | No |
| Create / Freeze / Edit Account Limits | Yes | Freeze / Assist | No |
| Manage Bank Staff Accounts | Yes | Denied | Denied |
| Review / Flag Transactions | Yes | Yes | Own Transactions Only |
| Review & Add Notes on Loans | Yes | Yes | No |
| Approve / Reject & Disburse Loans | Yes | Denied | No |
| Apply for Loans & Pay Installments | No | No | Own Loans Only |

---

## Redux Toolkit Architecture

State management is organized modularly under `src/redux/` with separate feature folders and centralized store configuration:

```text
src/redux/
├── store.ts
├── rootReducer.ts
├── hooks.ts
├── provider.tsx
├── baseApi.ts
└── features/
    ├── auth/
    ├── account/
    ├── customer/
    ├── transaction/
    ├── request/
    └── loan/