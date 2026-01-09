
// Utility for AES-GCM encryption/decryption using Web Crypto API

export async function encryptData(data, password) {
     try {
          const enc = new TextEncoder();
          const salt = crypto.getRandomValues(new Uint8Array(16));
          const iv = crypto.getRandomValues(new Uint8Array(12));

          const keyMaterial = await crypto.subtle.importKey(
               "raw",
               enc.encode(password),
               { name: "PBKDF2" },
               false,
               ["deriveKey"]
          );

          const key = await crypto.subtle.deriveKey(
               {
                    name: "PBKDF2",
                    salt: salt,
                    iterations: 100000,
                    hash: "SHA-256",
               },
               keyMaterial,
               { name: "AES-GCM", length: 256 },
               false,
               ["encrypt"]
          );

          const json = JSON.stringify(data);
          const content = enc.encode(json);

          const encrypted = await crypto.subtle.encrypt(
               {
                    name: "AES-GCM",
                    iv: iv,
               },
               key,
               content
          );

          // Combine salt + iv + encrypted data into a single buffer
          const buffer = new Uint8Array(salt.byteLength + iv.byteLength + encrypted.byteLength);
          buffer.set(salt, 0);
          buffer.set(iv, salt.byteLength);
          buffer.set(new Uint8Array(encrypted), salt.byteLength + iv.byteLength);

          // Convert to base64 for file storage
          return btoa(String.fromCharCode(...buffer));
     } catch (e) {
          console.error("Encryption failed:", e);
          throw e;
     }
}

export async function decryptData(encryptedString, password) {
     try {
          const enc = new TextEncoder();
          const dec = new TextDecoder();

          // Convert base64 back to buffer
          const encryptedData = Uint8Array.from(atob(encryptedString), c => c.charCodeAt(0));

          // Extract salt, iv, and data
          const salt = encryptedData.slice(0, 16);
          const iv = encryptedData.slice(16, 28);
          const data = encryptedData.slice(28);

          const keyMaterial = await crypto.subtle.importKey(
               "raw",
               enc.encode(password),
               { name: "PBKDF2" },
               false,
               ["deriveKey"]
          );

          const key = await crypto.subtle.deriveKey(
               {
                    name: "PBKDF2",
                    salt: salt,
                    iterations: 100000,
                    hash: "SHA-256",
               },
               keyMaterial,
               { name: "AES-GCM", length: 256 },
               false,
               ["decrypt"]
          );

          const decrypted = await crypto.subtle.decrypt(
               {
                    name: "AES-GCM",
                    iv: iv,
               },
               key,
               data
          );

          const decoded = dec.decode(decrypted);
          return JSON.parse(decoded);
     } catch (e) {
          console.error("Decryption failed:", e);
          throw new Error("パスワードが間違っているか、ファイルが破損しています。");
     }
}
