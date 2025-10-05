
const IS_DEV = process.env.NODE_ENV === 'development';
const IS_PREVIEW = process.env.NODE_ENV === 'preview';

const getUniqueIdentifier = () => {
    if (IS_DEV) {
        return 'com.giggzze.libertas.dev';
    }

    if (IS_PREVIEW) {
        return 'com.giggzze.libertas.preview';
    }

    return 'com.giggzze.libertas';
};

const getAppName = () => {
    if (IS_DEV) {
        return 'Libertas (Dev)';
    }

    if (IS_PREVIEW) {
        return 'Libertas (Preview)';
    }

    return 'Libertas';
};

export default ({config } ) => (  {
     ...config,
    "name": getAppName(),
    "slug": "libertas",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "libertas",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": getUniqueIdentifier(),
      "infoPlist": {
        "ITSAppUsesNonExemptEncryption": false
      }
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/images/android-icon-foreground.png",
        "backgroundImage": "./assets/images/android-icon-background.png",
        "monochromeImage": "./assets/images/android-icon-monochrome.png"
      },
      "edgeToEdgeEnabled": true,
      "predictiveBackGestureEnabled": false,
      "package": getUniqueIdentifier()
    },
    "web": {
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff",
          "dark": {
            "backgroundColor": "#000000"
          }
        }
      ],
      "expo-secure-store"
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    },
    "extra": {
      "router": {},
      "eas": {
        "projectId": "370306f1-337b-45b1-8ae6-6a89aa27d2dc"
      }
    }
  })
