"use client";

import BrowseByCategory from "./components/Brand";
import BikeListings from "./components/BikeListings";
import BikePriceTable from "./components/BikePriceTable";
import CompareBikes from "./components/CompareBikes";
import Faq from "./components/Faq";
import PromoBanner from "./components/Hero";
import LatestBikePrices from "./components/LatestBikePrices";
import Popularbikes from "./components/Popularbikes";
import RidersReviews from "./components/RidersReviews";
import Trustedshowrooms from "./components/Trustedshowrooms";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F6F9FC]">
      <PromoBanner />

      {/* <section className="w-full bg-blue-50/60 py-10 sm:py-14">
        <div className="mx-auto max-w-4xl px-4">
          <div className="rounded-2xl border border-blue-100 bg-white p-6 sm:p-8">
            <h4 className="text-sm leading-relaxed text-slate-500 sm:text-base">
              Looking for the latest bike price in Bangladesh? Bike Price in
              Bangladesh provides updated motorcycle prices, specifications,
              mileage, features and reviews for popular bikes available in the
              Bangladeshi market. Browse bikes from{" "}
              <span className="font-semibold text-slate-700">
                Honda, Yamaha, Bajaj, Suzuki, Hero, TVS, Royal Enfield, CFMOTO
              </span>{" "}
              and other leading motorcycle brands.
            </h4>
            <h4 className="mt-4 text-sm leading-relaxed text-slate-500 sm:text-base">
              You can find bikes by brand, budget, engine capacity and motorcycle
              type. Compare different models side by side to find the best bike
              for your budget and requirements.
            </h4>
          </div>
        </div>
      </section> */}

      <BrowseByCategory />
      <LatestBikePrices />
      <BikePriceTable />
      <BikeListings />
      <CompareBikes />
      <Trustedshowrooms />
      {/* <Popularbikes /> */}
      <RidersReviews />
      <Faq />
    </div>
  );
}
