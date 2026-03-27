"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ChevronRight, Calendar, Menu, X, Sparkles } from "lucide-react";
import { LinkedInLogoIcon } from "@radix-ui/react-icons";
import { GalleryMediaCarousel } from "@/components/gallery-photo-carousel";
import { HeroFlair, SectionHeading, SectionShell } from "@/components/section-flair";

interface GalleryItem {
  type: string;
  src?: string;
  videoId?: string;
  title: string;
  description: string;
}

interface Event {
  title: string;
  date: string;
  description: string;
}

interface TeamMember {
  name: string;
  imgSrc: string;
  classification: string;
  yearbookQuote: string;
  linkedinUrl: string;
}

interface SlideItem {
  src: string;
  title: string;
}

const navItems = [
  { label: "About", action: "about" },
  { label: "Tournament", action: "/tournament" },
  { label: "Gallery", action: "gallery" },
  { label: "Events", action: "events" },
  { label: "Team", action: "team" },
  { label: "Join Us", action: "join" },
];

export default function Home() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const router = useRouter();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [slides, setSlides] = useState<SlideItem[]>([
    { src: "/slides/IMG_3384.jpg", title: "Brain Drone Racing" },
  ]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const prevSlideIndex = useRef(0);

  const heroSlideTransition = useMemo(() => {
    const n = slides.length;
    if (n <= 1) return { duration: 0 };
    const wrapped =
      activeSlide === 0 && prevSlideIndex.current === n - 1;
    if (wrapped) {
      return { duration: 0 };
    }
    return {
      duration: 1.15,
      ease: [0.45, 0, 0.55, 1] as const,
    };
  }, [activeSlide, slides.length]);

  const galleryMedia = useMemo(
    () => galleryItems.filter((item) => item.type === "video" || item.type === "image"),
    [galleryItems],
  );

  useEffect(() => {
    const fetchData = async () => {
      const galleryResponse = await fetch("/data/gallery.json");
      const galleryData = await galleryResponse.json();
      setGalleryItems(galleryData);

      const eventsResponse = await fetch("/data/events.json");
      const eventsData = await eventsResponse.json();
      setEvents(eventsData);

      const teamsResponse = await fetch("/data/teams.json");
      const teamsData = await teamsResponse.json();
      setTeamMembers(teamsData);

      try {
        const slidesResponse = await fetch("/data/slides.json");
        if (slidesResponse.ok) {
          const slidesData = await slidesResponse.json();
          if (Array.isArray(slidesData) && slidesData.length > 0) {
            setSlides(slidesData);
          }
        }
      } catch (error) {
        console.error("Unable to load slides.json", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 2700);

    return () => window.clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    prevSlideIndex.current = activeSlide;
  }, [activeSlide]);

  const handleNav = (action: string) => {
    setMobileMenuOpen(false);
    if (action.startsWith("/")) {
      router.push(action);
      return;
    }
    const element = document.getElementById(action);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900">
      <header className="fixed top-0 z-50 w-full border-b border-gray-200/80 bg-white/90 shadow-sm backdrop-blur-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <button
            onClick={() => router.push("/")}
            className="relative h-12 sm:h-14 w-52 sm:w-64"
            aria-label="Go to home"
          >
            <Image src="/imgs/header.png" alt="University of Alabama" fill className="object-contain object-left" />
          </button>

          <nav className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => handleNav(item.action)}
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-[#9E1B32] hover:text-white hover:shadow-md"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <button
            className="lg:hidden p-2 rounded-md border border-gray-300 text-[#9E1B32]"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white px-4 py-3">
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNav(item.action)}
                  className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-[#9E1B32] hover:text-white transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="pt-20 sm:pt-24">
        <section className="relative flex h-screen items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <motion.div
              className="flex h-full"
              animate={{ x: `-${activeSlide * 100}vw` }}
              transition={heroSlideTransition}
            >
              {slides.map((slide, index) => (
                <div
                  key={`${slide.src}-${index}`}
                  className="relative h-full w-screen shrink-0"
                >
                  <Image
                    src={slide.src}
                    alt={slide.title}
                    fill
                    priority={index === 0}
                    className="object-cover"
                    sizes="100vw"
                  />
                </div>
              ))}
            </motion.div>
          </div>
          <HeroFlair />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 px-4 text-center"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm sm:text-sm"
            >
              <Sparkles className="h-4 w-4 text-amber-200" />
              University of Alabama
            </motion.span>
            <h1 className="mb-4 text-4xl font-bold text-white drop-shadow-lg sm:text-5xl md:text-6xl">
              Welcome to the Future of Racing
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-100 drop-shadow sm:text-xl">
              Control drones with your mind at the University of Alabama
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/schedule")}
              className="rounded-full bg-[#9E1B32] px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-[#9E1B32]/40 transition hover:bg-[#7A1526] sm:px-10 sm:py-5 sm:text-xl"
            >
              Schedule Now !!
            </motion.button>

            <div className="mt-10 flex justify-center gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === activeSlide ? "w-8 bg-white shadow-lg shadow-white/50" : "w-2.5 bg-white/50 hover:bg-white/70"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </section>

        <SectionShell id="about" variant="muted">
          <div className="container mx-auto px-4">
            <SectionHeading
              eyebrow="About"
              title="About Brain Drone Racing"
              subtitle="Neurotechnology meets flight — learn what makes brain-drone racing unique."
            />
            <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-5 text-lg leading-relaxed text-gray-700">
                <p>
                  Brain Drone Racing is an exciting new sport that combines cutting-edge neurotechnology with drone
                  piloting. Racers wear EEG headsets that translate their brain signals into commands, allowing them to
                  control drones with their thoughts alone.
                </p>
                <p>
                  Our team at the University of Alabama is at the forefront of this revolutionary sport, pushing the
                  boundaries of what&apos;s possible when human minds and machines work in perfect harmony.
                </p>
              </div>
              <div className="aspect-video overflow-hidden rounded-2xl shadow-2xl ring-2 ring-[#9E1B32]/20 ring-offset-4 ring-offset-slate-100">
                <iframe
                  className="h-full w-full"
                  src="https://www.youtube.com/embed/-1TdAWCGu2c?autoplay=0"
                  title="Brain-Drone Racing at The University of Alabama"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </SectionShell>

        <SectionShell id="gallery" variant="gradient">
          <div className="container mx-auto px-4">
            <SectionHeading
              eyebrow="Media"
              title="Gallery"
            />

            {galleryMedia.length > 0 && (
              <div className="mb-4">
                <GalleryMediaCarousel items={galleryMedia} />
              </div>
            )}

            {galleryItems.length === 0 && (
              <div className="text-center text-gray-600 bg-white border border-dashed border-gray-300 rounded-xl p-8">
                No gallery media yet. Run <code className="rounded bg-gray-100 px-1">npm run sync-gallery</code> after
                adding images to <code className="rounded bg-gray-100 px-1">public/Gallery</code>.
              </div>
            )}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 rounded-3xl border border-white/20 bg-gradient-to-br from-[#9E1B32] to-[#6b1420] p-8 text-center text-white shadow-2xl shadow-[#9E1B32]/30 md:p-10"
            >
              <h3 className="mb-2 text-2xl font-bold">Want to be featured?</h3>
              <p className="mb-6 text-white/80">
                Race highlights and event photos from the BCI community can be showcased here.
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push("/schedule")}
                className="inline-flex items-center rounded-full bg-white px-6 py-3 font-semibold text-[#9E1B32] shadow-lg transition hover:bg-gray-100"
              >
                Book a Demo <ChevronRight className="ml-2 h-5 w-5" />
              </motion.button>
            </motion.div>
          </div>
        </SectionShell>

        <SectionShell id="events" variant="mesh">
          <div className="container mx-auto px-4">
            <SectionHeading
              eyebrow="Calendar"
              title="Upcoming Events"
              subtitle="Stay in the loop for races, demos, and campus appearances."
            />
            <div className="mx-auto max-w-4xl space-y-6">
              {events.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className="group rounded-2xl border border-gray-100 bg-white/90 p-6 shadow-lg shadow-gray-200/50 backdrop-blur-sm transition hover:border-[#9E1B32]/25 hover:shadow-xl"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#9E1B32]/10 text-[#9E1B32] transition group-hover:bg-[#9E1B32] group-hover:text-white">
                      <Calendar className="h-6 w-6" />
                    </span>
                    <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                  </div>
                  <p className="mb-2 text-sm font-medium text-[#9E1B32]">Date: {event.date}</p>
                  <p className="leading-relaxed text-gray-600">{event.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </SectionShell>

        <SectionShell id="team" variant="muted">
          <div className="container mx-auto px-4">
            <SectionHeading
              eyebrow="People"
              title="Meet Our Team"
              subtitle="Students and mentors pushing BCI and aerial robotics forward at UA."
            />
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group mx-auto w-full max-w-[280px] overflow-hidden rounded-2xl border border-white/80 bg-white shadow-xl shadow-gray-300/40 ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-2xl sm:max-w-none"
                >
                  <div className="relative h-[18rem] overflow-hidden sm:h-[21.6rem]">
                    <Image
                      src={member.imgSrc || "/placeholder.svg"}
                      alt={member.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition group-hover:opacity-100" />
                  </div>
                  <div className="p-5">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                      <Link href={member.linkedinUrl} target="_blank" rel="noopener noreferrer">
                        <LinkedInLogoIcon className="h-6 w-6 text-[#0077B5] transition hover:scale-110" />
                      </Link>
                    </div>
                    <p className="mb-2 text-sm text-gray-600">{member.classification}</p>
                    <p className="text-sm italic text-gray-500">&quot;{member.yearbookQuote}&quot;</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </SectionShell>

        <SectionShell id="join" variant="join" withBlobs={false}>
          <div className="container mx-auto px-4 text-center">
            <SectionHeading
              eyebrow="Get involved"
              light
              title="Join Our Team"
              subtitle="Passionate about neurotechnology and drones? We're building the future of racing — no experience required, just curiosity."
            />
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="#"
                className="inline-flex items-center rounded-full border-2 border-white/40 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Coming soon <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </SectionShell>
      </main>

      <footer className="relative overflow-hidden border-t border-white/10 bg-gradient-to-br from-[#7A1526] via-[#9E1B32] to-[#4a0d18] py-12 text-white">
        <div className="pointer-events-none absolute inset-0 opacity-20" aria-hidden>
          <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-white blur-3xl" />
          <div className="absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-amber-200 blur-3xl" />
        </div>
        <div className="container relative z-10 mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="text-center md:text-left">
              <h3 className="mb-2 text-xl font-semibold tracking-tight">UA Brain Drone Race Team</h3>
              <p className="text-white/80">University of Alabama, Tuscaloosa, AL</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
              <Link href="#" className="text-white/90 transition hover:text-white hover:underline">
                Facebook
              </Link>
              <Link href="#" className="text-white/90 transition hover:text-white hover:underline">
                Twitter
              </Link>
              <Link href="#" className="text-white/90 transition hover:text-white hover:underline">
                Instagram
              </Link>
              <Link href="#" className="text-white/90 transition hover:text-white hover:underline">
                YouTube
              </Link>
            </div>
          </div>
          <div className="mt-10 border-t border-white/15 pt-8 text-center text-sm text-white/70">
            <p>&copy; 2026 UA Brain Drone Race Team. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}