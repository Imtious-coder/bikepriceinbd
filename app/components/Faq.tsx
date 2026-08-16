import Link from "next/link";

// ─── Content ─────────────────────────────────────────────────────────────
// Top 7: high-intent, "People Also Ask"-style queries for SEO.
// Answers are genuine — they point to live site features rather than
// hardcoding numbers/rankings that would go stale.

const FAQS = [
  {
    question: "What is the current bike price in Bangladesh?",
    answer:
      "Bike prices in Bangladesh range from around ৳80,000 for entry-level 80–100cc commuters to over ৳5 lakh for premium sports and cruiser models. Because prices shift with import duties and distributor updates, we keep live, up-to-date prices on our Bikes page rather than quoting a single figure here.",
  },
  {
    question: "Which is the cheapest bike in Bangladesh?",
    answer:
      "The cheapest motorcycles in Bangladesh are typically entry-level 80–100cc commuter models from brands like Bajaj, TVS, and Hero, usually priced under ৳1.3 lakh. Since new models launch and prices change often, browse our Bikes page and sort or filter by budget to see the current lowest-priced options.",
  },
  {
    question: "Which bike gives the best mileage?",
    answer:
      "Small-displacement 100–125cc commuter bikes generally deliver the best fuel mileage in Bangladesh, often exceeding 45–60 km/l in real-world city riding, since they're built for efficiency over performance. Each bike's detail page lists its official city and highway mileage so you can compare exact figures.",
  },
  {
    question: "Which is the best bike under 2 lakh in Bangladesh?",
    answer:
      "Under ৳2 lakh, you'll typically find a strong mix of 125–160cc commuter and standard bikes from Yamaha, Suzuki, Bajaj, TVS, and Hero, balancing performance, mileage, and price. Use our Compare tool to put a few of these head-to-head on the specs that matter most to you.",
  },
  {
    question: "Which 150cc bike is best in Bangladesh?",
    answer:
      "150cc is one of the most competitive segments in the Bangladeshi market, with well-regarded options from Yamaha, Suzuki, Bajaj, and TVS offering different strengths in power, mileage, and styling. Filter our Bikes page by engine capacity to see all current 150cc models side by side.",
  },
  {
    question: "Which bike is best for daily commuting?",
    answer:
      "A good daily commuter bike usually prioritizes high mileage, low maintenance cost, comfortable ergonomics, and easy handling in traffic over raw power — which is why 100–150cc standard and commuter bikes are the most popular choice for daily riders in Bangladesh. Our reviews section includes real rider feedback on how specific models actually perform in daily city use.",
  },
  {
    question: "Which motorcycle brand is most popular in Bangladesh?",
    answer:
      "Popularity shifts by segment and season, so rather than naming one brand, our homepage's Most Popular Bikes section ranks models by what riders are actually viewing and buying on the site right now, giving you a real-time view instead of a fixed answer.",
  },
  {
    question: "How accurate are the bike prices on this site?",
    answer:
      "Prices are checked against manufacturer and authorized-dealer information and updated whenever a change is identified. Actual on-road prices can vary slightly by showroom, registration costs, and ongoing promotions, so we recommend confirming the final price with your local dealer before buying.",
  },
  {
    question: "Which motorcycle brands are covered?",
    answer:
      "We track prices and specifications for Suzuki, Yamaha, Honda, Bajaj, TVS, Hero, Royal Enfield, CFMOTO, and other major brands sold in Bangladesh, from budget commuters to full-fairing sports bikes.",
  },
  {
    question: "How often are bike prices updated?",
    answer:
      "Bike prices in Bangladesh change with import duties, currency shifts, and distributor decisions, so we review listings on an ongoing basis rather than a fixed schedule. Each bike's detail page shows exactly when its price was last checked.",
  },
  {
    question: "Can I compare two or three bikes side by side?",
    answer:
      "Yes. Our Compare tool lets you pick two or three bikes and see their price, engine specs, mileage, and dimensions laid out side by side, so you can see exactly where each model wins.",
  },
  {
    question: "Is Bike Price In Bangladesh affiliated with any manufacturer or showroom?",
    answer:
      "No. We're an independently run platform, not owned by any dealership, distributor, or manufacturer. No brand pays for placement or favorable coverage — listings are ordered by relevance to your search or filter, not by advertiser status.",
  },
  {
    question: "How can I find a trusted showroom near me?",
    answer:
      "Our Showroom Directory lists verified showrooms organized by division across Bangladesh, so you can see how many are near you and browse them before visiting in person.",
  },
  {
    question: "Is this website free to use?",
    answer:
      "Yes, browsing prices, specifications, comparisons, and reviews on Bike Price In Bangladesh is completely free, with no account or sign-up required.",
  },
  {
    question: "I found an incorrect price. How do I report it?",
    answer:
      "Reach out through our Contact page or email us directly — we review every reported price against our sources and correct the listing as soon as it's confirmed.",
  },
];

// ─── Icon ────────────────────────────────────────────────────────────────

function ChevronIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

// ─── Component ───────────────────────────────────────────────────────────

export default function Faq() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section
      className="w-full bg-white py-14 sm:py-20"
      aria-labelledby="home-faq-heading"
    >
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="mx-auto max-w-3xl px-4">
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">
            FAQ
          </span>
          <h2
            id="home-faq-heading"
            className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl"
          >
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm text-slate-500 sm:text-base">
            Common questions about bike prices, mileage, and buying a
            motorcycle in Bangladesh.
          </p>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-white shadow-sm divide-y divide-slate-100">
          {FAQS.map((faq) => (
            <details key={faq.question} className="group p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900">
                <span>{faq.question}</span>
                <ChevronIcon className="h-4 w-4 flex-shrink-0 text-blue-500 transition-transform duration-200 group-open:rotate-45" />
              </summary>
              <p className="mt-3 pr-8 text-sm leading-7 text-slate-600">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-slate-400">
          Still have a question?{" "}
          <Link href="/contact" className="font-semibold text-blue-600 hover:underline">
            Contact us
          </Link>
        </p>
      </div>
    </section>
  );
}