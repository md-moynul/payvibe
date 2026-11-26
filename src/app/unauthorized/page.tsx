"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Chip,
} from "@heroui/react";
import {
  ShieldAlert,
  ArrowLeft,
  LayoutDashboard,
  LogIn,
  Home,
  Lock,
} from "lucide-react";
import { useAppSelector } from "@/redux/hook";
import { selectCurrentUser, selectUserRole } from "@/redux/features/auth";
import { getDashboardHome } from "@/lib/role.helper";

function UnauthorizedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const attemptedPath = searchParams.get("from");
  const user = useAppSelector(selectCurrentUser);
  const role = useAppSelector(selectUserRole);

  const homePath = getDashboardHome(role);

  return (
    <main className="min-h-[85vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-lg p-6 text-center shadow-lg border border-border">
        {/* Top Header: Brand & 403 Status */}
        <CardHeader className="flex flex-col items-center gap-2 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-primary">
              PayVibe
            </span>
            <Chip size="sm" variant="soft" color="danger">
              403 Forbidden
            </Chip>
          </div>

          {/* 403 Graphic */}
          <div className="relative flex items-center justify-center my-4 select-none">
            <span className="text-8xl sm:text-9xl font-extrabold tracking-tighter text-danger/10">
              403
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="p-3.5 rounded-2xl border border-danger/20 bg-danger/10 shadow-md backdrop-blur-md text-danger">
                <ShieldAlert className="w-10 h-10" />
              </div>
            </div>
          </div>

          <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Access Restricted
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground max-w-md mx-auto">
            You do not have the required permissions or account role to access
            this protected area.
          </CardDescription>
        </CardHeader>

        {/* Content: Role Info & Attempted Path */}
        <CardContent className="space-y-4 pt-2">
          <div className="rounded-xl border border-border bg-muted/30 p-4 text-left space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Current Account:</span>
              <span className="font-semibold text-foreground truncate max-w-[220px]">
                {user?.email || "Signed In"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Assigned Role:</span>
              <Chip
                size="sm"
                variant="soft"
                color={
                  role === "admin"
                    ? "danger"
                    : role === "bank-staff"
                      ? "warning"
                      : "accent"
                }
                className="capitalize text-xs font-semibold"
              >
                {role || "Guest"}
              </Chip>
            </div>
            {attemptedPath && (
              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Lock className="w-3 h-3 text-muted-foreground" />
                  Target Route:
                </span>
                <span className="font-mono text-muted-foreground truncate max-w-[220px] bg-background/50 px-2 py-0.5 rounded border border-border/40">
                  {attemptedPath}
                </span>
              </div>
            )}
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            If you need access to this portal or believe this is an error, please
            contact your bank branch administrator or system support.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              fullWidth
              onPress={() => router.push(homePath)}
              className="font-medium"
            >
              <LayoutDashboard className="w-4 h-4 mr-1.5" />
              Return to My Dashboard
            </Button>

            <Button
              variant="outline"
              fullWidth
              onPress={() => router.back()}
              className="font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Go Back
            </Button>
          </div>

          <div className="flex items-center justify-center gap-4 pt-2">
            <Button
              size="sm"
              variant="ghost"
              onPress={() => router.push("/")}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              <Home className="w-3.5 h-3.5 mr-1" />
              Home
            </Button>
            <span className="text-border">&bull;</span>
            <Button
              size="sm"
              variant="ghost"
              onPress={() => router.push("/login")}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              <LogIn className="w-3.5 h-3.5 mr-1" />
              Sign in with another account
            </Button>
          </div>
        </CardContent>

        <CardFooter className="justify-center border-t border-border pt-4 text-xs text-muted-foreground">
          PayVibe Secure Banking Infrastructure &bull; Role Access Gate
        </CardFooter>
      </Card>
    </main>
  );
}

export default function UnauthorizedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      }
    >
      <UnauthorizedContent />
    </Suspense>
  );
}
