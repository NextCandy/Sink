export default defineAppConfig({
  title: 'Sink',
  github: 'https://github.com/NextCandy/Sink',
  coffee: '',
  twitter: '',
  telegram: 'https://t.me/WGCCC',
  email: 'mailto:955555@gmail.com',
  blog: 'https://timeamber.com',
  description: 'A Simple / Speedy / Secure Link Shortener with Analytics, 100% run on Cloudflare.',
  image: 'https://ue.lc/banner.png',
  previewTTL: 300, // 5 minutes
  slugRegex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/i,
  reserveSlug: [
    'dashboard',
  ],
})
