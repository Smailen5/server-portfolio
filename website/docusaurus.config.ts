import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Server Portfolio',
  tagline: 'Documentazione tecnica per il Backend di Progetto',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://Smailen5.github.io',
  baseUrl: '/server-portfolio/',

  organizationName: 'Smailen5',
  projectName: 'server-portfolio',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'it',
    locales: ['it'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/Smailen5/server-portfolio/tree/main/website/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Server Portfolio',
      logo: {
        alt: 'Server Portfolio Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentazione',
        },
        {
          href: 'https://github.com/Smailen5/server-portfolio',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Introduzione',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'Link Progetto',
          items: [
            {
              label: 'GitHub Repository',
              href: 'https://github.com/Smailen5/server-portfolio',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Smailen Vargas. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
