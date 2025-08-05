import { z } from 'zod';

export const booksZodSchema = z.object({
  title: z.string(),
  author: z.string(),
  genre: z.string(),
  isbn: z.string(),
  description: z.string().optional(),
  copies: z.number().min(1, 'Copies must be a positive number'),
  available: z.boolean(),
});
