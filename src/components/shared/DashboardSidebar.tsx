"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  Send,
  ArrowLeftRight,
  ArrowDownLeft,
  Landmark,
  Users,
  ShieldCheck,
  Clock,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { useAppSelector } from "@/redux/hook";
import { selectCurrentUser, selectUserRole } from "@/redux/features/auth";
import { Tooltip, TooltipTrigger, TooltipContent } from "@heroui/react";

interface INavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface INavGroup {
  groupTitle: string;
  items: INavItem[];
}

export default function DashboardSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const role = useAppSelector(selectUserRole);
  const user = useAppSelector(selectCurrentUser);

  const navigationGroups: INavGroup[] = React.useMemo(() => {
    if (role === "admin") {
      return [
        {
          groupTitle: "Overview",
          items: [
            {
              label: "Admin Dashboard",
              href: "/dashboard/admin",
              icon: LayoutDashboard,
            },
          ],
        },
        {
          groupTitle: "Finance & Operations",
          items: [
            {
              label: "Bank Accounts",
              href: "/dashboard/admin/accounts",
              icon: Wallet,
            },
            {
              label: "Transactions",
              href: "/dashboard/admin/transactions",
              icon: ArrowLeftRight,
            },
            {
              label: "Deposit/Withdraw Requests",
              href: "/dashboard/admin/requests",
              icon: Clock,
            },
            {
              label: "Loan Management",
              href: "/dashboard/admin/loans",
              icon: Landmark,
            },
          ],
        },
        {
          groupTitle: "Management",
          items: [
            {
              label: "Customer Directory",
              href: "/dashboard/admin/customers",
              icon: Users,
            },
            {
              label: "Bank Staff",
              href: "/dashboard/admin/staff",
              icon: ShieldCheck,
            },
          ],
        },
      ];
    }

    if (role === "bank-staff") {
      return [
        {
          groupTitle: "Overview",
          items: [
            {
              label: "Staff Dashboard",
              href: "/dashboard/staff",
              icon: LayoutDashboard,
            },
          ],
        },
        {
          groupTitle: "Desk Operations",
          items: [
            {
              label: "Customers",
              href: "/dashboard/staff/customers",
              icon: Users,
            },
            {
              label: "Transactions",
              href: "/dashboard/staff/transactions",
              icon: ArrowLeftRight,
            },
            {
              label: "Pending Requests",
              href: "/dashboard/staff/requests",
              icon: Clock,
            },
            {
              label: "Loan Applications",
              href: "/dashboard/staff/loans",
              icon: Landmark,
            },
          ],
        },
      ];
    }

    // Default: Customer Portal
    return [
      {
        groupTitle: "Overview",
        items: [
          {
            label: "Dashboard",
            href: "/dashboard/customer",
            icon: LayoutDashboard,
          },
          {
            label: "My Accounts",
            href: "/dashboard/customer/account",
            icon: Wallet,
          },
        ],
      },
      {
        groupTitle: "Banking & Transfers",
        items: [
          {
            label: "Transfer Funds",
            href: "/dashboard/customer/transfers",
            icon: Send,
          },
          {
            label: "Transaction History",
            href: "/dashboard/customer/transactions",
            icon: ArrowLeftRight,
          },
          {
            label: "Deposit / Withdraw",
            href: "/dashboard/customer/deposits-withdrawals",
            icon: ArrowDownLeft,
          },
        ],
      },
      {
        groupTitle: "Credit & Financing",
        items: [
          {
            label: "Loans & Credit",
            href: "/dashboard/customer/loans",
            icon: Landmark,
          },
        ],
      },
    ];
  }, [role]);

  const isLinkActive = (href: string) => {
    if (
      href === "/dashboard/admin" ||
      href === "/dashboard/staff" ||
      href === "/dashboard/customer"
    ) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const roleLabel =
    role === "admin"
      ? "Admin Console"
      : role === "bank-staff"
        ? "Staff Portal"
        : "Customer Hub";

  return (
    <>
      {/* Mobile Floating Toggle Button */}
      <div className="fixed bottom-5 right-5 z-40 lg:hidden">
        <button
          type="button"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-700 active:scale-95 transition-all cursor-pointer"
          aria-label={isMobileOpen ? "Close sidebar menu" : "Open sidebar menu"}
        >
          {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 flex flex-col border-r border-border/70 bg-card/95 backdrop-blur-md transition-all duration-300 lg:static lg:z-auto ${
          isCollapsed ? "lg:w-20" : "lg:w-64"
        } ${
          isMobileOpen
            ? "translate-x-0 w-72 shadow-2xl"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Top Header / Portal Badge */}
        <div className="flex items-center justify-between p-4 border-b border-border/60">
          <div
            className={`flex items-center gap-2.5 overflow-hidden transition-all ${
              isCollapsed ? "lg:hidden" : "block"
            }`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-foreground leading-tight truncate">
                {roleLabel}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                {user?.name || user?.email?.split("@")[0] || "PayVibe Bank"}
              </p>
            </div>
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg border border-border/70 text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors cursor-pointer"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1 text-muted-foreground hover:text-foreground"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links Area */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navigationGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1.5">
              {/* Group Title (Hidden when collapsed on desktop) */}
              <p
                className={`px-2.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 ${
                  isCollapsed ? "lg:hidden" : "block"
                }`}
              >
                {group.groupTitle}
              </p>

              {/* Group Nav Items */}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = isLinkActive(item.href);
                  const Icon = item.icon;

                  const linkNode = (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-all duration-200 ${
                        active
                          ? "bg-blue-500 font-semibold text-white shadow-xs"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      } ${isCollapsed ? "lg:justify-center lg:px-2" : ""}`}
                    >
                      <Icon
                        className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-105 ${
                          active
                            ? "text-white"
                            : "text-muted-foreground group-hover:text-foreground"
                        }`}
                      />
                      <span
                        className={`truncate transition-all ${
                          isCollapsed ? "lg:hidden" : "block"
                        }`}
                      >
                        {item.label}
                      </span>
                    </Link>
                  );

                  if (isCollapsed) {
                    return (
                      <Tooltip key={item.href}>
                        <TooltipTrigger className="w-full">
                          {linkNode}
                        </TooltipTrigger>
                        <TooltipContent className="text-xs font-medium">
                          {item.label}
                        </TooltipContent>
                      </Tooltip>
                    );
                  }

                  return linkNode;
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-border/60">
          <div
            className={`flex items-center gap-2 rounded-xl bg-muted/30 p-2.5 text-xs ${
              isCollapsed ? "lg:justify-center" : ""
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
            <span
              className={`text-[11px] font-medium text-muted-foreground truncate ${
                isCollapsed ? "lg:hidden" : "block"
              }`}
            >
              All Systems Operational
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
