import { describe, expect, it } from 'vitest';
import {
  MAX_DAILY_REQUESTS,
  createUpdatedUsage,
  getRemainingRequests,
  isRequestAllowed,
  parseStoredUsage,
} from './rateLimitUtils';

describe('Caso de uso: control de límite diario de solicitudes IA', () => {
  const today = '2026-04-21';

  describe('Pruebas unitarias', () => {
    it('calcula solicitudes restantes y permisos correctamente', () => {
      expect(getRemainingRequests(0)).toBe(MAX_DAILY_REQUESTS);
      expect(getRemainingRequests(MAX_DAILY_REQUESTS)).toBe(0);
      expect(isRequestAllowed(MAX_DAILY_REQUESTS - 1)).toBe(true);
      expect(isRequestAllowed(MAX_DAILY_REQUESTS)).toBe(false);
    });

    it('reinicia conteo cuando la fecha almacenada no coincide', () => {
      const stored = JSON.stringify({ date: '2026-04-20', count: 14 });
      expect(parseStoredUsage(stored, today)).toEqual({ date: today, count: 0 });
    });
  });

  describe('Pruebas de integración', () => {
    it('simula flujo de lectura + incremento + cálculo de restantes', () => {
      const stored = JSON.stringify({ date: today, count: 2 });
      const current = parseStoredUsage(stored, today);
      const updated = createUpdatedUsage(current.count, today);
      const remaining = getRemainingRequests(updated.count);

      expect(updated).toEqual({ date: today, count: 3 });
      expect(remaining).toBe(MAX_DAILY_REQUESTS - 3);
      expect(isRequestAllowed(updated.count)).toBe(true);
    });
  });
});
