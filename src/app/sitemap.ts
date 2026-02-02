import { MetadataRoute } from "next";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_AUTH_URL ||
  "https://food-hub-backend-inky.vercel.app";

interface Provider {
  id: string;
}

interface Meal {
  id: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://foodhub-by-tomjid.vercel.app";

  // Static routes
  const routes = [
    "",
    "/restaurants",
    "/meals",
    "/become-provider",
    "/login",
    "/register",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 1,
  }));

  try {
    // Dynamic routes for restaurants
    const providersRes = await fetch(`${BACKEND_URL}/api/providers`);
    const providersJson = await providersRes.json();
    const providerRoutes = providersJson.success
      ? (providersJson.data as Provider[]).map((p) => ({
          url: `${baseUrl}/restaurants/${p.id}`,
          lastModified: new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        }))
      : [];

    // Dynamic routes for meals
    const mealsRes = await fetch(`${BACKEND_URL}/api/meals`);
    const mealsJson = await mealsRes.json();
    const mealRoutes = mealsJson.success
      ? (mealsJson.data as Meal[]).map((m) => ({
          url: `${baseUrl}/meals/${m.id}`,
          lastModified: new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.6,
        }))
      : [];

    return [...routes, ...providerRoutes, ...mealRoutes];
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return routes;
  }
}
