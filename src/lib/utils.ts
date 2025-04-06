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

export function getBrowserName() {
    const userAgent = navigator.userAgent;

    if (userAgent.includes("Firefox")) return "Mozilla Firefox";
    if (userAgent.includes("SamsungBrowser")) return "Samsung Internet";
    if (userAgent.includes("Opera") || userAgent.includes("OPR")) return "Opera";
    if (userAgent.includes("Edg")) return "Microsoft Edge";
    if (userAgent.includes("Chrome")) return "Google Chrome";
    if (userAgent.includes("Safari")) return "Safari";
    
    return "Unknown";
}

// Get device type (approximation based on screen size and user agent)
export function getDeviceType() {
    const ua = navigator.userAgent;
    if (/Mobi|Android/i.test(ua)) {
        return "Mobile";
    } else if (/Tablet|iPad/i.test(ua)) {
        return "Tablet";
    } else {
        return "Desktop";
    }
}