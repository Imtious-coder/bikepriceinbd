import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Bike Price In Bangladesh",
  description:
    "How Bike Price In Bangladesh collects, uses, and protects visitor information.",
  alternates: { canonical: "https://bikepriceinbangladesh.com/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F6F9FC] pt-32 sm:pt-36 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="inline-block text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">
          Legal
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-slate-400 mb-10">Last updated: August 2026</p>

        <div className="rounded-3xl border border-blue-100 bg-white p-8 sm:p-10 shadow-sm space-y-8 text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Overview</h2>
            <p>
              Bike Price In Bangladesh (&quot;we&quot;, &quot;us&quot;) respects your privacy.
              This policy explains what information we collect when you use
              this website, how it&apos;s used, and the choices you have.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Information We Collect</h2>
            <p className="mb-2">We may collect the following:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Basic usage data such as pages visited, browser type, and device type, typically through analytics tools.</li>
              <li>Information you voluntarily submit, such as your name, email address, and message when you use our contact form.</li>
              <li>Cookies used for site functionality and, where enabled, advertising or analytics.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">How We Use Information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To respond to messages sent through the contact form or email.</li>
              <li>To understand how the site is used, so we can improve content and performance.</li>
              <li>To maintain the security and reliability of the site.</li>
            </ul>
            <p className="mt-2">
              We do not sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Third-Party Services</h2>
            <p>
              We may use third-party services such as analytics providers or
              advertising networks that place cookies or collect data
              according to their own privacy policies. We encourage you to
              review the policies of any third-party service linked from this
              site.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Your Choices</h2>
            <p>
              You can control cookies through your browser settings. You may
              also contact us to request that we delete any personal
              information you&apos;ve submitted through our contact form.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Contact</h2>
            <p>
              Questions about this policy can be sent to{" "}
              <a href="mailto:imtious.islam.me@gmail.com" className="font-semibold text-blue-600 hover:underline">
                imtious.islam.me@gmail.com
              </a>{" "}
              or via the{" "}
              <Link href="/contact" className="font-semibold text-blue-600 hover:underline">
                contact page
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}