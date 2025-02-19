export interface UserFormData {
  fullname: string;
  username: string;
  email: string;
  password: string;
  role: "employee" | "hr_personnel" | "supervisor" | "manager" | "system_admin";
  status: "idle" | "blocked" | "active" | "logged_out";
  supervisor_id: string | null;
}

export const roles: UserFormData["role"][] = [
  "employee",
  "hr_personnel",
  "supervisor",
  "manager",
  "system_admin",
];
export const statuses: UserFormData["status"][] = [
  "idle",
  "blocked",
  "active",
  "logged_out",
];