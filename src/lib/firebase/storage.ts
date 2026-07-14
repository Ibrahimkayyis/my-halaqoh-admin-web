import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase/config";

/**
 * Upload foto profil santri ke Firebase Storage.
 * Path: profile_pictures/santri_{nis}_{timestamp}.{ext}
 * (Sama persis dengan konvensi di mobile app)
 */
export async function uploadSantriPhoto(
  file: File,
  nis: string
): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const timestamp = Date.now();
  const path = `profile_pictures/santri_${nis}_${timestamp}.${ext}`;

  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);

  return downloadURL;
}
