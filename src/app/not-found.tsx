"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Chip,
  Link,
} from "@heroui/react";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="min-h-[85vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-lg p-6 text-center shadow-lg border border-border">
        {/* Top Header: Brand & 404 Chip */}
        <CardHeader className="flex flex-col items-center gap-2 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-primary">
              PayVibe
            </span>
            <Chip size="sm" variant="soft" color="accent">
              404 Error
            </Chip>
          </div>

          {/* 404 Graphic */}
          <div className="relative flex items-center justify-center my-4 select-none">
            <span className="text-8xl sm:text-9xl font-extrabold tracking-tighter text-foreground/10">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="p-3.5 rounded-2xl border border-border bg-background/80 shadow-md backdrop-blur-md">
                <svg
                  className="w-10 h-10 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.75}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Page Not Found
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground max-w-md mx-auto">
            The banking page, account route, or transaction resource you are
            trying to reach does not exist or has been moved.
          </CardDescription>
        </CardHeader>

        {/* Content: Actions & Quick Links */}
        <CardContent className="space-y-6 pt-4">
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="primary"
              fullWidth
              onPress={() => router.push("/")}
              className="font-medium"
            >
              <svg
                className="w-4 h-4 mr-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Return Home
            </Button>

            <Button
              variant="outline"
              fullWidth
              onPress={() => router.push("/dashboard/customer")}
              className="font-medium"
            >
              <svg
                className="w-4 h-4 mr-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
              Go to Dashboard
            </Button>
          </div>

          {/* Quick Navigation Links */}
          <div className="rounded-xl border border-border bg-default-100/50 dark:bg-default-50/5 p-4 text-left">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
              Quick Navigation
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                href="/dashboard/customer/accounts"
                className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
              >
                <span>•</span> Accounts Overview
              </Link>
              <Link
                href="/dashboard/customer/transfers"
                className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
              >
                <span>•</span> Money Transfers
              </Link>
              <Link
                href="/dashboard/customer/transactions"
                className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
              >
                <span>•</span> Transactions Log
              </Link>
              <Link
                href="/login"
                className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
              >
                <span>•</span> Account Sign In
              </Link>
            </div>
          </div>
        </CardContent>

        {/* Footer: Security Assurance */}
        <CardFooter className="flex items-center justify-center gap-2 pt-2 text-xs text-muted-foreground">
          <svg
            className="w-4 h-4 text-emerald-500 shrink-0"
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
          <span>
            Your bank account balance and data are completely secure.
          </span>
        </CardFooter>
      </Card>
    </main>
  );
}
