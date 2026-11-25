export type TStaffStatus = "Active" | "Inactive" | "Suspended";
export type TStaffRole = "bank-staff" | "admin";

export interface IStaff {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: TStaffRole;
  status: TStaffStatus;
  createdAt?: string;
}

export interface IStaffListResponse {
  success: boolean;
  message: string;
  data: IStaff[];
}

export interface IStaffResponse {
  success: boolean;
  message: string;
  data: IStaff;
}

export interface ICreateStaffPayload {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role?: TStaffRole;
}

export interface IUpdateStaffPayload {
  id: string;
  name?: string;
  phone?: string;
  role?: TStaffRole;
  status?: TStaffStatus;
}