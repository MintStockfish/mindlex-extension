import { z } from 'zod';

const openAIResponseContentItemSchema = z
  .object({
    type: z.string(),
    text: z.string().optional(),
  })
  .passthrough();

const openAIResponseOutputItemSchema = z
  .object({
    type: z.string(),
    content: z.array(openAIResponseContentItemSchema).optional(),
  })
  .passthrough();

export const openAIResponsesResponseSchema = z
  .object({
    output_text: z.string().optional(),
    output: z.array(openAIResponseOutputItemSchema).optional(),
  })
  .passthrough()
  .refine(
    (response) =>
      typeof response.output_text === 'string' ||
      Array.isArray(response.output),
    {
      message: 'Response must include output_text or output items.',
    },
  );
