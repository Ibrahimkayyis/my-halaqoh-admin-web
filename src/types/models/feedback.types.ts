import type { Timestamp } from "firebase/firestore";

export type FeedbackCategory = "bug" | "saran" | "pertanyaan";

export type FeedbackStatus = "open" | "in_progress" | "resolved";

export type FeedbackUserRole =
  | "guru"
  | "santri"
  | "wali_santri"
  | "admin"
  | "super_admin";

export interface UserFeedback {
  id: string;
  userId: string;
  userName: string;
  userRole: FeedbackUserRole;
  userIdentifier: string; // NIP untuk guru, NIS untuk santri / wali santri
  category: FeedbackCategory;
  title: string;
  description: string;
  attachmentUrls?: string[];
  appVersion: string;
  deviceModel: string;
  osVersion: string;
  status: FeedbackStatus;
  adminResponse?: string | null;
  resolvedAt?: Timestamp | null;
  resolvedBy?: string | null;
  resolvedNotifiedAt?: Timestamp | null; // Dikelola oleh Cloud Function, read-only di web admin
  createdAt: Timestamp;
}

export interface UpdateFeedbackPayload {
  status: FeedbackStatus;
  adminResponse?: string | null;
  adminName: string;
}
