const withPlugins = require('next-compose-plugins');
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');
const withImages = require('next-images');
const withCSS = require('../vendors/next-css');
const withSass = require('../vendors/next-sass');
const withResolve = require('./withResolve');

/**
 * @param {Object} nextConfig
 * @param {Object} nextConfig.css @see https://github.com/zeit/next-plugins/tree/master/packages/next-css#usage
 * @param {Object} nextConfig.sass @see https://github.com/zeit/next-plugins/tree/master/packages/next-sass
 * @param {Object} nextConfig.images @see https://github.com/arefaslani/next-images#options
 * @param {Object} nextConfig.resolve @see https://webpack.js.org/configuration/resolve/#resolve
 */
module.exports = (nextConfig = {}) => {
  return withPlugins(
    [
      [
        withImages,
        {
          inlineImageLimit: 8192,
          [PHASE_DEVELOPMENT_SERVER]: {
            inlineImageLimit: 1,
          },
        },
      ],
      [
        withCSS,
        {
          cssLoaderOptions: {
            url: true,
            import: false,
            localIdentName: '[hash:base64:5]',
          },
          [PHASE_DEVELOPMENT_SERVER]: {
            cssLoaderOptions: {
              localIdentName: '[local]-[hash:base64:5]',
            },
          },
        },
      ],
      [
        withSass,
        {
          cssLoaderOptions: {
            url: true,
            import: false,
            localIdentName: '[hash:base64:5]',
          },
          [PHASE_DEVELOPMENT_SERVER]: {
            cssLoaderOptions: {
              localIdentName: '[local]-[hash:base64:5]',
            },
          },
        },
      ],
      [withResolve, nextConfig.resolve],
    ],
    {
      distDir: '.next/development',
      [PHASE_DEVELOPMENT_SERVER]: {
        distDir: '.next/production',
      },
    }
  );
};
