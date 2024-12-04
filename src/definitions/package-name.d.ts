declare module 'virtual:package-name/user-config' {
	const userConfig: import ('../schema/UserConfigSchema').AstroBlogUserConfig;

	export default config as userConfig;
}

declare module 'virtual:package-name/user-images' {
	const logosConfig: import ('../schema/LogosSchema').LogosConfig;

	export default logos as logosConfig;
}
