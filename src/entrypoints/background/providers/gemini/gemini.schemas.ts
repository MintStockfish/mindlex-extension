import { z } from 'zod';

const geminiContentPartSchema = z
  .object({
    text: z.string().optional(),
  })
  .passthrough();

const geminiCandidateSchema = z
  .object({
    content: z
      .object({
        parts: z.array(geminiContentPartSchema).optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough();

export const geminiGenerateContentResponseSchema = z
  .object({
    candidates: z.array(geminiCandidateSchema).min(1),
  })
  .passthrough();
