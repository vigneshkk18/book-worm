import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function cacheFile(file: File, id: string) {
  const cache = await caches.open("bw-resources");
  
  const response = new Response(file, {
    headers: { "Content-Type": file.type, "Content-Length": String(file.size) },
  });
  await cache.put(id, response);
}

export async function removeFileFromCache(id: string) {
  const cache = await caches.open("bw-resources");
  await cache.delete(id);
}

export async function retrieveFileFromCache(id: string) {
  const cache = await caches.open("bw-resources");
    
  return await cache.match(id);
}

export function dataURLToBlob(dataURL: string) {
  const parts = dataURL.split(",");
  const mime = parts[0].match(/:(.*?);/)?.[1];
  const byteString = atob(parts[1]);
  const arrayBuffer = new Uint8Array(byteString.length);

  for (let i = 0; i < byteString.length; i++) {
    arrayBuffer[i] = byteString.charCodeAt(i);
  }

  return new Blob([arrayBuffer], { type: mime });
}
