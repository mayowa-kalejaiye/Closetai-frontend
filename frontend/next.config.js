const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
})

module.exports = withPWA({
  // Skip ESLint during production builds (Vercel) to avoid incompatible CLI options
  eslint: {
    ignoreDuringBuilds: true,
  },
})
