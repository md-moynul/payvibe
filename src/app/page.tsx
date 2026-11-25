"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Chip,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@heroui/react";

export default function Home() {
  const router = useRouter();

  const features = [
    {
      title: "Instant Global Transfers",
      description:
        "Send and receive money seamlessly across accounts with zero delay, real-time receipts, and low exchange rates.",
      icon: (
        <svg
          className="w-6 h-6 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      title: "Multi-Account Control",
      description:
        "Switch effortlessly between Savings, Current, and Business accounts with real-time balance tracking.",
      icon: (
        <svg
          className="w-6 h-6 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      ),
    },
    {
      title: "Bank-Grade Encryption",
      description:
        "Protected by 256-bit encryption, strict biometric authentication, and automated fraud prevention systems.",
      icon: (
        <svg
          className="w-6 h-6 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    },
    {
      title: "Flexible Loan Management",
      description:
        "Transparent low-interest personal & business loans with fast eligibility checks and flexible repayment schedules.",
      icon: (
        <svg
          className="w-6 h-6 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  const accountTiers = [
    {
      type: "Savings Account",
      badge: "4.8% APY",
      color: "accent" as const,
      highlight: "High-yield savings with automatic round-ups and monthly compounding growth.",
      features: ["No minimum deposit", "Automated daily interest", "Withdraw anytime without penalty"],
    },
    {
      type: "Current Account",
      badge: "Most Popular",
      color: "accent" as const,
      highlight: "Everyday banking designed for zero transaction fees and unlimited debit spending.",
      features: ["Virtual & physical debit card", "Instant push payment alerts", "Free ATM withdrawals nationwide"],
    },
    {
      type: "Business Account",
      badge: "Enterprise Ready",
      color: "warning" as const,
      highlight: "Empower your business with multi-seat access, bulk payroll, and custom limits.",
      features: ["Daily limits up to $500,000", "Detailed exportable tax reports", "Dedicated account manager"],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
        {/* Glow Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-28 right-10 w-[300px] h-[300px] bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2">
                <Chip size="sm" variant="soft" color="accent" className="font-medium">
                  ✦ Next-Gen Digital Banking
                </Chip>
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  Zero monthly maintenance fees
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
                Smarter, Faster & <br />
                <span className="text-primary bg-clip-text">
                  Secure Banking
                </span>{" "}
                for You.
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Take control of your money with PayVibe. Real-time transfers,
                instant debit controls, automated savings, and bank-grade
                encryption in one modern portal.
              </p>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto font-semibold px-8 shadow-md"
                  onPress={() => router.push("/login")}
                >
                  Get Started Free
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto font-medium px-6"
                  onPress={() => router.push("/dashboard/customer")}
                >
                  View Live Demo
                </Button>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border/80 max-w-lg mx-auto lg:mx-0">
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-foreground">
                    $150M+
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Monthly Volume
                  </p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-foreground">
                    99.99%
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Uptime SLA
                  </p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-foreground">
                    Instant
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    ACH & Wire Speed
                  </p>
                </div>
              </div>
            </div>

            {/* Right Card / Visual Preview */}
            <div className="lg:col-span-5 relative">
              {/* Virtual Card Graphic */}
              <div className="relative mx-auto max-w-md">
                {/* Premium Banking Debit Card */}
                <div className="rounded-3xl p-6 bg-gradient-to-br from-primary via-primary/90 to-primary/70 text-primary-foreground shadow-2xl relative overflow-hidden space-y-8 border border-primary/20">
                  <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-xl" />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-widest font-semibold opacity-80">
                        PayVibe Platinum
                      </p>
                      <p className="text-xl font-bold mt-0.5">Digital Debit</p>
                    </div>
                    <Chip size="sm" variant="soft" color="accent" className="bg-white/20 text-white font-bold">
                      Active
                    </Chip>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs opacity-75">Available Balance</p>
                    <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                      $125,480.00
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs tracking-wider opacity-90 pt-2 font-mono">
                    <span>•••• •••• •••• 8821</span>
                    <span>EXP 08/29</span>
                  </div>
                </div>

                {/* Floating Activity Snippet */}
                <div className="absolute -bottom-8 -left-4 sm:-left-6 right-4 sm:right-6 bg-background/95 backdrop-blur-md rounded-2xl border border-border p-4 shadow-xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold">
                      ↓
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">
                        Salary Direct Deposit
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Today • Completed
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    +$8,450.00
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE FEATURES SECTION */}
      <section className="py-20 bg-default-100/40 dark:bg-default-50/5 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Chip size="sm" variant="soft" color="accent">
              Core Capabilities
            </Chip>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Engineered for Modern Financial Freedom
            </h2>
            <p className="text-sm text-muted-foreground">
              Every tool and service you need to manage your personal or
              business cashflow with complete transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((item, idx) => (
              <Card
                key={idx}
                className="p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-md border border-border bg-background"
              >
                <CardHeader className="p-0 pb-3 flex items-start gap-3">
                  <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                    {item.icon}
                  </div>
                </CardHeader>
                <CardTitle className="text-base font-semibold text-foreground">
                  {item.title}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                  {item.description}
                </CardDescription>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 3. ACCOUNT TIERS SECTION */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Chip size="sm" variant="soft" color="accent">
              Account Types
            </Chip>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Pick the Perfect Account Tier
            </h2>
            <p className="text-sm text-muted-foreground">
              Tailored bank accounts built to match your lifestyle and commercial ambitions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {accountTiers.map((tier, idx) => (
              <Card
                key={idx}
                className={`p-6 border relative transition-all ${
                  tier.badge === "Most Popular"
                    ? "border-primary ring-1 ring-primary shadow-lg bg-background"
                    : "border-border bg-background hover:border-primary/50"
                }`}
              >
                <CardHeader className="p-0 pb-4 flex items-center justify-between">
                  <span className="text-lg font-bold text-foreground">
                    {tier.type}
                  </span>
                  <Chip size="sm" variant="soft" color={tier.color}>
                    {tier.badge}
                  </Chip>
                </CardHeader>

                <CardContent className="p-0 space-y-6">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {tier.highlight}
                  </p>

                  <ul className="space-y-2.5 text-xs text-foreground">
                    {tier.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-primary shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={tier.badge === "Most Popular" ? "primary" : "outline"}
                    fullWidth
                    onPress={() => router.push("/login")}
                    className="font-medium mt-4"
                  >
                    Select {tier.type.split(" ")[0]}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SECURITY & TRUST REASSURANCE */}
      <section className="py-16 bg-default-100/50 dark:bg-default-50/5 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-border bg-background p-8 sm:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <svg
                  className="w-5 h-5 text-emerald-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Bank-Grade Security Guaranteed
                </span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-foreground">
                Your Deposits and Identity are Always Protected
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                With real-time anomaly detection, zero-liability protection on card
                fraud, and continuous compliance monitoring, your funds remain secure 24/7.
              </p>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="font-semibold px-8 whitespace-nowrap shadow-md"
              onPress={() => router.push("/login")}
            >
              Open Your Account
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
