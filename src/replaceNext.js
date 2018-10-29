const path = require('path');

/**
 * @param {Object} nextConfig
 */
module.exports = (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      if (!options.defaultLoaders) {
        throw new Error(
          'This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade'
        );
      }

      const { dev, isServer } = options;

      if (dev) {
        // 解决有些移动端的应用根据 URL 缓存静态资源的问题
        // https://github.com/zeit/next.js/blob/7.0.2/build/webpack.js#L198
        config.output.chunkFilename = isServer
          ? ''.concat('[name].[contenthash]', '.js')
          : 'static/chunks/'.concat('[name].[contenthash]', '.js');
      }

      // 定制 Next.js，使用自定义的 next 替换官方的模块
      const nextRoot = path.resolve(__dirname, '../vendors/next');
      config.resolve = config.resolve || {};
      config.resolve.alias = config.resolve.alias || {};
      config.resolve.alias.next = nextRoot;
      const replaceEntry = entry => {
        if (/next-dev(\.js)?$/.test(entry)) {
          return path.resolve(nextRoot, 'dist/client/next-dev.js');
        }
        if (/next(\.js)?$/.test(entry)) {
          return path.resolve(nextRoot, 'dist/client/next.js');
        }
        return entry;
      };
      const replaceEntries = entries => {
        if (Array.isArray(entries)) {
          return entries.map(replaceEntry);
        }
        return replaceEntry(entries);
      };
      const originalEntry = config.entry;
      config.entry = async () => {
        let entry = await originalEntry();
        if (typeof entry === 'string' || Array.isArray(entry)) {
          entry = replaceEntries(entry);
        } else if (typeof entry === 'object') {
          entry = Object.keys(entry).reduce((rcc, key) => {
            rcc[key] = replaceEntries(entry[key]);
            return rcc;
          }, {});
        }
        return entry;
      };

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  });
};
