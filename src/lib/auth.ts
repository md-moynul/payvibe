import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "./db";
import { UserRole } from "@/types/auth.type";

function normalizeRole(rawRole: unknown): UserRole {
  const normalized =
    typeof rawRole === "string"
      ? rawRole.trim().toLowerCase().replace(/\s+/g, "-")
      : "";

  if (normalized === "admin") return "admin";
  if (normalized === "bank-staff" || normalized === "staff") {
    return "bank-staff" as UserRole;
  }
  return "customer" as UserRole;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email =
          typeof credentials?.email === "string"
            ? credentials.email.trim().toLowerCase()
            : "";
        const password =
          typeof credentials?.password === "string" ? credentials.password : "";

        if (!email || !password) {
          return null;
        }

        const db = await connectToDatabase();
        const user = await db.collection("users").findOne({ email });

        if (!user || user.isActive === false) {
          return null;
        }

        const normalizedStatus =
          typeof user.status === "string"
            ? user.status.trim().toLowerCase()
            : "";
        if (
          normalizedStatus === "suspended" ||
          normalizedStatus === "inactive" ||
          normalizedStatus === "blocked"
        ) {
          return null;
        }

        const passwordHash =
          typeof user.passwordHash === "string" ? user.passwordHash : "";

        if (!passwordHash) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(password, passwordHash);
        if (!isPasswordValid) {
          return null;
        }

        const role = normalizeRole(user.role);

        return {
          id: user._id.toString(),
          name: user.name ?? "",
          email: user.email,
          role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id ?? "");
        session.user.role = (token.role as UserRole) ?? ("customer" as UserRole);
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.AUTH_SECRET,
});