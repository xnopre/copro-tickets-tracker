import { describe, it, expect } from 'vitest';
import { hashPassword, comparePassword } from './passwordUtils';

describe('passwordUtils', () => {
  describe('hashPassword', () => {
    it('should hash a password and return a salt:hash format', async () => {
      const password = 'mySecurePassword123';
      const hashedPassword = await hashPassword(password);

      expect(hashedPassword).toBeDefined();
      expect(typeof hashedPassword).toBe('string');
      expect(hashedPassword).toMatch(/^[a-f0-9]{32}:[a-f0-9]{64}$/);
    });

    it('should generate different hashes for the same password', async () => {
      const password = 'mySecurePassword123';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });

    it('should handle special characters in passwords', async () => {
      const password = 'P@ssw0rd!#$%^&*()_+-=[]{}|;:,.<>?';
      const hashedPassword = await hashPassword(password);

      expect(hashedPassword).toMatch(/^[a-f0-9]{32}:[a-f0-9]{64}$/);
    });

    it('should handle long passwords', async () => {
      const password = 'a'.repeat(256);
      const hashedPassword = await hashPassword(password);

      expect(hashedPassword).toMatch(/^[a-f0-9]{32}:[a-f0-9]{64}$/);
    });

    it('should handle unicode characters in passwords', async () => {
      const password = 'Pàsswörd123😀';
      const hashedPassword = await hashPassword(password);

      expect(hashedPassword).toMatch(/^[a-f0-9]{32}:[a-f0-9]{64}$/);
    });
  });

  describe('comparePassword', () => {
    it('should return true for matching passwords', async () => {
      const password = 'mySecurePassword123';
      const hashedPassword = await hashPassword(password);

      const isMatch = await comparePassword(password, hashedPassword);

      expect(isMatch).toBe(true);
    });

    it('should return false for non-matching passwords', async () => {
      const password = 'mySecurePassword123';
      const hashedPassword = await hashPassword(password);

      const isMatch = await comparePassword('wrongPassword', hashedPassword);

      expect(isMatch).toBe(false);
    });

    it('should return false for invalid hash format', async () => {
      const isMatch = await comparePassword('password', 'invalid-hash');

      expect(isMatch).toBe(false);
    });

    it('should return false for empty hash', async () => {
      const isMatch = await comparePassword('password', '');

      expect(isMatch).toBe(false);
    });

    it('should return false for hash without salt', async () => {
      const isMatch = await comparePassword(
        'password',
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
      );

      expect(isMatch).toBe(false);
    });

    it('should be case-sensitive', async () => {
      const password = 'MySecurePassword123';
      const hashedPassword = await hashPassword(password);

      const isMatch = await comparePassword('mysecurepassword123', hashedPassword);

      expect(isMatch).toBe(false);
    });

    it('should handle special characters in password comparison', async () => {
      const password = 'P@ssw0rd!#$%^&*()_+-=[]{}|;:,.<>?';
      const hashedPassword = await hashPassword(password);

      const isMatch = await comparePassword(password, hashedPassword);

      expect(isMatch).toBe(true);
    });

    it('should handle unicode characters in password comparison', async () => {
      const password = 'Pàsswörd123😀';
      const hashedPassword = await hashPassword(password);

      const isMatch = await comparePassword(password, hashedPassword);

      expect(isMatch).toBe(true);
    });

    it('should handle long passwords in comparison', async () => {
      const password = 'a'.repeat(256);
      const hashedPassword = await hashPassword(password);

      const isMatch = await comparePassword(password, hashedPassword);

      expect(isMatch).toBe(true);
    });

    it('should return false for tampered hash (modified salt)', async () => {
      const password = 'mySecurePassword123';
      const hashedPassword = await hashPassword(password);

      const [salt, hash] = hashedPassword.split(':');
      const firstChar = salt[0];
      const replacementChar = firstChar === 'f' ? '0' : 'f';
      const tamperedHash = replacementChar + salt.slice(1) + ':' + hash;

      const isMatch = await comparePassword(password, tamperedHash);

      expect(isMatch).toBe(false);
    });

    it('should return false for tampered hash (modified hash part)', async () => {
      const password = 'mySecurePassword123';
      const hashedPassword = await hashPassword(password);

      const [salt, hash] = hashedPassword.split(':');
      const firstChar = hash[0];
      const replacementChar = firstChar === 'f' ? '0' : 'f';
      const tamperedHash = salt + ':' + replacementChar + hash.slice(1);

      const isMatch = await comparePassword(password, tamperedHash);

      expect(isMatch).toBe(false);
    });
  });
});
