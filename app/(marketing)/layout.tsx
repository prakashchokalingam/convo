import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ConvoForms - AI-Powered Conversational Forms | Boost Completion Rates by 300%",
  description: "Create engaging conversational forms with AI in seconds. Transform boring forms into natural conversations. Trusted by 10,000+ businesses to increase completion rates by 300%.",
  keywords: [
    "conversational forms",
    "AI forms",
    "form builder",
    "form completion rates",
    "customer engagement",
    "lead generation",
    "survey forms",
    "chatbot forms",
    "interactive forms",
    "form optimization",
    "AI form generator",
    "smart forms",
    "conversion optimization",
    "user experience",
    "customer surveys"
  ],
  openGraph: {
    title: "ConvoForms - AI-Powered Conversational Forms",
    description: "Create engaging conversational forms with AI in seconds. Boost completion rates by 300%. Start free today!",
    type: "website",
    url: "https://convoforms.com",
    siteName: "ConvoForms",
    images: [
      {
        url: "/og-landing.png",
        width: 1200,
        height: 630,
        alt: "ConvoForms Dashboard - Create AI-Powered Conversational Forms",
      },
      {
        url: "/og-landing-square.png",
        width: 1200,
        height: 1200,
        alt: "ConvoForms - Transform Forms into Conversations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ConvoForms - AI-Powered Conversational Forms",
    description: "Create engaging conversational forms with AI in seconds. Boost completion rates by 300%. Start free today!",
    images: ["/og-landing.png"],
    creator: "@convoforms",
    site: "@convoforms",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://convoforms.com",
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "ConvoForms - AI-Powered Conversational Forms",
            "description": "Create engaging conversational forms with AI in seconds. Boost completion rates by 300%.",
            "url": "https://convoforms.com",
            "mainEntity": {
              "@type": "SoftwareApplication",
              "name": "ConvoForms",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "description": "AI-powered conversational forms that boost completion rates by 300%",
              "url": "https://convoforms.com",
              "offers": [
                {
                  "@type": "Offer",
                  "name": "Free Plan",
                  "price": "0",
                  "priceCurrency": "USD",
                  "description": "3 forms, 100 responses/month"
                },
                {
                  "@type": "Offer",
                  "name": "Pro Plan",
                  "price": "29",
                  "priceCurrency": "USD",
                  "description": "Unlimited forms, 10,000 responses/month"
                }
              ],
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "ratingCount": "1247",
                "bestRating": "5",
                "worstRating": "1"
              },
              "author": {
                "@type": "Organization",
                "name": "ConvoForms",
                "url": "https://convoforms.com"
              }
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://convoforms.com"
                }
              ]
            }
          })
        }}
      />
      {children}
    </div>
  );
}