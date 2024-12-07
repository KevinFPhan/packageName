import { getEntry, getEntries } from 'astro:content';
import { type ArticleSchemaTransformed, type ArticleContentCollectionData } from '../schema/ArticleSchema'
import { type TagSchemaRaw } from '../schema/TagSchema';

export const transformContentCollection = async (contentCollectionData: ArticleContentCollectionData): Promise<ArticleSchemaTransformed> => {

	const data = contentCollectionData.data
    console.log('contentCollectionData', contentCollectionData);
    let author = ''
	let tags: TagSchemaRaw[] = []

	if (data.author) {
		author = data.author
	}


    if (data.tags) {
        tags = data.tags; // Directly use the tags from the blog collection
    }


    return {
        title: data.title,
        description: data.description,
        slug: contentCollectionData.slug,
        link: `/blog/${ contentCollectionData.slug }`,
        date: data.date?.toDateString(),
        imageSrc: data.imageSrc,
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
