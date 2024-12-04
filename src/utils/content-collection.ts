import { getEntry, getEntries } from 'astro:content';
import { type ArticleSchemaTransformed, type ArticleContentCollectionData } from '../schema/ArticleSchema'
import { type TagSchemaRaw } from '../schema/TagSchema';
import { type AuthorSchemaRaw } from '../schema/AuthorSchema';

export const transformContentCollection = async (contentCollectionData: ArticleContentCollectionData): Promise<ArticleSchemaTransformed> => {

	const data = contentCollectionData.data
	let author: AuthorSchemaRaw
	let tags: TagSchemaRaw[] = []

	if (data.author) {
		author = (await getEntry('author', data.author)).data as AuthorSchemaRaw
	}

	// if (data.tags) {
	// 	tags = (await getEntries(data.tags.map(slug => ({ collection: 'tag', slug, }))))
	// 		.map(tag => ({
	// 			tag: tag.slug,
	// 			bgColor: tag.data.bgColor,
	// 			textColor: tag.data.textColor,
	// 		}))
	// }

    if (data.tags) {
        tags = data.tags; // Directly use the tags from the blog collection
    }


    return {
        title: data.title,
        description: data.description,
        slug: contentCollectionData.slug,
        link: `/blog/${ contentCollectionData.slug }`,
        date: data.date?.toDateString(),
        imageSrc: data.imageSrc !== undefined ? data.imageSrc satisfies ImageMetadata : undefined,
        imageAlt: data.imageAlt,
        author,
        tags,
        draft: data.draft,
        render: contentCollectionData.render,
        id: contentCollectionData.id,
        seo: data.seo,
        featured: data.featured,
    } satisfies ArticleSchemaTransformed;
}
