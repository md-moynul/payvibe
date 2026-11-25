"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, Button, Chip, CloseIcon } from "@heroui/react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  clearAuth,
  selectCurrentUser,
  selectIsAuthenticated,
  selectUserRole,
} from "@/redux/features/auth";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="w-5 h-5"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  );
}

function getRoleBadgeColor(userRole?: string): "danger" | "warning" | "accent" {
  const normalized = userRole?.toLowerCase().replace(/\s+/g, "-");
  if (normalized === "admin") return "danger";
  if (normalized === "bank-staff" || normalized === "bank staff") return "warning";
  return "accent";
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const role = useAppSelector(selectUserRole);
  const router = useRouter();

  const roleNavLinks = React.useMemo(() => {
    if (!isAuthenticated) {
      return [{ label: "Home", href: "/" }];
    }

    if (role === "admin") {
      return [
        { label: "Dashboard", href: "/dashboard/admin" },
        { label: "Customers", href: "/dashboard/admin/customers" },
        { label: "Accounts", href: "/dashboard/admin/accounts" },
        { label: "Staff", href: "/dashboard/admin/staff" },
        { label: "Loans", href: "/dashboard/admin/loans" },
      ];
    }

    if (role === "bank-staff") {
      return [
        { label: "Dashboard", href: "/dashboard/staff" },
        { label: "Customers", href: "/dashboard/staff/customers" },
        { label: "Transactions", href: "/dashboard/staff/transactions" },
        { label: "Loans", href: "/dashboard/staff/loans" },
      ];
    }

    return [
      { label: "Dashboard", href: "/dashboard/customer" },
      { label: "Accounts", href: "/dashboard/customer/accounts" },
      { label: "Transfers", href: "/dashboard/customer/transfers" },
      { label: "Transactions", href: "/dashboard/customer/transactions" },
      { label: "Loans", href: "/dashboard/customer/loans" },
    ];
  }, [isAuthenticated, role]);

  const handleAuthAction = async () => {
    if (isAuthenticated) {
      await signOut({ redirect: false });
      dispatch(clearAuth());
      router.push("/login");
      router.refresh();
    } else {
      router.push("/login");
    }
  };

  const roleBadgeColor = getRoleBadgeColor(role);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
        aria-label="Main Navigation"
      >
        {/* Left: Mobile Menu Toggle + Brand */}
        <div className="flex items-center gap-3">
          <Button
            isIconOnly
            variant="ghost"
            size="sm"
            className="sm:hidden"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            onPress={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <CloseIcon className="w-5 h-5" /> : <MenuIcon />}
          </Button>

          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="text-primary font-bold">PayVibe</span>
            <Chip size="sm" variant="soft" color="accent">
              Bank
            </Chip>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <div className="hidden sm:flex items-center gap-6">
          {roleNavLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right: User Profile & Auth Action Area */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user && (
            <div className="hidden md:flex items-center gap-3 rounded-full border border-border/80 bg-default-100/60 dark:bg-default-50/10 px-3 py-1.5 shadow-xs transition-all hover:bg-default-100/90 hover:border-border">
              <Avatar
                size="sm"
                color={roleBadgeColor}
                variant="soft"
                className="ring-1 ring-border/50"
              >
                <AvatarFallback className="font-semibold text-xs">
                  {(user.name || user.email || "U").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-foreground leading-tight max-w-30 truncate">
                  {user.name || user.email?.split("@")[0]}
                </span>
                {user.email && (
                  <span className="text-[10px] text-muted-foreground leading-tight max-w-30 truncate">
                    {user.email}
                  </span>
                )}
              </div>

              <Chip
                size="sm"
                variant="soft"
                color={roleBadgeColor}
                className="capitalize font-semibold text-[10px] tracking-wide h-5 px-2"
              >
                {role || "Customer"}
              </Chip>
            </div>
          )}

          <Button
            size="sm"
            variant={isAuthenticated ? "outline" : "primary"}
            onPress={handleAuthAction}
            className="font-medium rounded-full px-4"
          >
            {isAuthenticated ? "Sign Out" : "Sign In"}
          </Button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div className="sm:hidden border-t border-border bg-background px-4 py-4 flex flex-col gap-3">
          {/* User Profile Card on Mobile */}
          {isAuthenticated && user && (
            <div className="flex items-center justify-between p-3 rounded-xl border border-border/80 bg-default-100/60 dark:bg-default-50/10">
              <div className="flex items-center gap-3">
                <Avatar
                  size="md"
                  color={roleBadgeColor}
                  variant="soft"
                  className="ring-1 ring-border/50"
                >
                  <AvatarFallback className="font-semibold text-sm">
                    {(user.name || user.email || "U").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-semibold text-foreground">
                    {user.name || user.email?.split("@")[0]}
                  </span>
                  <span className="text-xs text-muted-foreground truncate max-w-42.5">
                    {user.email}
                  </span>
                </div>
              </div>
              <Chip
                size="sm"
                variant="soft"
                color={roleBadgeColor}
                className="capitalize font-semibold text-[11px] h-5 px-2"
              >
                {role || "Customer"}
              </Chip>
            </div>
          )}

          {/* Navigation Links */}
          <div className="flex flex-col gap-1">
            {roleNavLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="w-full py-2 px-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-default-100 hover:text-primary transition-colors block"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
