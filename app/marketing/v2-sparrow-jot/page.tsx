import { ConvoV2LandingPage } from '@/components/marketing/v2/convo-landing-page';

export default function ConvoV2Page() {
  return <ConvoV2LandingPage />;
}

export function generateMetadata() {
  return {
    title: 'Convo - AI-Powered Conversational Forms That Actually Convert',
    description:
      'Transform boring forms into engaging conversations with AI. Increase completion rates by 300% with intelligent, adaptive forms that feel human.',
    keywords:
      'AI forms, conversational forms, form builder, survey builder, AI form generator, form conversion, chat forms',
    openGraph: {
      title: 'Convo - AI-Powered Conversational Forms That Actually Convert',
      description:
        'Transform boring forms into engaging conversations with AI. Increase completion rates by 300% with intelligent, adaptive forms that feel human.',
      type: 'website',
      images: [
        {
          url: '/og-image-v2.png',
          width: 1200,
          height: 630,
          alt: 'Convo - AI Form Builder',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Convo - AI-Powered Conversational Forms That Actually Convert',
      description:
        'Transform boring forms into engaging conversations with AI. Increase completion rates by 300% with intelligent, adaptive forms that feel human.',
      images: ['/og-image-v2.png'],
    },
  };
}
