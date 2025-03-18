"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ChevronRight, Trophy, Calendar } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { LinkedInLogoIcon } from "@radix-ui/react-icons";
import CalendlyEmbed from "@/components/calendly_embed";

interface GalleryItem {
  type: string;
  src?: string;
  videoId?: string;
  title: string;
  description: string;
}

interface Achievement {
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

export default function Home() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const router = useRouter();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const galleryResponse = await fetch("/data/gallery.json");
      console.log(galleryResponse);
      const galleryData = await galleryResponse.json();
      setGalleryItems(galleryData);

      const achievementsResponse = await fetch("/data/achievements.json");
      const achievementsData = await achievementsResponse.json();
      setAchievements(achievementsData);

      const eventsResponse = await fetch("/data/events.json");
      const eventsData = await eventsResponse.json();
      setEvents(eventsData);

      const teamsResponse = await fetch("/data/teams.json");
      const teamsData = await teamsResponse.json();
      setTeamMembers(teamsData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="bg-[#9E1B32] text-white py-4 fixed w-full z-50">
        <div className="container mx-auto px-4 flex justify-between items-center">
        <h1
            className="text-2xl font-bold cursor-pointer block lg:hidden"
            onClick={() => router.push("/")}
          >
            BDR
          </h1>
          <h1
            className="text-2xl font-bold cursor-pointer hidden lg:block"
            onClick={() => router.push("/")}
          >
            UA Brain Drone Race Team
          </h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <button
                  onClick={() => scrollToSection("about")}
                  className="hover:underline"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("achievements")}
                  className="hover:underline"
                >
                  Achievements
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("gallery")}
                  className="hover:underline"
                >
                  Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("events")}
                  className="hover:underline"
                >
                  Events
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("team")}
                  className="hover:underline"
                >
                  Team
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("join")}
                  className="hover:underline"
                >
                  Join Us
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="pt-16">
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <motion.div
            className="absolute inset-0 z-0"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
            style={{
              backgroundImage: 'url("/drone-bg.svg")',
              backgroundSize: "200% 200%",
            }}
          />
          <div className="relative z-10 text-center">
            <h2 className="text-5xl font-bold mb-4">
              Welcome to the Future of Racing
            </h2>
            <p className="text-xl mb-8">
              Control drones with your mind at the University of Alabama
            </p>
            <button
              onClick={() => router.push("/schedule")}
              className="bg-[#9E1B32] text-white px-12 py-6 rounded-full font-semibold hover:bg-[#7A1526] transition duration-300 text-2xl"
            >
              Schedule Now !!
            </button>
            
          </div>
        </section>

        <section id="about" className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">
              About Brain Drone Racing
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div>
                <p className="text-lg mb-4">
                  Brain Drone Racing is an exciting new sport that combines
                  cutting-edge neurotechnology with drone piloting. Racers wear
                  EEG headsets that translate their brain signals into commands,
                  allowing them to control drones with their thoughts alone.
                </p>
                <p className="text-lg">
                  Our team at the University of Alabama is at the forefront of
                  this revolutionary sport, pushing the boundaries of what's
                  possible when human minds and machines work in perfect
                  harmony.
                </p>
              </div>
              <div className="aspect-video">
                <iframe
                  className="w-full h-full rounded-lg shadow-lg"
                  src="https://www.youtube.com/embed/-1TdAWCGu2c"
                  title="Brain-Drone Racing at The University of Alabama"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </section>

        {/* <section id="achievements" className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Our Achievements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Trophy className="w-12 h-12 text-[#9E1B32] mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    {achievement.title}
                  </h3>
                  <p>{achievement.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section> */}

        <section id="gallery" className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Gallery</h2>
            <div className="max-w-5xl mx-auto">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {galleryItems.map((item, index) => (
                    <CarouselItem
                      key={index}
                      className="md:basis-1/2 lg:basis-1/3"
                    >
                      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        {item.type === "video" ? (
                          <div className="aspect-video">
                          <iframe
                            className="w-full h-full"
                            src={item.src}
                            title={item.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                        ) : (
                          <div className="relative aspect-video">
                            <Image
                              src={item.src || "/placeholder.svg"}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="text-lg font-semibold mb-2">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </div>
        </section>

        <section id="events" className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Upcoming Events
            </h2>
            <div className="space-y-6">
              {events.map((event, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center mb-4">
                    <Calendar className="w-6 h-6 text-[#9E1B32] mr-2" />
                    <h3 className="text-xl font-semibold">{event.title}</h3>
                  </div>
                  <p className="mb-2">Date: {event.date}</p>
                  <p>{event.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="team" className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Meet Our Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                >
                  <div className="relative h-64">
                    <Image
                      src={member.imgSrc || "/placeholder.svg"}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold mb-1">
                        {member.name}
                      </h3>
                      <Link
                        href={member.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <LinkedInLogoIcon className="w-6 h-6 text-[#0077B5]" />
                      </Link>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {member.classification}
                    </p>
                    <p className="text-sm italic">"{member.yearbookQuote}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="join" className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">Join Our Team</h2>
            <p className="text-xl mb-8">
              Are you passionate about neurotechnology and drones? We're always
              looking for new members to join our cutting-edge team. No
              experience necessary - just bring your enthusiasm and willingness
              to learn!
            </p>
            <Link
              href="#"
              className="inline-flex items-center bg-[#9E1B32] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#7A1526] transition duration-300"
            >
              Comming Soon!  <ChevronRight className="ml-2" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-[#9E1B32] text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-semibold mb-2">
                UA Brain Drone Race Team
              </h3>
              <p>University of Alabama, Tuscaloosa, AL</p>
            </div>
            <div className="flex space-x-4">
              <Link href="#" className="hover:underline">
                Facebook
              </Link>
              <Link href="#" className="hover:underline">
                Twitter
              </Link>
              <Link href="#" className="hover:underline">
                Instagram
              </Link>
              <Link href="#" className="hover:underline">
                YouTube
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p>&copy; 2025 UA Brain Drone Race Team. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}