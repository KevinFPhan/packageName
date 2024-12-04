import { z } from 'astro/zod';

export const TagSchema = z.array(z.string());

export type TagSchemaRaw = z.infer<typeof TagSchema>