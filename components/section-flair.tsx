"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const shellVariants = {
  muted: "bg-slate-100/95",
  surface: "bg-white",
  gradient: "bg-gradient-to-b from-slate-50 via-white to-rose-50/40",
  mesh: "bg-white [background-image:radial-gradient(rgb(158_27_50/0.06)_1px,transparent_1px)] [background-size:24px_24px]",
  join: "bg-gradient-to-br from-[#9E1B32] via-[#8a1730] to-[#4a0d18] text-white",
} as const;

export type SectionVariant = keyof typeof shellVariants;

export function SectionBlobs({ tone = "warm" }: { tone?: "warm" | "cool" }) {
  const warm = tone === "warm";
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className={cn(
          "absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full blur-3xl",
          warm ? "bg-[#9E1B32]/20" : "bg-slate-400/15",
        )}
      />
      <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-amber-300/10 blur-3xl" />
      <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-white/25 blur-3xl" />
    </div>
  );
}

export function SectionShell({
  id,
  children,
  variant = "surface",
  className,
  withBlobs = true,
}: {
  id?: string;
  children: ReactNode;
  variant?: SectionVariant;
  className?: string;
  withBlobs?: boolean;
}) {
  const blobs = variant !== "join" && withBlobs;

  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn("relative overflow-hidden py-16 md:py-24", shellVariants[variant], className)}
    >
      {blobs && <SectionBlobs />}
      <div className="relative z-10">{children}</div>
    </motion.section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  light = false,
  asTitle = "h2",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  light?: boolean;
  asTitle?: "h1" | "h2";
}) {
  const TitleTag = asTitle === "h1" ? "h1" : "h2";
  return (
    <div className="mb-10 text-center md:mb-12">
      {eyebrow && (
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={cn(
            "mb-3 inline-block text-xs font-bold uppercase tracking-[0.2em] sm:text-sm",
            light ? "text-white/80" : "text-[#9E1B32]",
          )}
        >
          {eyebrow}
        </motion.span>
      )}
      <TitleTag
        className={cn(
          "text-3xl font-bold tracking-tight sm:text-4xl",
          light ? "text-white" : "text-gray-900",
        )}
      >
        {title}
      </TitleTag>
      <div
        className={cn(
          "mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-[#9E1B32] via-[#c75c6f] to-amber-200/80",
          light && "from-white/90 via-white/60 to-white/20",
        )}
      />
      {subtitle && (
        <p
          className={cn(
            "mx-auto mt-5 max-w-2xl text-pretty text-base sm:text-lg",
            light ? "text-white/80" : "text-gray-600",
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function HeroFlair() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
      <div className="absolute -left-1/4 top-0 h-[60vh] w-[60vh] rounded-full bg-[#9E1B32]/25 blur-[100px]" />
      <div className="absolute -right-1/4 bottom-0 h-[50vh] w-[50vh] rounded-full bg-[#9E1B32]/20 blur-[90px]" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
