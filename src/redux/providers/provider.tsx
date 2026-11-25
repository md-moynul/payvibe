"use client";

import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { SessionProvider, useSession } from "next-auth/react";
import { store } from "@/redux/store";
import { useAppDispatch } from "@/redux/hook";
import { setUser, clearAuth } from "@/redux/features/auth/auth.slice";
import { ToastProvider } from "@heroui/react";

function AuthSync() {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      dispatch(
        setUser({
          id: session.user.id ?? "",
          name: session.user.name,
          email: session.user.email,
          role: session.user.role ?? "Customer",
        })
      );
    } else if (status === "unauthenticated") {
      dispatch(clearAuth());
    }
  }, [session, status, dispatch]);

  return null;
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Provider store={store}>
        <ToastProvider placement="top end" />
        <AuthSync />
        {children}
      </Provider>
    </SessionProvider>
  );
}