import { randomBytes, createCipheriv, createDecipheriv } from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96 bits for GCM
const AUTH_TAG_LENGTH = 16; // 128 bits

/**
 * Get the encryption key from environment variable
 * Returns null if not configured (allows graceful fallback)
 */
function getEncryptionKey(): Buffer | null {
  const secret = process.env.ENCRYPTION_SECRET;
  if (!secret) {
    return null;
  }
  // Support both base64 (ends with =) and hex encoding
  const encoding = secret.endsWith("=") ? "base64" : "hex";
  return Buffer.from(secret, encoding);
}

/**
 * Encrypt a string using AES-256-GCM
 * Returns the encrypted data and IV for storage
 */
export function encrypt(plaintext: string): { encrypted: string; iv: string } | null {
  const key = getEncryptionKey();
  if (!key) {
    console.error("ENCRYPTION_SECRET is not configured");
    return null;
  }

  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });

  let encrypted = cipher.update(plaintext, "utf8", "base64");
  encrypted += cipher.final("base64");

  // Append the auth tag to the encrypted data
  const authTag = cipher.getAuthTag();
  const encryptedWithTag = Buffer.concat([
    Buffer.from(encrypted, "base64"),
    authTag,
  ]).toString("base64");

  return {
    encrypted: encryptedWithTag,
    iv: iv.toString("base64"),
  };
}

/**
 * Decrypt a string using AES-256-GCM
 * Returns the original plaintext
 */
export function decrypt(encryptedData: string, ivBase64: string): string | null {
  const key = getEncryptionKey();
  if (!key) {
    console.error("ENCRYPTION_SECRET is not configured");
    return null;
  }

  try {
    const iv = Buffer.from(ivBase64, "base64");
    const encryptedBuffer = Buffer.from(encryptedData, "base64");

    // Extract the auth tag from the end of the encrypted data
    const authTag = encryptedBuffer.subarray(-AUTH_TAG_LENGTH);
    const encrypted = encryptedBuffer.subarray(0, -AUTH_TAG_LENGTH);

    const decipher = createDecipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, undefined, "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
}

/**
 * Get the last 4 characters of an API key as a hint
 */
export function getKeyHint(apiKey: string): string {
  if (apiKey.length < 4) {
    return "****";
  }
  return `****${apiKey.slice(-4)}`;
}

/**
 * Validate that an API key looks like a Google GenAI API key
 * Google API keys typically start with "AIza" and are about 39 characters
 */
export function isValidGoogleApiKey(apiKey: string): boolean {
  // Basic validation - Google API keys start with "AIza" and are about 39 chars
  if (!apiKey || apiKey.length < 20) {
    return false;
  }
  // Allow any key that's reasonably long - don't be too strict
  return true;
}
