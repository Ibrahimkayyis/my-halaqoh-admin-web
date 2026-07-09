import { Timestamp } from "firebase/firestore";

export interface Kelas {
  id: string; // unique ID
  nama: string; // '7', '8', '9'
  urutan: number; // 1, 2, 3
  nextKelasId: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Program {
  id: string; // 'R', 'T'
  nama: string; // 'Reguler', 'Takhassus'
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
