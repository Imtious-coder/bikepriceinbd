import type { Metadata } from "next";
import { Inter } from "next/font/google";
import GoogleAnalytics from "./components/GoogleAnalytics";
import MotoHeader from "./components/Header";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bike Price In Bangladesh",
  description:
    "Browse motorcycle prices, specs, and mileage for the Bangladeshi market. Compare bikes from Honda, Yamaha, Suzuki, Bajaj, and more.",
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
      </body>
    </html>
  );
}
