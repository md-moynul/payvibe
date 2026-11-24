export type UserRole = "admin" | "bank-staff" | "customer";

export interface IAuthUser {
  id: string;
  name?: string | null;
  email?: string | null;
  role: UserRole;
}

export interface IInitialState {
  user: IAuthUser | null;
  token?: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}