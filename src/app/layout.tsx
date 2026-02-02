import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { SmoothScroll } from "@/components/smooth-scroll";

const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FoodHub | Premium Food Delivery Experience",
    template: "%s | FoodHub",
  },
  description:
    "Order delicious meals from top-rated restaurants and local kitchens. Fast delivery, premium service, and handcrafted culinary experiences.",
  keywords: [
    "food delivery",
    "restaurants",
    "order food",
    "meals",
    "culinary",
    "foodhub",
    "local kitchens",
  ],
  authors: [{ name: "Tomjid" }],
  creator: "Tomjid",
  publisher: "Tomjid",
  metadataBase: new URL("https://foodhub-by-tomjid.vercel.app/"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://foodhub-by-tomjid.vercel.app/",
    siteName: "FoodHub",
    title: "FoodHub | Premium Food Delivery Experience",
    description:
      "The better way to order food. Discover top kitchens and handcrafted meals near you.",
    images: [
      {
        url: "/website-banner.png",
        width: 1200,
        height: 630,
        alt: "FoodHub - Premium Food Delivery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FoodHub | Premium Food Delivery Experience",
    description:
      "The better way to order food. Discover top kitchens and handcrafted meals near you.",
    images: ["/website-banner.png"],
    creator: "@tomjid",
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
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className='scroll-smooth'>
      <body
        className={`${plusJakartaSans.variable} ${fraunces.variable} font-sans antialiased bg-cream text-charcoal`}>
        <SmoothScroll />
        {children}
        <Toaster
          position='top-center'
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            style: {
              border: "3px solid #0a0a0a",
              borderRadius: "0px",
              padding: "16px 24px",
              color: "#0a0a0a",
              background: "#fdfcf8",
              fontSize: "12px",
              fontWeight: "900",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              boxShadow: "8px 8px 0px 0px rgba(10, 10, 10, 1)",
            },
            success: {
              iconTheme: {
                primary: "#ff5722",
                secondary: "#fdfcf8",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
