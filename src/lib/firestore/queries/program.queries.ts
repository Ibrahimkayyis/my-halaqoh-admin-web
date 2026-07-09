import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { Program } from "@/features/kelas-program/types/kelas-program.types";

const collectionName = "program";

export async function getProgram(): Promise<Program[]> {
  const colRef = collection(db, collectionName);
  const snapshot = await getDocs(colRef);
  const list = snapshot.docs.map(doc => ({
    ...doc.data(),
    id: doc.id
  })) as Program[];
  
  // Sort by nama ascending
  return list.sort((a, b) => a.nama.localeCompare(b.nama));
}

export async function createProgram(data: Omit<Program, "createdAt" | "updatedAt">): Promise<void> {
  const colRef = collection(db, collectionName);
  const docRef = doc(colRef, data.id); // Manual ID
  
  const payload = {
    ...data,
    id: docRef.id,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  
  await setDoc(docRef, payload);
}

export async function updateProgram(id: string, data: Partial<Omit<Program, "id" | "createdAt" | "updatedAt">>): Promise<void> {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProgram(id: string): Promise<void> {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
}
