import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://www.blackdrivo.com";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/dashboard",
          "/api/*",
          "/account",
          "/account/*",
          "/booking/review",
          "/login",
          "/signup",
          "/reset-password",
          "/driver/dashboard",
          "/driver/dashboard/*",
          "/driver/onboarding",
          "/driver/onboarding/*",
          "/driver/profile",
          "/journey",
          "/journey/*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}


