import { LIMITS, REGEX } from './constants';

export type ValidationResult =
  | { ok: true }
  | { ok: false; error: string };

export const validators = {
  required(value: unknown, label = 'Field'): ValidationResult {
    if (value === null || value === undefined || `${value}`.trim() === '') {
      return { ok: false, error: `${label} is required.` };
    }
    return { ok: true };
  },

  email(value: string, label = 'Email'): ValidationResult {
    if (!value) return { ok: false, error: `${label} is required.` };
    if (!REGEX.email.test(value)) return { ok: false, error: `Enter a valid ${label.toLowerCase()}.` };
    return { ok: true };
  },

  password(value: string, opts?: { min?: number; max?: number; requireSimple?: boolean }): ValidationResult {
    const min = opts?.min ?? LIMITS.passwordMin;
    const max = opts?.max ?? LIMITS.passwordMax;
    if (!value) return { ok: false, error: 'Password is required.' };
    if (value.length < min) return { ok: false, error: `Password must be at least ${min} characters.` };
    if (value.length > max) return { ok: false, error: `Password must be at most ${max} characters.` };
    if (opts?.requireSimple ?? true) {
      if (!REGEX.passwordSimple.test(value)) {
        return { ok: false, error: 'Password must include a letter and a number.' };
      }
    }
    return { ok: true };
  },

  phone(value: string, label = 'Phone'): ValidationResult {
    if (!value) return { ok: false, error: `${label} is required.` };
    const digits = value.replace(/\D/g, '');
    if (!REGEX.phoneDigits.test(digits)) {
      return { ok: false, error: `Enter a valid ${label.toLowerCase()}.` };
    }
    return { ok: true };
  },

  maxLength(value: string, max: number, label = 'Field'): ValidationResult {
    if (value?.length > max) return { ok: false, error: `${label} must be ≤ ${max} characters.` };
    return { ok: true };
  },
};

// Optional helpers
export function validateAll(...results: ValidationResult[]): ValidationResult {
  const firstError = results.find(r => !r.ok);
  return firstError ?? { ok: true };
}
