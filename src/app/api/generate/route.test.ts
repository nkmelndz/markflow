import { describe, expect, it } from 'vitest';
import { hasValidInstruction, POST } from './route';

describe('Caso de uso: generación asistida por IA', () => {
  describe('Pruebas unitarias', () => {
    it('valida correctamente la instrucción', () => {
      expect(hasValidInstruction('Genera un resumen')).toBe(true);
      expect(hasValidInstruction('   ')).toBe(false);
      expect(hasValidInstruction(undefined)).toBe(false);
    });
  });

  describe('Pruebas de integración', () => {
    it('retorna 400 cuando instruction no está presente', async () => {
      const request = new Request('http://localhost/api/generate', {
        method: 'POST',
        body: JSON.stringify({ context: '# Título' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'Instruction is required' });
    });

    it('retorna mensaje controlado cuando no existe GEMINI_API_KEY', async () => {
      const previousKey = process.env.GEMINI_API_KEY;
      delete process.env.GEMINI_API_KEY;

      const request = new Request('http://localhost/api/generate', {
        method: 'POST',
        body: JSON.stringify({
          instruction: 'Mejora este texto',
          context: '# Nota',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        generatedText: 'Error: GEMINI_API_KEY is not configured in .env.local',
      });

      if (previousKey) {
        process.env.GEMINI_API_KEY = previousKey;
      }
    });
  });
});
