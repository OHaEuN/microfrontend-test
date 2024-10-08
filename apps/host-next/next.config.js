const NextFederationPlugin = require("@module-federation/nextjs-mf");

const remoteNextUrl = process.env.REMOTE_NEXT_URL || `http://localhost:3001`;

// this enables you to use import() and the webpack parser
// loading remotes on demand, not ideal for SSR
const remotes = (isServer) => {
  const location = isServer ? "ssr" : "chunks";
  return {
    remote_next: `remote_next@${remoteNextUrl}/_next/static/${location}/remoteEntry.js`,
  };
};

module.exports = {
  reactStrictMode: true,
  transpilePackages: ["@repo/ui"],
  webpack(config, options) {
    config.plugins.push(
      new NextFederationPlugin({
        name: "host_next",
        filename: "static/chunks/remoteEntry.js",
        exposes: {},
        remotes: remotes(options.isServer),
        shared: {},
        extraOptions: {
          automaticAsyncBoundary: true,
        },
      })
    );

    return config;
  },
};
