import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/account/", "/checkout/", "/orders/"],
    },
    sitemap: "https://foodhub-demo.vercel.app/sitemap.xml",
  };
}
