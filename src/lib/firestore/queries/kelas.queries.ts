import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { Kelas } from "@/features/kelas-program/types/kelas-program.types";

const collectionName = "kelas";

export async function getKelas(): Promise<Kelas[]> {
  const colRef = collection(db, collectionName);
  const snapshot = await getDocs(colRef);
  const list = snapshot.docs.map(doc => ({
    ...doc.data(),
    id: doc.id
  })) as Kelas[];
  
  // Sort by urutan ascending
  return list.sort((a, b) => a.urutan - b.urutan);
}

export async function createKelas(data: Omit<Kelas, "id" | "createdAt" | "updatedAt">): Promise<void> {
  const colRef = collection(db, collectionName);
  const docRef = doc(colRef); // Auto-ID
  
  const payload = {
    ...data,
    id: docRef.id,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  
  await setDoc(docRef, payload);
}

export async function updateKelas(id: string, data: Partial<Omit<Kelas, "id" | "createdAt" | "updatedAt">>): Promise<void> {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteKelas(id: string): Promise<void> {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
}
