import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "aos/dist/aos.css";
import AOSInitializer from "../components/landing/AOSInitializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.blackdrivo.com"),
  title: {
    default: "BlackDrivo - Premium Chauffeur Service in the US",
    template: "%s | BlackDrivo",
  },
  description:
    "BlackDrivo offers premium chauffeur rides across the United States, including airport transfers, hourly service, city-to-city rides, and business travel.",
  keywords: [
    "chauffeur service USA",
    "airport transfer united states",
    "city to city rides USA",
    "hourly chauffeur service",
    "business travel transportation",
    "private car service USA",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://www.blackdrivo.com/",
    title: "BlackDrivo - Premium Chauffeur Service in the US",
    description:
      "Book private airport transfers, hourly rides, and city-to-city chauffeur travel in the United States.",
    siteName: "BlackDrivo",
    images: [
      {
        url: "/favicon.ico",
        width: 1200,
        height: 630,
        alt: "BlackDrivo logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@blackdrivo",
    creator: "@blackdrivo",
    title: "BlackDrivo - Premium Chauffeur Service in the US",
    description:
      "Premium chauffeur service for airport, hourly, and city-to-city rides across the United States.",
    images: ["/favicon.ico"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      {
        url: "/favicon.ico",
        type: "image/png",
        sizes: "48x48",
      },
      {
        url: "/favicon.ico",
        type: "image/png",
        sizes: "192x192",
      },
      {
        url: "/favicon.ico",
        type: "image/png",
        sizes: "512x512",
      },
    ],
    shortcut: [{ url: "/favicon.ico" }],
    apple: [
      {
        url: "/favicon.ico",
        type: "image/png",
        sizes: "180x180",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0b1117" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "BlackDrivo",
              url: "https://www.blackdrivo.com",
              logo: "https://www.blackdrivo.com/favicon.ico",
              sameAs: [
                "https://www.linkedin.com/company/blackdrivo",
                "https://x.com/blackdrivo",
              ],
              description:
                "Premium United States chauffeur service for airport transfers, hourly rides, and city-to-city travel.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "New York",
                addressRegion: "NY",
                postalCode: "10001",
                addressCountry: "US",
              },
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  telephone: "+1-800-555-0199",
                  contactType: "sales",
                  email: "support@blackdrivo.com",
                  areaServed: "US",
                  availableLanguage: ["English"],
                },
              ],
              makesOffer: [
                {
                  "@type": "Offer",
                  itemOffered: { "@type": "Service", name: "Airport Transfers" },
                },
                {
                  "@type": "Offer",
                  itemOffered: { "@type": "Service", name: "Hourly Chauffeur" },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "City-to-city Rides",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: { "@type": "Service", name: "Business Travel" },
                },
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AOSInitializer />
        {children}
      </body>
    </html>
  );
}
