import { z } from 'astro/zod'

import { type AuthorSchemaRaw } from './AuthorSchema';
import { TagSchema } from './TagSchema';
import { SEOSchema } from './SEOSchema';

export const ArticleSchema = ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    draft: z.boolean().default(false),

    /**
     * A string of the unique id of the author
     */
    author: z.string().optional(),
    date: z.date().optional(),
    tags: z.array(z.string()).optional(),
    imageSrc: image().optional(),
    imageAlt: z.string().default('').optional(),
    seo: SEOSchema.optional(),
    featured: z.boolean().default(false),
    time: z.string().optional(),
    word: z.string().optional(),
})

export type ArticleSchemaRaw = Omit<z.infer<ReturnType<typeof ArticleSchema>>, 'imageSrc'> & {
    imageSrc: ImageMetadata;
}

export type ArticleSchemaTransformed = Omit<ArticleSchemaRaw, 'date' | 'author' | 'tags'> & {
    date: string;
    slug: string;
    link: string;
    render: Function;
    id: string;
    author: AuthorSchemaRaw,
    tags: Array<z.infer<typeof TagSchema>>,
}

export type ArticleContentCollectionData = {
    id: string;
    slug: string;
    body: string;
    collection: string;
    render: Function;
    data: ArticleSchemaRaw;
}
