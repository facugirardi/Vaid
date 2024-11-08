import nextPWA from 'next-pwa';

const withPWA = nextPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

const nextConfig = {
  images: {
    domains: ['localhost'],
  },
};

export default withPWA(nextConfig);
