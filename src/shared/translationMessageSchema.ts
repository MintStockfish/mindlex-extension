import { z } from 'zod';
import {
  TRANSLATE_TEXT_MESSAGE,
  type TranslateTextMessage,
} from '@/shared/translation';

export const translateTextMessagePayloadSchema = z
  .object({
    text: z.string(),
  })
  .passthrough();

export const translateTextMessageSchema = z
  .object({
    type: z.literal(TRANSLATE_TEXT_MESSAGE),
    payload: translateTextMessagePayloadSchema,
  })
  .passthrough();

export function isTranslateTextMessage(
  message: unknown,
): message is TranslateTextMessage {
  return translateTextMessageSchema.safeParse(message).success;
}
