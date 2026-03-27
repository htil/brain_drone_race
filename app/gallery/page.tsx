"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { GalleryMediaCarousel } from "@/components/gallery-photo-carousel";
import { SectionHeading, SectionShell } from "@/components/section-flair";

interface GalleryItem {
  type: string;
  src?: string;
  title: string;
  description: string;
}

export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

  const galleryMedia = useMemo(
    () => galleryItems.filter((item) => item.type === "video" || item.type === "image"),
    [galleryItems],
  );

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/data/gallery.json");
      const data = await res.json();
      setGalleryItems(data);
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 border-b border-gray-200/80 bg-white/90 shadow-sm backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="relative h-10 w-44 sm:h-12 sm:w-56">
            <Image src="/imgs/header.png" alt="University of Alabama" fill className="object-contain object-left" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center text-sm font-semibold text-[#9E1B32] transition hover:text-[#7A1526] sm:text-base"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
        </div>
      </header>

      <SectionShell variant="gradient">
        <div className="container mx-auto px-4">
          <SectionHeading
            eyebrow="Media"
            title="Gallery"
          />

          {galleryMedia.length > 0 && <GalleryMediaCarousel items={galleryMedia} />}

          {galleryItems.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600"
            >
              No gallery media yet. Run <code className="rounded bg-gray-100 px-1">npm run sync-gallery</code> after
              adding images to <code className="rounded bg-gray-100 px-1">public/Gallery</code>.
            </motion.div>
          )}
        </div>
      </SectionShell>

      <footer className="relative overflow-hidden border-t border-white/10 bg-gradient-to-br from-[#7A1526] via-[#9E1B32] to-[#4a0d18] py-10 text-white">
        <div className="container relative z-10 mx-auto px-4 text-center text-sm text-white/75">
          <p>&copy; 2026 UA Brain Drone Race Team. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
