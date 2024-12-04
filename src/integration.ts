import { defineIntegration, createResolver, addVirtualImports} from 'astro-integration-kit'
import { remarkReadingTime } from "./utils/remark-reading-time.mjs"
import { remarkAddAnchor } from "./utils/remark-add-anchor.mjs"
import { UserConfigSchema } from './schema/UserConfigSchema'

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

                    // injectRoute({
                    //     pattern: '/blog',
                    //     entrypoint: resolve('./pages/blog.astro'),
                    // });

                    // injectRoute({
                    //     pattern: '/blog/[page]',
                    //     entrypoint: resolve('./pages/[page].astro'),
                    // });

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



                    let logoModule = 'export const logos = { light: null, dark: null };';

                    if (options.logo) {
                        if ('src' in options.logo) {
                            logoModule = `import src from "${ rootResolve(options.logo.src) }"; export const logos = { light: src, dark: src };`;
                        } else if ('light' in options.logo) {
                            logoModule = `import light from "${ rootResolve(options.logo.light) }"; import dark from "${ rootResolve(options.logo.dark) }"; export const logos = { light, dark };`;
                        }
                    }

                    let layoutComponentPath;

                    if (options.layoutComponent) {
                        layoutComponentPath = rootResolve(options.layoutComponent);
                    } else {
                        layoutComponentPath = resolve('./components/Layouts/LayoutBlog.astro');
                    }

                    addVirtualImports(params, {
                        name,
                        imports: {
                            'virtual:package-name/user-config': `export default ${ JSON.stringify(options) }`,
                            'virtual:package-name/components': `export { default as Layout } from "${ layoutComponentPath }";`,
                            'virtual:package-name/user-images': logoModule,
                        }
                    });

          updateConfig({
            markdown: {
              remarkPlugins: [
                remarkAddAnchor,
                remarkReadingTime,
              ],
            },
          });

                },
								"astro:config:done": (params) => {
									const {  config } = params;
									const { resolve } = createResolver(import.meta.url);
									    const { resolve: rootResolve } = createResolver(config.root.pathname);
									                    let layoutComponentPath;

                    if (options.layoutComponent) {
                        layoutComponentPath = rootResolve(options.layoutComponent);
                    } else {
                        layoutComponentPath = resolve('./components/Layouts/LayoutBlog.astro');
                    }

                    


                    const astroBlogDts = `
                        declare module 'virtual:package-name/user-config' {
                            const userConfig: import("${ resolve('./schema/UserConfigSchema') }").AstroBlogUserConfig;

                            export default userConfig;
                        }

                        declare module 'virtual:package-name/user-images' {
                            const logosConfig: import("${ resolve('./schema/LogosSchema') }").LogosConfig;

                            export const logos: logosConfig;
                        }

                        declare module 'virtual:package-name/components' {
                            export const Layout: typeof import("${ layoutComponentPath }").default
                        }
                    `;

									    params.injectTypes({
												filename: "package-name.d.ts",
												content: astroBlogDts
											})
								}
            }
        }
    },
})

export { type AstroBlogLayoutProps } from './types/LayoutProps'