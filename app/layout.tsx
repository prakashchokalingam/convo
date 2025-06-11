import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/theme/theme-provider";
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from '@/components/shared/ui/toaster';

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "ConvoForms - AI-Powered Conversational Forms",
  description: "Create engaging conversational forms with AI in seconds.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <ClerkProvider>
          <ThemeProvider
            defaultTheme="system"
            storageKey="convo-forms-theme"
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}