/**
 * @param {Object} nextConfig
 * @param {Object} nextConfig.alias
 */
module.exports = (nextConfig = {}) => {
  const { alias, ...newConfig } = nextConfig;
  return Object.assign(newConfig, {
    webpack(config, options) {
      if (!options.defaultLoaders) {
        throw new Error(
          'This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade'
        );
      }

      config.resolve = config.resolve || {};

      if (alias) {
        config.resolve.alias = Object.assign({}, config.resolve.alias, alias);
      }

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  });
};
