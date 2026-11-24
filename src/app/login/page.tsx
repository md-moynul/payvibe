"use client";

import React, { useEffect, useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  TextField,
  Label,
  Input,
  Button,
  Alert,
  AlertIndicator,
  AlertContent,
  AlertTitle,
  Spinner,
} from "@heroui/react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { setAuthError } from "@/redux/features/auth/auth.slice";
import {
  selectAuthError,
  selectAuthLoading,
  setAuthLoading,
} from "@/redux/features/auth";
import { UserRole } from "@/types/auth.type";

function getDashboardRoute(role?: UserRole) {
  if (role === "admin") return "/dashboard/admin";
  if (role === "bank-staff") return "/dashboard/staff";
  return "/dashboard/customer";
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectAuthError);
  const loading = useAppSelector(selectAuthLoading);
  useEffect(() => {
    dispatch(setAuthError(null));
    dispatch(setAuthLoading(false));
  }, [dispatch]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setAuthLoading(true));

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        dispatch(setAuthError("Invalid email or password."));
        return;
      }

      const session = await getSession();
      router.push(getDashboardRoute(session?.user?.role));
      router.refresh();
    } catch {
      dispatch(setAuthError("Unable to sign in right now. Please try again."));
    } finally {
      dispatch(setAuthLoading(false));
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-muted/20">
      <Card className="w-full max-w-md p-6 shadow-md border border-default-200">
        <CardHeader className="flex flex-col items-start gap-1 pb-4">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Sign In
          </CardTitle>
          <CardDescription className="text-sm text-default-500">
            Enter your credentials to access your PayVibe account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <Alert status="danger" className="w-full">
                <AlertIndicator />
                <AlertContent>
                  <AlertTitle>{error}</AlertTitle>
                </AlertContent>
              </Alert>
            )}

            <TextField
              name="email"
              type="email"
              isRequired
              value={email}
              onChange={setEmail}
              className="flex flex-col gap-1.5"
            >
              <Label className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                autoComplete="email"
                placeholder="name@example.com"
                required
              />
            </TextField>

            <TextField
              name="password"
              type="password"
              isRequired
              value={password}
              onChange={setPassword}
              className="flex flex-col gap-1.5"
            >
              <Label className="text-sm font-medium">Password</Label>
              <Input
                id="password"
                autoComplete="current-password"
                placeholder="••••••••"
                required
              />
            </TextField>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isDisabled={loading}
              className="mt-2 font-medium"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner size="sm" color="current" />
                  <span>Signing in...</span>
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
