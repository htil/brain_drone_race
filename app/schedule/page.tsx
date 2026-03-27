"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import CalendlyEmbed from "@/components/calendly_embed";
import { SectionBlobs } from "@/components/section-flair";

export default function Schedule() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 border-b border-gray-200/80 bg-white/90 shadow-sm backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="relative h-10 w-44 sm:h-12 sm:w-56"
            aria-label="Go to home"
          >
            <Image src="/imgs/header.png" alt="University of Alabama" fill className="object-contain object-left" />
          </button>
          <Link
            href="/"
            className="inline-flex items-center text-sm font-semibold text-[#9E1B32] transition hover:text-[#7A1526] sm:text-base"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
        </div>
      </header>

      <div className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-rose-50/30">
        <SectionBlobs />
        <div className="relative z-10 container mx-auto px-4 py-10 sm:py-14">
          <div className="mb-8 text-center">
            <span className="mb-2 inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#9E1B32] sm:text-sm">
              Book a time
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Schedule a session</h1>
            <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-[#9E1B32] via-[#c75c6f] to-amber-200/80" />
            <p className="mx-auto mt-4 max-w-xl text-gray-600">
              Pick a slot that works for you — we&apos;ll follow up with meeting details.
            </p>
          </div>

          <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl shadow-gray-300/50">
            <div className="min-h-[900px]">
              <CalendlyEmbed url="https://calendly.com/madeleke-crimson/bdr" />
            </div>
          </div>
        </div>
      </div>

      <footer className="relative overflow-hidden border-t border-white/10 bg-gradient-to-br from-[#7A1526] via-[#9E1B32] to-[#4a0d18] py-10 text-white">
        <div className="container relative z-10 mx-auto px-4 text-center text-sm text-white/80">
          <p>&copy; 2026 UA Brain Drone Race Team. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
