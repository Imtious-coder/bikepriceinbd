"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Opens the reader's email client pre-filled — replace with a real
    // API route (e.g. /api/contact) once you wire up email sending.
    const subject = encodeURIComponent(`Message from ${name || "website visitor"}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:imtious.islam.me@gmail.com?subject=${subject}&body=${body}`;
    setStatus("sent");
  }

  return (
    <div className="min-h-screen bg-[#F6F9FC] pt-32 sm:pt-36 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">
            Contact
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Get In <span className="text-blue-600">Touch</span>
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-base text-slate-500 leading-relaxed">
            Spotted an outdated price, have a correction, or want to reach
            the team behind Bike Price In Bangladesh? Send a message below or
            email us directly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="rounded-2xl border border-blue-100 bg-white p-5 text-center shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Email</p>
            <a href="mailto:imtious.islam.me@gmail.com" className="text-sm font-semibold text-blue-600 hover:underline break-all">
              imtious.islam.me@gmail.com
            </a>
          </div>
          <div className="rounded-2xl border border-blue-100 bg-white p-5 text-center shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Run By</p>
            <p className="text-sm font-semibold text-slate-700">Imtious Islam</p>
          </div>
          <div className="rounded-2xl border border-blue-100 bg-white p-5 text-center shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Based In</p>
            <p className="text-sm font-semibold text-slate-700">Dhaka, Bangladesh</p>
          </div>
        </div>

        <div className="rounded-3xl border border-blue-100 bg-white p-8 sm:p-10 shadow-sm">
          {status === "sent" ? (
            <div className="text-center py-8">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">Your email client should now be open</h2>
              <p className="text-sm text-slate-500">
                If nothing happened, email us directly at{" "}
                <a href="mailto:imtious.islam.me@gmail.com" className="font-semibold text-blue-600 hover:underline">
                  imtious.islam.me@gmail.com
                </a>
                .
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-6 text-sm font-semibold text-blue-600 hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 resize-none"
                  placeholder="Let us know about a price correction, a question, or anything else."
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-[0_10px_24px_-10px_rgba(17,85,245,0.5)] transition-all hover:bg-blue-500"
              >
                Send Message
              </button>
            </form>
          )}
        </div>

        <p className="mt-8 text-center text-sm text-slate-400">
          <Link href="/about" className="hover:text-blue-600 hover:underline">
            Learn more about who runs this site →
          </Link>
        </p>
      </div>
    </div>
  );
}