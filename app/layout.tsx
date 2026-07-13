import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ReactGA from "react-ga4";
import "./globals.css";
import GoogleAnalytics from "./components/GoogleAnalytics";

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
  // GA4
  // const GA4_ID = "G-CSFPMVKKRH";
  // ReactGA.initialize(GA4_ID);
  // ReactGA.send({
  //   hitType: "pageview",
  //   page: window.location.pathname,
  //   title: "Portfolio",
  // });
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <GoogleAnalytics />
        {/* <Suspense fallback={null}>
          <GAPageTracker />
        </Suspense> */}
      </body>
    </html>
  );
}
