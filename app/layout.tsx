import type { Metadata } from "next";
import { Inter } from "next/font/google";
import GoogleAnalytics from "./components/GoogleAnalytics";
import "./globals.css";
import MotoHeader from "./components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bike Price In Bangladesh",
  description:
    "Browse motorcycle prices, specs, and mileage for the Bangladeshi market. Compare bikes from Honda, Yamaha, Suzuki, Bajaj, and more.",
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
