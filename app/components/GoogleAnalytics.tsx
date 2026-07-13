"use client";

import { useEffect } from "react";
import ReactGA from "react-ga4";

export default function GoogleAnalytics() {
  useEffect(() => {
    const GA4_ID = "G-CSFPMVKKRH" as string;
    ReactGA.initialize(GA4_ID);
    ReactGA.send({
      hitType: "pageview",
      page: window.location.pathname,
      title: document.title,
    });
  }, []);

  return null;
}
