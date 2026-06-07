import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/data/blog-posts";
import { cities, airports } from "@/lib/data/seo-locations";

const BASE = "https://www.blackdrivo.com";
const NOW  = new Date().toISOString();

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                                  lastModified: NOW, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/booking`,                     lastModified: NOW, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/services`,                    lastModified: NOW, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/chauffeur-service`,           lastModified: NOW, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/airport-transfer`,            lastModified: NOW, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/limousine-service`,           lastModified: NOW, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/about`,                       lastModified: NOW, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/contact`,                     lastModified: NOW, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/driver`,                      lastModified: NOW, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/careers`,                     lastModified: NOW, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/press`,                       lastModified: NOW, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/blog`,                        lastModified: NOW, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${BASE}/help`,                        lastModified: NOW, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/privacy-policy`,              lastModified: NOW, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/terms-of-service`,            lastModified: NOW, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/accessibility`,               lastModified: NOW, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/hipaa-compliance`,            lastModified: NOW, changeFrequency: "yearly",  priority: 0.3 },
  ];

  const blogPages: MetadataRoute.Sitemap = blogPosts.map(post => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: NOW,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const cityPages: MetadataRoute.Sitemap = cities.map(city => ({
    url: `${BASE}/chauffeur-service/${city.slug}`,
    lastModified: NOW,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const airportPages: MetadataRoute.Sitemap = airports.map(ap => ({
    url: `${BASE}/airport-transfer/${ap.slug}`,
    lastModified: NOW,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...blogPages, ...cityPages, ...airportPages];
}
