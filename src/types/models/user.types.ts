export type UserRole = "admin" | "guru" | "santri";

export interface User {
  uid: string;
  identifier: string;
  role: UserRole;
  programType: "R" | "T" | null;
  displayName: string;
  linkedDocId: string;
}