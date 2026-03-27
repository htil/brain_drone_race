"use client";

import { useMemo } from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { embedUrlNoAutoplay, isDirectVideoFileUrl } from "@/lib/gallery-embed";

export interface GalleryMediaItem {
  type: string;
  src?: string;
  title: string;
  description: string;
}

/** Single carousel for photos and videos with automatic advance. */
export function GalleryMediaCarousel({ items }: { items: GalleryMediaItem[] }) {
  const plugins = useMemo(
    () => [
      Autoplay({
        delay: 5000,
        stopOnInteraction: true,
        stopOnMouseEnter: true,
      }),
    ],
    [],
  );

  if (items.length === 0) return null;

  return (
    <div className="relative mx-auto max-w-6xl rounded-3xl border border-gray-100/80 bg-white/50 px-2 py-6 shadow-inner shadow-gray-200/50 sm:px-10 sm:py-8">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={plugins}
        className="w-full"
      >
        <CarouselContent className="-ml-3 md:-ml-4">
          {items.map((item, index) => (
            <CarouselItem
              key={`${item.type}-${item.src ?? index}-${index}`}
              className="pl-3 md:pl-4 basis-full sm:basis-1/2 xl:basis-1/3"
            >
              <div className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition-all duration-300 hover:shadow-xl">
                {item.type === "video" ? (
                  <div className="relative aspect-video w-full overflow-hidden bg-black/90">
                    {isDirectVideoFileUrl(item.src) ? (
                      <video
                        className="h-full w-full object-cover"
                        controls
                        playsInline
                        preload="none"
                        src={item.src}
                      >
                        {item.title}
                      </video>
                    ) : (
                      <iframe
                        className="h-full w-full"
                        src={embedUrlNoAutoplay(item.src ?? "")}
                        title={item.title}
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    )}
                    <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                      Video
                    </span>
                  </div>
                ) : (
                  <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                    <Image
                      src={item.src || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-[#9E1B32]/85 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                      Photo
                    </span>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="line-clamp-2 text-base font-semibold">{item.title}</h3>
                  <p className="line-clamp-2 text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 border-[#9E1B32] text-[#9E1B32] hover:bg-[#9E1B32] hover:text-white sm:flex" />
        <CarouselNext className="right-2 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 border-[#9E1B32] text-[#9E1B32] hover:bg-[#9E1B32] hover:text-white sm:flex" />
      </Carousel>
      <p className="mt-3 text-center text-xs text-gray-500 sm:hidden">Swipe — advances automatically</p>
    </div>
  );
}

/** @deprecated Use GalleryMediaCarousel — kept for any old imports */
export const GalleryPhotoCarousel = GalleryMediaCarousel;
