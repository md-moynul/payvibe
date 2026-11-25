import React from "react";
import Link from "next/link";
import { Chip } from "@heroui/react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border bg-background/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl">
              <span className="text-primary font-bold">PayVibe</span>
              <Chip size="sm" variant="soft" color="accent">
                Bank
              </Chip>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Empowering individuals and modern businesses with seamless money transfers,
              smart multi-account control, and bank-grade encryption.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Systems Operational • 99.99% Uptime</span>
            </div>
          </div>

          {/* Column 1: Products */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Products
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link
                  href="/dashboard/customer/accounts"
                  className="hover:text-primary transition-colors"
                >
                  Savings Accounts
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/customer/accounts"
                  className="hover:text-primary transition-colors"
                >
                  Current Accounts
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/customer/accounts"
                  className="hover:text-primary transition-colors"
                >
                  Business Banking
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/customer/transfers"
                  className="hover:text-primary transition-colors"
                >
                  Instant Transfers
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/customer/loans"
                  className="hover:text-primary transition-colors"
                >
                  Personal & Business Loans
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Dashboard & Portal */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Portals
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link
                  href="/dashboard/customer"
                  className="hover:text-primary transition-colors"
                >
                  Customer Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/staff"
                  className="hover:text-primary transition-colors"
                >
                  Bank Staff Portal
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/admin"
                  className="hover:text-primary transition-colors"
                >
                  Admin Console
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-primary transition-colors"
                >
                  Secure Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Safety */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Legal & Safety
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Security Disclosures
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Fraud Protection
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory disclaimer & copyright */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {currentYear} PayVibe Financial Technologies. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Bank-Grade 256-Bit SSL</span>
            <span>•</span>
            <span>FDIC Insured Partner Banking</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
