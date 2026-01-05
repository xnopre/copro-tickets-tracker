/**
 * Node.js crypto utilities for password hashing and comparison
 * Uses PBKDF2 with SHA-256 for key derivation
 */

import { pbkdf2, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const SALT_LENGTH = 16; // 128 bits
const HASH_LENGTH = 32; // 256 bits
const ITERATIONS = 100000; // PBKDF2 iterations for security

const pbkdf2Async = promisify(pbkdf2);

/**
 * Hash a password using PBKDF2 with SHA-256
 * Returns a string combining salt and hash (salt:hash)
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH);
  const hash = await pbkdf2Async(password, salt, ITERATIONS, HASH_LENGTH, 'sha256');
  return salt.toString('hex') + ':' + (hash as Buffer).toString('hex');
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

    const salt = Buffer.from(saltHex, 'hex');
    const hash = await pbkdf2Async(plainPassword, salt, ITERATIONS, HASH_LENGTH, 'sha256');

    const computedHash = (hash as Buffer).toString('hex');
    return timingSafeEqual(Buffer.from(computedHash), Buffer.from(hashHex));
  } catch {
    return false;
  }
}
