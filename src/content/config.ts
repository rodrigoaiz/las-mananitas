import { defineCollection, z } from 'astro:content';

const articulos = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    dateModified: z.date().optional(),
    emoji: z.string(),
    author: z.string().default('El Tío Mañanitas'),
    image: z.string().optional(),
    seoTitle: z.string().optional(),
    draft: z.boolean().default(false),
    redirectTo: z.string().optional(),
  }),
});

export const collections = {
  'articulos': articulos,
};
