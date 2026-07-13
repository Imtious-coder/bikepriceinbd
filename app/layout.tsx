import type { Metadata } from "next";
import { Inter } from "next/font/google";
import GoogleAnalytics from "./components/GoogleAnalytics";
import { Suspense } from "react";
import GAPageTracker from "./components/GAPageTracker";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BD Bikes – Motorcycle Prices in Bangladesh",
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
        {children} <GoogleAnalytics />
        <Suspense fallback={null}>
          <GAPageTracker />
        </Suspense>
      </body>
    </html>
  );
}
