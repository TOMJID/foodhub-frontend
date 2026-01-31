import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

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
        className={`${plusJakartaSans.variable} ${fraunces.variable} font-sans antialiased bg-[#fdfcf8] text-[#0a0a0a]`}>
        {children}
      </body>
    </html>
  );
}
