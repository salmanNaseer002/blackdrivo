import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/context/AuthContext";

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
    default: "BlackDrivo — Premium Chauffeur Service | NY, NJ & Nationwide",
    template: "%s | BlackDrivo",
  },
  description:
    "BlackDrivo delivers premium black car service across New York, New Jersey, and the entire United States. Airport transfers, hourly chauffeur, city-to-city rides, and corporate travel.",
  keywords: [
    "black car service NYC",
    "premium chauffeur New York",
    "airport transfer JFK LGA EWR",
    "luxury taxi New Jersey",
    "hourly chauffeur service",
    "corporate car service",
    "city to city rides",
    "private driver NYC",
    "blackdrivo",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://www.blackdrivo.com/",
    title: "BlackDrivo — Premium Chauffeur Service",
    description:
      "Premium black car service across New York, New Jersey, and the US. Book airport transfers, hourly rides, and city-to-city chauffeur travel.",
    siteName: "BlackDrivo",
    images: [
      {
        url: "/B Logo Black Theme.png",
        width: 1200,
        height: 630,
        alt: "BlackDrivo Premium Chauffeur",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@blackdrivo",
    creator: "@blackdrivo",
    title: "BlackDrivo — Premium Chauffeur Service",
    description:
      "Premium chauffeur service across New York, New Jersey, and the US.",
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
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
        {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
          <script
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
            async
            defer
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "BlackDrivo",
              url: "https://www.blackdrivo.com",
              logo: "https://www.blackdrivo.com/favicon.ico",
              image: "https://www.blackdrivo.com/og-image.jpg",
              description:
                "Premium chauffeur service for airport transfers, hourly rides, and city-to-city travel across New York, New Jersey, and the US.",
              telephone: "+1-800-555-0199",
              email: "support@blackdrivo.com",
              priceRange: "$$$$",
              address: {
                "@type": "PostalAddress",
                addressLocality: "New York",
                addressRegion: "NY",
                postalCode: "10001",
                addressCountry: "US",
              },
              areaServed: [
                "New York",
                "New Jersey",
                "Connecticut",
                "Pennsylvania",
              ],
              sameAs: [
                "https://www.instagram.com/blackdrivo",
                "https://twitter.com/blackdrivo",
                "https://www.linkedin.com/company/blackdrivo",
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
