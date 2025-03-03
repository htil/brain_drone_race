'use client'

import CalendlyEmbed from "@/components/calendly_embed";
import { useRouter } from "next/navigation";

export default function Schedule() {
    const router = useRouter();
    return (
        <div className="min-h-screen bg-white text-gray-900">
          <header className="bg-[#9E1B32] text-white py-4 fixed w-full z-50">
            <div className="container mx-auto px-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold cursor-pointer" onClick={()=> router.push("/")} >UA Brain Drone Race Team</h1>
              <nav>
                <ul className="flex space-x-4">
                  <li>
                    <button
                      onClick={()=> router.push("/")}
                      className="hover:underline"
                    >
                      About
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={()=> router.push("/")}
                      className="hover:underline"
                    >
                      Achievements
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={()=> router.push("/")}
                      className="hover:underline"
                    >
                      Gallery
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={()=> router.push("/")}
                      className="hover:underline"
                    >
                      Events
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={()=> router.push("/")}
                      className="hover:underline"
                    >
                      Team
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={()=> router.push("/")}
                      className="hover:underline"
                    >
                      Join Us
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </header>
    
          <div className="pt-16 h-[1000px]">
                <CalendlyEmbed url="https://calendly.com/brain_drone_race/brain-drone-race-qualifier-2nd-week-clone"/>
            </div>
        </div>
    )

}