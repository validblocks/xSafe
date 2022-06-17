const path = require(`path`);

module.exports = {
  webpack: {
    alias: {
      src: path.resolve(__dirname, "src"),
      components: path.resolve(__dirname, "src/components"),
      pages: path.resolve(__dirname, "src/pages"),
      helpers: path.resolve(__dirname, "src/helpers"),
      services: path.resolve(__dirname, "src/services"),
      types: path.resolve(__dirname, "src/types"),
      config: path.resolve(__dirname, "src/config"),
      utils: path.resolve(__dirname, "src/utils"),
      assets: path.resolve(__dirname, "src/assets"),
      i18n: path.resolve(__dirname, "src/i18n"),
      context: path.resolve(__dirname, "src/context"),
      contracts: path.resolve(__dirname, "src/contracts"),
      '@redux': path.resolve(__dirname, "src/redux"),
      apiCalls: path.resolve(__dirname, "src/apiCalls"),
      routes: path.resolve(__dirname, "src/routes"),
    },
  },
};
