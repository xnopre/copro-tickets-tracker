/**
 * Web Crypto API utilities for password hashing and comparison
 * Uses PBKDF2 with SHA-256 for key derivation
 */

const SALT_LENGTH = 16; // 128 bits
const HASH_LENGTH = 32; // 256 bits
const ITERATIONS = 100000; // PBKDF2 iterations for security

/**
 * Generate a cryptographically secure random salt
 */
function generateSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
}

/**
 * Convert Uint8Array to hex string
 */
function toHex(buffer: Uint8Array): string {
  return Array.from(buffer)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Convert hex string to Uint8Array
 */
function fromHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Constant-time string comparison to prevent timing attacks
 * Compares all characters without early exit
 */
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Hash a password using PBKDF2 with SHA-256
 * Returns a string combining salt and hash (salt:hash)
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = generateSalt();

  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      hash: 'SHA-256',
      iterations: ITERATIONS,
    },
    await crypto.subtle.importKey('raw', passwordBuffer as BufferSource, 'PBKDF2', false, [
      'deriveBits',
    ]),
    HASH_LENGTH * 8 // Convert bytes to bits (256 bits = 32 bytes)
  );

  const hashArray = new Uint8Array(hashBuffer);

  const saltHex = toHex(salt);
  const hashHex = toHex(hashArray);

  return `${saltHex}:${hashHex}`;
}

/**
 * Compare a plaintext password with a hashed password
 */
export async function comparePassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    const [saltHex, hashHex] = hashedPassword.split(':');

    if (!saltHex || !hashHex) {
      return false;
    }

    const salt = fromHex(saltHex);

    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(plainPassword);

    const derivedHashBuffer = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt as BufferSource,
        hash: 'SHA-256',
        iterations: ITERATIONS,
      },
      await crypto.subtle.importKey('raw', passwordBuffer as BufferSource, 'PBKDF2', false, [
        'deriveBits',
      ]),
      HASH_LENGTH * 8 // Convert bytes to bits (256 bits = 32 bytes)
    );

    const derivedHashArray = new Uint8Array(derivedHashBuffer);
    const derivedHashHex = toHex(derivedHashArray);

    return constantTimeEqual(derivedHashHex, hashHex);
  } catch {
    return false;
  }
}
