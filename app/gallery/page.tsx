import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function Gallery() {
  // Sample gallery items - replace with your actual content
  const galleryItems = [
    {
      type: "image",
      src: "/placeholder.svg",
      title: "Team Practice Session",
      description: "Our team practicing with the latest BCI technology",
    },
    {
      type: "video",
      videoId: "-1TdAWCGu2c",
      title: "Brain-Drone Racing Demo",
      description: "Watch our team demonstrate brain-controlled drone racing",
    },
    {
      type: "image",
      src: "/placeholder.svg",
      title: "National Competition",
      description: "Competing at the National Championships",
    },
    {
      type: "image",
      src: "/placeholder.svg",
      title: "Lab Setup",
      description: "Our state-of-the-art brain-drone racing facility",
    },
    {
      type: "image",
      src: "/placeholder.svg",
      title: "Team Photo",
      description: "The UA Brain Drone Racing Team",
    },
    {
      type: "image",
      src: "/placeholder.svg",
      title: "Training Session",
      description: "New members learning to control drones with BCI",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-[#9E1B32] text-white py-4">
        <div className="container mx-auto px-4">
          <Link href="/" className="inline-flex items-center text-white hover:text-gray-200">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Gallery</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryItems.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {item.type === "video" ? (
                <div className="aspect-video">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${item.videoId}`}
                    title={item.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="relative aspect-video">
                  <Image src={item.src || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                </div>
              )}
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-[#9E1B32] text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 UA Brain Drone Race Team. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

