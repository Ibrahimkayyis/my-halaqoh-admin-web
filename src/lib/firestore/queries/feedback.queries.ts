import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
  onSnapshot,
  type DocumentSnapshot,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type {
  UserFeedback,
  FeedbackCategory,
  FeedbackStatus,
  FeedbackUserRole,
  UpdateFeedbackPayload,
} from "@/types/models/feedback.types";

export const FEEDBACK_COLLECTION = "feedback";

/**
 * Memetakan dokumen Firestore ke objek domain UserFeedback yang strongly-typed.
 */
export function mapFeedbackDoc(
  d: DocumentSnapshot | QueryDocumentSnapshot
): UserFeedback {
  const data = d.data() || {};
  return {
    id: d.id,
    userId: typeof data.userId === "string" ? data.userId : "",
    userName: typeof data.userName === "string" ? data.userName : "Pengguna Tanpa Nama",
    userRole: (data.userRole as FeedbackUserRole) || "wali_santri",
    userIdentifier: typeof data.userIdentifier === "string" ? data.userIdentifier : "-",
    category: (data.category as FeedbackCategory) || "pertanyaan",
    title: typeof data.title === "string" ? data.title : "Tanpa Judul",
    description: typeof data.description === "string" ? data.description : "",
    attachmentUrls: Array.isArray(data.attachmentUrls) ? data.attachmentUrls : [],
    appVersion: typeof data.appVersion === "string" ? data.appVersion : "-",
    deviceModel: typeof data.deviceModel === "string" ? data.deviceModel : "-",
    osVersion: typeof data.osVersion === "string" ? data.osVersion : "-",
    status: (data.status as FeedbackStatus) || "open",
    adminResponse: typeof data.adminResponse === "string" ? data.adminResponse : null,
    resolvedAt: (data.resolvedAt as Timestamp) || null,
    resolvedBy: typeof data.resolvedBy === "string" ? data.resolvedBy : null,
    resolvedNotifiedAt: (data.resolvedNotifiedAt as Timestamp) || null,
    createdAt: (data.createdAt as Timestamp) || Timestamp.now(),
  };
}

/**
 * Mengambil seluruh masukan pengguna dari Firestore diurutkan berdasarkan createdAt DESC.
 */
export async function getAllFeedback(): Promise<UserFeedback[]> {
  const colRef = collection(db, FEEDBACK_COLLECTION);
  const snapshot = await getDocs(colRef);
  const list = snapshot.docs.map(mapFeedbackDoc);

  return list.sort((a, b) => {
    const timeA = a.createdAt?.toMillis?.() ?? 0;
    const timeB = b.createdAt?.toMillis?.() ?? 0;
    return timeB - timeA;
  });
}

/**
 * Berlangganan (realtime listener) ke seluruh dokumen masukan pengguna.
 * Menghasilkan fungsi unsubscribe untuk membersihkan listener saat unmount.
 */
export function subscribeAllFeedback(
  onData: (data: UserFeedback[]) => void,
  onError?: (err: Error) => void
): () => void {
  const colRef = collection(db, FEEDBACK_COLLECTION);

  return onSnapshot(
    colRef,
    (snapshot) => {
      const list = snapshot.docs
        .map(mapFeedbackDoc)
        .sort((a, b) => {
          const timeA = a.createdAt?.toMillis?.() ?? 0;
          const timeB = b.createdAt?.toMillis?.() ?? 0;
          return timeB - timeA;
        });
      onData(list);
    },
    (err) => {
      console.error("Firestore realtime feedback error:", err);
      onError?.(err);
    }
  );
}

/**
 * Mengambil satu dokumen masukan berdasarkan ID dokumen.
 */
export async function getFeedbackById(id: string): Promise<UserFeedback | null> {
  const docRef = doc(db, FEEDBACK_COLLECTION, id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return mapFeedbackDoc(snapshot);
}

/**
 * Memperbarui status dan balasan tindak lanjut masukan oleh Super Admin.
 *
 * PERHATIAN:
 * - Jika status 'resolved', wajib menyertakan adminResponse dan men-generate resolvedAt serta resolvedBy.
 * - Field 'resolvedNotifiedAt' DILARANG ditulis di sini karena dikelola otomatis oleh Cloud Function.
 */
export async function updateFeedbackStatusAndResponse(
  id: string,
  payload: UpdateFeedbackPayload
): Promise<void> {
  const docRef = doc(db, FEEDBACK_COLLECTION, id);

  if (payload.status === "resolved") {
    await updateDoc(docRef, {
      status: "resolved",
      adminResponse: payload.adminResponse?.trim() || "",
      resolvedAt: serverTimestamp(),
      resolvedBy: payload.adminName || "Super Admin",
    });
  } else {
    const updateData: Record<string, unknown> = {
      status: payload.status,
    };
    if (payload.adminResponse !== undefined) {
      updateData.adminResponse = payload.adminResponse ? payload.adminResponse.trim() : null;
    }
    await updateDoc(docRef, updateData);
  }
}
