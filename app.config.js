const IS_DEV = process.env.APP_VARIANT === "development";
const IS_PREVIEW = process.env.APP_VARIANT === "preview";

const getUniqueIdentifier = () => {
	if (IS_DEV) {
		return "com.giggzze.libertas.dev";
	}

	if (IS_PREVIEW) {
		return "com.giggzze.libertas.preview";
	}

	return "com.giggzze.libertas";
};

const getAppName = () => {
	if (IS_DEV) {
		return "Libertas (Dev)";
	}

	if (IS_PREVIEW) {
		return "Libertas (Preview)";
	}

	return "Libertas";
};

export default ({ config }) => ({
	...config,
	name: getAppName(),
	slug: "libertas",
	version: "1.0.0",
	orientation: "portrait",
	icon: "./assets/images/icon.png",
	scheme: "libertas",
	userInterfaceStyle: "automatic",
	newArchEnabled: true,
	ios: {
		supportsTablet: true,
		bundleIdentifier: getUniqueIdentifier(),
		infoPlist: {
			ITSAppUsesNonExemptEncryption: false,
		},
	},
	android: {
		adaptiveIcon: {
			foregroundImage: "./assets/images/adaptive-icon.png",
			backgroundColor: "#ffffff",
		},
		edgeToEdgeEnabled: true,
		package: getUniqueIdentifier(),
	},
	web: {
		bundler: "metro",
		output: "static",
		favicon: "./assets/images/favicon.png",
	},
	plugins: [
		"expo-router",
		[
			"expo-splash-screen",
			{
				image: "./assets/images/splash-icon.png",
				imageWidth: 200,
				resizeMode: "contain",
				backgroundColor: "#ffffff",
			},
		],
	],
	experiments: {
		typedRoutes: true,
	},
	extra: {
		router: {},
		eas: {
			projectId: "465b9a55-4ffb-4b8b-b25f-c1bac6941529",
		},
	},
	owner: "giggzze",
});
