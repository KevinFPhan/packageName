import { defineIntegration, createResolver, addVirtualImports } from 'astro-integration-kit';
import { remarkReadingTime } from "./utils/remark-reading-time.mjs";
import { remarkAddAnchor } from "./utils/remark-add-anchor.mjs";
import { UserConfigSchema } from './schema/UserConfigSchema';
import rehypeKatex from "rehype-katex"
import rehypeExternalLinks from "rehype-external-links"
import remarkMath from "remark-math"

export const integration = defineIntegration({
    name: 'package-name',
    optionsSchema: UserConfigSchema,
    setup: ({
        name,
        options,
    }) => {
        return {
            hooks: {
                "astro:config:setup": (params) => {
                    const { injectRoute, config, updateConfig } = params;
                    const { resolve } = createResolver(import.meta.url);
                    const { resolve: rootResolve } = createResolver(config.root.pathname);

                    // Define routes
                    injectRoute({
                        pattern: '/blog/tag/[tag]/[...page]',
                        entrypoint: resolve('./pages/tag/[...page].astro'),
                    });
                    injectRoute({
                        pattern: '/blog/[...page]',
                        entrypoint: resolve('./pages/[...page].astro'),
                    });
                    injectRoute({
                        pattern: '/blog/[...slug]',
                        entrypoint: resolve('./pages/[...slug].astro'),
                    });

                    // Logo module configuration
                    let logoModule = 'export const logos = { light: null, dark: null };';
                    if (options.logo) {
                        if ('src' in options.logo) {
                            logoModule = `import src from "${rootResolve(options.logo.src)}"; export const logos = { light: src, dark: src };`;
                        } else if ('light' in options.logo) {
                            logoModule = `import light from "${rootResolve(options.logo.light)}"; import dark from "${rootResolve(options.logo.dark)}"; export const logos = { light, dark };`;
                        }
                    }

                    // Layout component path configuration
                    const layoutComponentPath = options.layoutComponent
                        ? rootResolve(options.layoutComponent)
                        : resolve('./components/Layouts/LayoutBlog.astro');

                    // Add virtual imports
                    addVirtualImports(params, {
                        name,
                        imports: {
                            'virtual:package-name/user-config': `export default ${JSON.stringify(options)};`,
                            'virtual:package-name/components': `export { default as Layout } from "${layoutComponentPath}";`,
                            'virtual:package-name/user-images': logoModule,
                        }
                    });

                    // Update config with markdown settings
                    updateConfig({
                        markdown: {
                            shikiConfig: {
                                // themes: {
                                //     light: "github-light",
                                //     dark: "github-dark",
                                // },
                                transformers: [
                                    {
                                        preprocess(code: string, { lang }: { lang?: string }) {
                                            return code;
                                        },
                                        root(node: any) {
                                            if (node.tagName === "pre") {
                                                node.tagName = "figure";
                                                node.properties = {
                                                    ...node.properties,
                                                    className: ["highlight", node.properties.lang || ""],
                                                };
                                            }
                                        },
                                        pre(node: any) {
                                            const toolsDiv = {
                                                type: "element",
                                                tagName: "div",
                                                properties: { className: ["highlight-tools"] },
                                                children: [
                                                    {
                                                        type: "element",
                                                        tagName: "div",
                                                        properties: { className: ["code-lang"] },
                                                        children: [
                                                            {
                                                                type: "text",
                                                                value: (node.properties?.lang || "").toUpperCase(),
                                                            },
                                                        ],
                                                    },
                                                ],
                                            };

                                            const lineNumberCode = {
                                                type: "element",
                                                tagName: "code",
                                                children: [],
                                            };

                                            const lineNumberPre = {
                                                type: "element",
                                                tagName: "pre",
                                                properties: { className: ["frosti-code", "gutter"] },
                                                children: [lineNumberCode],
                                            };

                                            const codeContentPre = {
                                                type: "element",
                                                tagName: "pre",
                                                properties: { className: ["frosti-code", "code"] },
                                                children: [],
                                            };

                                            node.children.forEach((lineNode: any, index: number) => {
                                                lineNumberCode.children.push({
                                                    type: "element",
                                                    tagName: "div",
                                                    properties: { className: ["line"] },
                                                    children: [{ type: "text", value: String(index + 1) }],
                                                });

                                                codeContentPre.children.push(lineNode);
                                            });

                                            const table = {
                                                type: "element",
                                                tagName: "div",
                                                properties: { className: ["highlight-code"] },
                                                children: [lineNumberPre, codeContentPre],
                                            };

                                            return {
                                                type: "element",
                                                tagName: "figure",
                                                properties: { className: ["highlight", node.properties?.lang || ""] },
                                                children: [toolsDiv, table],
                                            };
                                        },
                                    },
                                ],
                            },
                            remarkPlugins: [remarkAddAnchor, remarkReadingTime, remarkMath],
                            rehypePlugins: [
                            rehypeKatex,
                            [
                                rehypeExternalLinks,
                                {
                                content: {
                                    type: "element",
                                    tagName: "svg",
                                    properties: {
                                    width: "1em",
                                    height: "1em",
                                    viewBox: "0 0 24 24",
                                    fill: "none",
                                    xmlns: "http://www.w3.org/2000/svg",
                                    },
                                    children: [
                                    {
                                        type: "element",
                                        tagName: "g",
                                        properties: {
                                        id: "SVGRepo_bgCarrier",
                                        "stroke-width": "0",
                                        },
                                        children: [],
                                    },
                                    {
                                        type: "element",
                                        tagName: "g",
                                        properties: {
                                        id: "SVGRepo_tracerCarrier",
                                        "stroke-linecap": "round",
                                        "stroke-linejoin": "round",
                                        },
                                        children: [],
                                    },
                                    {
                                        type: "element",
                                        tagName: "g",
                                        properties: {
                                        id: "SVGRepo_iconCarrier",
                                        },
                                        children: [
                                        {
                                            type: "element",
                                            tagName: "g",
                                            properties: {
                                            id: "SVGRepo_iconCarrier",
                                            },
                                            children: [
                                            {
                                                type: "element",
                                                tagName: "path",
                                                properties: {
                                                d: "M10.0002 5H8.2002C7.08009 5 6.51962 5 6.0918 5.21799C5.71547 5.40973 5.40973 5.71547 5.21799 6.0918C5 6.51962 5 7.08009 5 8.2002V15.8002C5 16.9203 5 17.4801 5.21799 17.9079C5.40973 18.2842 5.71547 18.5905 6.0918 18.7822C6.5192 19 7.07899 19 8.19691 19H15.8031C16.921 19 17.48 19 17.9074 18.7822C18.2837 18.5905 18.5905 18.2839 18.7822 17.9076C19 17.4802 19 16.921 19 15.8031V14M20 9V4M20 4H15M20 4L13 11",
                                                stroke: "#888",
                                                "stroke-width": "2",
                                                "stroke-linecap": "round",
                                                "stroke-linejoin": "round",
                                                },
                                                children: [],
                                            },
                                            ],
                                        },
                                        ],
                                    },
                                    ],
                                },
                                },
                            ],
                            ],
                        },
                    });
                },
                "astro:config:done": (params) => {
                    const { config } = params;
                    const { resolve } = createResolver(import.meta.url);
                    const { resolve: rootResolve } = createResolver(config.root.pathname);

                    const layoutComponentPath = options.layoutComponent
                        ? rootResolve(options.layoutComponent)
                        : resolve('./components/Layouts/LayoutBlog.astro');

                    const astroBlogDts = `
                        declare module 'virtual:package-name/user-config' {
                            const userConfig: import("${resolve('./schema/UserConfigSchema')}").AstroBlogUserConfig;
                            export default userConfig;
                        }

                        declare module 'virtual:package-name/user-images' {
                            const logosConfig: import("${resolve('./schema/LogosSchema')}").LogosConfig;
                            export const logos: logosConfig;
                        }

                        declare module 'virtual:package-name/components' {
                            export const Layout: typeof import("${layoutComponentPath}").default;
                        }
                    `;

                    params.injectTypes({
                        filename: "package-name.d.ts",
                        content: astroBlogDts,
                    });
                },
            },
        };
    },
});

export { type AstroBlogLayoutProps } from './types/LayoutProps';
