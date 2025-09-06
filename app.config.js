import 'dotenv/config';
export default {
  expo: {
    name: 'Drinks Nepal',
    slug: 'drinksNepal',
    scheme: 'drinksNepal',
    version: '2.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'cover',
      backgroundColor: '#ffffff',
    },
    updates: {
      fallbackToCacheTimeout: 0,
      url: 'https://u.expo.dev/c853daa0-5547-4c99-9190-637d5b10a2c0',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.drinks.nepal',
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          'This app needs access to location when open to track delivery.',
        NSLocationAlwaysAndWhenInUseUsageDescription:
          'This app needs access to location when open to track delivery.',
        UIBackgroundModes: ['location'],
      },
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API,
      },
    },
    android: {
      permissions: [
        'ACCESS_FINE_LOCATION',
        'ACCESS_COARSE_LOCATION',
        'android.permission.ACCESS_COARSE_LOCATION',
        'android.permission.ACCESS_FINE_LOCATION',
        'INTERNET',
        'ACCESS_BACKGROUND_LOCATION',
      ],
      adaptiveIcon: {
        foregroundImage: './assets/images/icon.png',
        backgroundColor: '#FFFFFF',
      },
      package: 'com.drinks.nepal',
      googleServicesFile: './google-services.json',
      softwareKeyboardLayoutMode: 'pan',
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API,
        },
      },
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: [
      [
        'expo-location',
        {
          locationAlwaysAndWhenInUsePermission: 'Allow $(PRODUCT_NAME) to use your location.',
        },
      ],
    ],
    extra: {
      eas: {
        projectId: 'c853daa0-5547-4c99-9190-637d5b10a2c0',
      },
    },
    runtimeVersion: {
      policy: 'sdkVersion',
    },
  },
};
