import { describe, it, expect } from 'vitest';
import UserModel from './UserSchema';

describe('UserSchema', () => {
  it('should have required fields', () => {
    const schema = UserModel.schema;

    expect(schema.path('firstName')).toBeDefined();
    expect(schema.path('firstName').isRequired).toBe(true);

    expect(schema.path('lastName')).toBeDefined();
    expect(schema.path('lastName').isRequired).toBe(true);

    expect(schema.path('email')).toBeDefined();
    expect(schema.path('email').isRequired).toBe(true);
  });

  it('should have email field with unique constraint', () => {
    const schema = UserModel.schema;

    const emailPath = schema.path('email');
    expect(emailPath.options.unique).toBe(true);
    expect(emailPath.options.lowercase).toBe(true);
  });

  it('should trim string fields', () => {
    const schema = UserModel.schema;

    expect(schema.path('firstName').options.trim).toBe(true);
    expect(schema.path('lastName').options.trim).toBe(true);
    expect(schema.path('email').options.trim).toBe(true);
  });

  it('should have maxlength constraints', () => {
    const schema = UserModel.schema;

    expect(schema.path('firstName').options.maxlength).toBe(50);
    expect(schema.path('lastName').options.maxlength).toBe(50);
    expect(schema.path('email').options.maxlength).toBe(100);
  });
});
