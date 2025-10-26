const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';

// Debug logging
console.log('APP_VARIANT:', process.env.APP_VARIANT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('IS_DEV:', IS_DEV);
console.log('IS_PREVIEW:', IS_PREVIEW);

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

export default ({ config }) => ({
  ...config,
  name: getAppName(),
  ios: {
    ...config.ios,
    bundleIdentifier: getUniqueIdentifier(),
  },
  android: {
    ...config.android,
    package: getUniqueIdentifier(),
  },
});
