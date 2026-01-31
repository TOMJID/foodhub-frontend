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
  title: "FoodHub | Discover & Order Delicious Meals",
  description:
    "The premium food delivery experience. Browse menus, order from top providers, and track your meals in real-time.",
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
