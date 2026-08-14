import type { Metadata } from "next";
import { Inter } from "next/font/google";
import GoogleAnalytics from "./components/GoogleAnalytics";
import MotoHeader from "./components/Header";
import Footer from "./components/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bike Price in Bangladesh 2026 | Latest Motorcycle Prices",
  description:
    "Find the latest bike price in Bangladesh 2026. Compare Honda, Yamaha, Bajaj, Suzuki, Hero, TVS, Royal Enfield and more with specs, mileage, features, reviews and comparisons.",
  icons: {
    icon: "https://i.ibb.co/ks6z3yth/favicon.png",
    shortcut: "https://i.ibb.co/ks6z3yth/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MotoHeader />
        {children}
        <GoogleAnalytics />
         <Footer />
      </body>
    </html>
  );
}
