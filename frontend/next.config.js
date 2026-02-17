const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
})

module.exports = withPWA({
  // Keep config minimal and compatible with Next 16/Turbopack
  // If you need to opt out of Turbopack you can set the build flag instead.
  turbopack: {},
})
