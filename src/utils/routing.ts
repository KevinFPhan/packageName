import { getCollection } from "astro:content"
import { type ArticleSchemaTransformed, type ArticleContentCollectionData } from "../schema/ArticleSchema"
import { transformContentCollection } from "./content-collection"

export async function getArticles() {
    const articlesRaw: Array<ArticleContentCollectionData> = ((await getCollection('blog')) ?? []);

    const sortedArticles = articlesRaw.sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
    let blogArticles: Array<ArticleSchemaTransformed> = [];

    for (const entry of sortedArticles) {
        if (entry.data.draft) {
            continue;
        }

        const { remarkPluginFrontmatter } = await entry.render();

        const transformedEntry = await transformContentCollection(entry as ArticleContentCollectionData);

        blogArticles.push({
            ...transformedEntry,
            remarkPluginFrontmatter: {
                readingTime: remarkPluginFrontmatter.readingTime,
                totalCharCount: remarkPluginFrontmatter.totalCharCount,
            },
        });
    }

    // console.log('blogArticles', blogArticles);
    return blogArticles;
}