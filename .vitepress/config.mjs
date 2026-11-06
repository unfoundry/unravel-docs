import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Unravel',
  description: 'Client-side zero-trust tabular data ingestion, validation, and normalization platform',
  base: process.env.BASE_PATH || '/unravel-docs/',
  lang: 'en-US',
  cleanUrls: true,

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/unravel-docs/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#005eb8' }]
  ],

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Unravel',

    // Built-in offline client-side search
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: 'Search docs',
                buttonAriaLabel: 'Search documentation'
              },
              modal: {
                noResultsText: 'No results found',
                resetButtonTitle: 'Reset search',
                footer: {
                  selectText: 'to select',
                  navigateText: 'to navigate',
                  closeText: 'to close'
                }
              }
            }
          }
        }
      }
    },

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting Started', link: '/getting-started' },
      { text: 'User Guide', link: '/user-guide' },
      { text: 'Developer Guide', link: '/developer-guide' },
      {
        text: 'Architecture',
        items: [
          { text: 'Code Overview', link: '/code-overview' },
          { text: 'Decryption Service', link: '/decryption-service' },
          { text: 'Customization', link: '/customization' },
          { text: 'Privacy & Security', link: '/privacy-policy' },
          { text: 'Screenshots Walkthrough', link: '/screenshots' }
        ]
      },
      { text: 'Deployment', link: '/deployment' },
      {
        text: 'Ecosystem',
        items: [
          { text: 'unravel-ui (Frontend Runner & Studio)', link: 'https://github.com/unfoundry/unravel-ui' },
          { text: 'unravel-service (Headless Python Service)', link: 'https://github.com/unfoundry/unravel-service' },
          { text: 'unravel-docs (Documentation Portal)', link: 'https://github.com/unfoundry/unravel-docs' }
        ]
      }
    ],

    sidebar: [
      {
        text: 'Overview',
        items: [
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'User Guide', link: '/user-guide' },
          { text: 'Screenshots Walkthrough', link: '/screenshots' }
        ]
      },
      {
        text: 'Developer & Schemas',
        items: [
          { text: 'Developer Guide & Schema Spec', link: '/developer-guide' },
          { text: 'Code Overview & Architecture', link: '/code-overview' },
          { text: 'White-Label & Customization', link: '/customization' }
        ]
      },
      {
        text: 'Backend & Operations',
        items: [
          { text: 'XLSX Decryption Gateway', link: '/decryption-service' },
          { text: 'Production Deployment', link: '/deployment' },
          { text: 'Privacy Policy & Zero-Trust Model', link: '/privacy-policy' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/unfoundry/unravel-docs' }
    ],

    footer: {
      message: 'Zero-trust client-side data normalizer suite.',
      copyright: 'Copyright © 2026 Unravel / Unfoundry'
    }
  }
});

