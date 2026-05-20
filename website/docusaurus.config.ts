import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// =============================================================================
// docusaurus.config.ts - Configurazione principale di Docusaurus
// =============================================================================
// Questo file controlla: titoli, percorso base, sidebar, preset (docs/blog/theme),
// navbar/footer, theme e syntax highlighting.
// Per dettagli: https://docusaurus.io/docs/api/docusaurus-config

/**
 * File di configurazione per Docusaurus del progetto server-portfolio.
 * Esegue in Node.js - Non utilizzare API lato client (browser).
 */

const config: Config = {
  // Titolo del sito che apparirà nella tab del browser e nella navbar
  title: 'Server Portfolio',
  // Slogan o descrizione breve sotto il titolo
  tagline: 'Documentazione tecnica per il Backend di Progetto',
  // Path dell'icona del sito (favicon)
  favicon: 'img/favicon.ico',

  // Flag per la compatibilità futura (Docusaurus v4)
  future: {
    v4: true,
  },

  // URL di produzione del sito. Se usi GitHub Pages, di solito è https://<username>.github.io
  url: 'https://Smailen5.github.io',
  // Pathbase del sito. Per GitHub Pages di solito è '/<nome-repo>/'
  baseUrl: '/server-portfolio/',

  // Configurazione per il deployment su GitHub Pages
  organizationName: 'Smailen5', // Il tuo username GitHub
  projectName: 'server-portfolio', // Il nome del repository

  // Cosa fare se Docusaurus trova link interrotti durante il build
  onBrokenLinks: 'throw',

  // Configurazione lingua (default italiano)
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
          // Riferimento al repository per permettere agli utenti di editare le pagine
          editUrl:
            'https://github.com/Smailen5/server-portfolio/tree/main/website/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl:
            'https://github.com/Smailen5/server-portfolio/tree/main/website/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          // Path del file CSS custom per le personalizzazioni grafiche
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Immagine per i social card (Open Graph)
    image: 'img/docusaurus-social-card.jpg',
    // Modalità colore: rispetta le preferenze del sistema dell'utente
    colorMode: {
      respectPrefersColorScheme: true,
    },
    // Configurazione della barra di navigazione superiore
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
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/Smailen5/server-portfolio',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    // Configurazione del footer del sito
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
        {
          title: 'Altro',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Smailen Vargas. Built with Docusaurus.`,
    },
    // Temi per l'evidenziazione del codice
    // =============================================================================
    // PRISM - Syntax Highlighting per codice
    // =============================================================================
    
    prism: {
      theme: prismThemes/github,      // Tema luce predefinito (GitHub)
      darkTheme: prismThemes.dracula, // Tema scuro (Dracula)
      additionalLanguages: ['bash',   // Lingaggi extra da evidenziare
                            'powershell',
                            'docker']  // Aggiungi altri qui: cpp, java, javascript, etc.
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
