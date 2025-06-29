// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' https://settling-frog-14.clerk.accounts.dev;
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: https://mermaid.ink;
              font-src 'self';
              connect-src 'self' https://generativelanguage.googleapis.com https://fra.cloud.appwrite.io https://settling-frog-14.clerk.accounts.dev;
              worker-src 'self' blob:;
              base-uri 'self';
              form-action 'self';
              frame-ancestors 'none';
              object-src 'none';
              block-all-mixed-content;
              upgrade-insecure-requests;
            `.replace(/\s{2,}/g, ' ').trim()
          },
        ],
      },
    ];
  },
};

export default nextConfig;