import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ConvoForms - AI-Powered Conversational Forms',
    short_name: 'ConvoForms',
    description:
      'Create engaging conversational forms with AI in seconds. Boost completion rates by 300%.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#8b5cf6',
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'en',
    categories: ['business', 'productivity', 'utilities'],
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    screenshots: [
      {
        src: '/screenshot-wide.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
      },
      {
        src: '/screenshot-narrow.png',
        sizes: '640x1136',
        type: 'image/png',
        form_factor: 'narrow',
      },
    ],
    shortcuts: [
      {
        name: 'Create New Form',
        short_name: 'New Form',
        description: 'Create a new conversational form',
        url: '/app/new',
        icons: [
          {
            src: '/shortcut-new.png',
            sizes: '96x96',
            type: 'image/png',
          },
        ],
      },
      {
        name: 'View Analytics',
        short_name: 'Analytics',
        description: 'View form analytics and insights',
        url: '/app/analytics',
        icons: [
          {
            src: '/shortcut-analytics.png',
            sizes: '96x96',
            type: 'image/png',
          },
        ],
      },
      {
        name: 'Templates',
        short_name: 'Templates',
        description: 'Browse form templates',
        url: '/app/templates',
        icons: [
          {
            src: '/shortcut-templates.png',
            sizes: '96x96',
            type: 'image/png',
          },
        ],
      },
    ],
  };
}
