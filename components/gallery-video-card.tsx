"use client";

import { embedUrlNoAutoplay, isDirectVideoFileUrl } from "@/lib/gallery-embed";

interface GalleryVideoCardProps {
  src?: string;
  title: string;
  description: string;
}

export function GalleryVideoCard({ src, title, description }: GalleryVideoCardProps) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg shadow-gray-200/60 ring-1 ring-gray-100/80 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#9E1B32]/10">
      <div className="aspect-video">
        {isDirectVideoFileUrl(src) ? (
          <video className="h-full w-full object-cover" controls playsInline preload="none" src={src}>
            {title}
          </video>
        ) : (
          <iframe
            className="h-full w-full"
            src={embedUrlNoAutoplay(src ?? "")}
            title={title}
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
      <div className="p-5">
        <h3 className="mb-1 text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}
