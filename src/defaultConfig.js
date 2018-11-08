module.exports = {
  distDir: '.next/production',
  assetPrefix: '',
  inlineImageLimit: 8192,
  cssLocalIdentName: '[hash:base64:5]',
  targets: {
    browsers: ['iOS >= 8', 'Android >= 4.4', 'last 2 QQAndroid versions'],
    node: '6',
  },
  native: {},
  env: {
    development: {
      distDir: '.next/development',
      inlineImageLimit: 1,
      cssLocalIdentName: '[local]-[hash:base64:5]',
    },
  },
};
