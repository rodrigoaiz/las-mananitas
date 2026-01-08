import { defineCollection, z } from 'astro:content';

const articulos = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    emoji: z.string(),
    author: z.string().default('El Tío Mañanitas'),
    image: z.string().optional(),
  }),
});

export const collections = {
  'articulos': articulos,
};
