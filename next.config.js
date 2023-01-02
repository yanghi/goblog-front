const withLess = require("next-with-less");

/** @type {import('next').NextConfig} */
const nextConfig = withLess({
  reactStrictMode: true,
  lessLoaderOptions: {
    lessOptions: {
      modifyVars: {
        "@primary-color": "#f74a49",
        "@border-radius-base": ".5em"
      }
    }
  }
})


module.exports = nextConfig
