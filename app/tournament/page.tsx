"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowUpDown, ArrowDown, ArrowUp, Trophy, Clock, RefreshCw, Crown } from "lucide-react"
import { initializeApp } from "firebase/app"
import { getFirestore, collection, getDocs, query, orderBy } from "firebase/firestore"

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};
// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

interface Player {
  id: number
  name: string
  university: string
}

interface Match {
  id: number
  player1: Player | null
  player2: Player | null
  status: "completed" | "scheduled" | "pending" | "in-progress"
  winner?: number
  time1?: string
  time2?: string
  time?: string
}

interface Round {
  name: string
  matches: Match[]
}

interface Tournament {
  tournamentName: string
  rounds: Round[]
}

interface LeaderboardEntry {
  id: number
  name: string
  wins: number
  totalRaces: number
  rank: number // Added rank field
}

export default function FixturesLeaderboard() {
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [sortField, setSortField] = useState<string>("rank") // Changed default sort to rank
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc") // Changed default to ascending for rank
  const [loading, setLoading] = useState<boolean>(true)
  const [activeTab, setActiveTab] = useState<"fixtures" | "leaderboard">("fixtures")
  const [simulatingRace, setSimulatingRace] = useState<boolean>(false)
  const [currentRace, setCurrentRace] = useState<Match | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tournament fixtures from local JSON
        const fixturesResponse = await fetch("/data/fixtures.json")
        const fixturesData = await fixturesResponse.json()
        setTournament(fixturesData)

        // Fetch leaderboard data from Firebase
        try {
          const leaderboardQuery = query(collection(db, "race"), orderBy("rank", "asc"))
          const leaderboardSnapshot = await getDocs(leaderboardQuery)
          const leaderboardData: LeaderboardEntry[] = []
          // console.log(leaderboardSnapshot.docs)
          leaderboardSnapshot.forEach((doc) => {
            const data = doc.data()
            leaderboardData.push({
              id: data.id || Number.parseInt(doc.id),
              name: data.name || "Unknown Racer",
              wins: data.wins || 0,
              totalRaces: data.totalRaces || 0,
              rank: data.rank || 999, // Default high rank if not provided
            })
          })

          setLeaderboard(leaderboardData)
        } catch (firebaseError) {
          console.error("Error fetching from Firebase:", firebaseError)
          // Fallback to sample data if Firebase fails
          setLeaderboard([
            { id: 1, name: "Jane Doe", wins: 2, totalRaces: 2, rank: 1 },
            { id: 5, name: "Emily Johnson", wins: 1, totalRaces: 1, rank: 2 },
            { id: 4, name: "Sarah Williams", wins: 1, totalRaces: 2, rank: 3 },
            { id: 8, name: "Lisa Chen", wins: 1, totalRaces: 1, rank: 4 },
            { id: 2, name: "Alex Johnson", wins: 0, totalRaces: 1, rank: 5 },
            { id: 3, name: "Michael Brown", wins: 0, totalRaces: 1, rank: 6 },
            { id: 6, name: "David Lee", wins: 0, totalRaces: 1, rank: 7 },
            { id: 7, name: "John Smith", wins: 0, totalRaces: 1, rank: 8 },
          ])
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      // Set default sort direction based on field
      if (field === "rank") {
        setSortDirection("asc") // Rank should default to ascending (1, 2, 3...)
      } else {
        setSortDirection("desc") // Other fields default to descending
      }
    }
  }

  const sortedLeaderboard = [...leaderboard].sort((a, b) => {
    const valueA = a[sortField as keyof LeaderboardEntry]
    const valueB = b[sortField as keyof LeaderboardEntry]

    if (typeof valueA === "number" && typeof valueB === "number") {
      return sortDirection === "asc" ? valueA - valueB : valueB - valueA
    }

    // Fallback for string comparison
    return sortDirection === "asc"
      ? String(valueA).localeCompare(String(valueB))
      : String(valueB).localeCompare(String(valueA))
  })

  const simulateRace = () => {
    if (!tournament) return

    // Find the first scheduled match
    let scheduledMatch: Match | undefined
    let roundIndex = -1
    let matchIndex = -1

    tournament.rounds.forEach((round, rIdx) => {
      round.matches.forEach((match, mIdx) => {
        if (match.status === "scheduled" && match.player1 && match.player2 && !scheduledMatch) {
          scheduledMatch = match
          roundIndex = rIdx
          matchIndex = mIdx
        }
      })
    })

    if (!scheduledMatch || roundIndex === -1 || matchIndex === -1) return

    setSimulatingRace(true)
    setCurrentRace({ ...scheduledMatch, status: "in-progress" })

    // Simulate race for 5 seconds
    setTimeout(() => {
      // Generate random times
      const time1 = (1 + Math.random() * 0.3).toFixed(2)
      const time2 = (1 + Math.random() * 0.3).toFixed(2)

      // Determine winner
      const winner =
        Number.parseFloat(time1) < Number.parseFloat(time2) ? scheduledMatch!.player1!.id : scheduledMatch!.player2!.id

      // Format times as MM:SS.ms
      const formattedTime1 = `01:${time1}`
      const formattedTime2 = `01:${time2}`

      // Update tournament data
      const updatedTournament = { ...tournament }
      updatedTournament.rounds[roundIndex].matches[matchIndex] = {
        ...scheduledMatch!,
        status: "completed",
        winner,
        time1: formattedTime1,
        time2: formattedTime2,
      }

      // Update next round if needed
      if (roundIndex < updatedTournament.rounds.length - 1) {
        const nextRoundMatchIndex = Math.floor(matchIndex / 2)
        const isFirstMatch = matchIndex % 2 === 0

        const nextRoundMatch = updatedTournament.rounds[roundIndex + 1].matches[nextRoundMatchIndex]

        if (nextRoundMatch.status === "pending") {
          const winnerPlayer =
            winner === scheduledMatch!.player1!.id ? scheduledMatch!.player1 : scheduledMatch!.player2

          if (isFirstMatch) {
            nextRoundMatch.player1 = winnerPlayer
          } else {
            nextRoundMatch.player2 = winnerPlayer
          }

          // If both players are set, update status to scheduled
          if (nextRoundMatch.player1 && nextRoundMatch.player2) {
            nextRoundMatch.status = "scheduled"
            nextRoundMatch.time = "TBD"
          }
        }
      }

      // Update leaderboard
      const updatedLeaderboard = [...leaderboard]

      // Update winner stats
      const winnerIndex = updatedLeaderboard.findIndex((entry) => entry.id === winner)
      if (winnerIndex !== -1) {
        updatedLeaderboard[winnerIndex].wins += 1
        updatedLeaderboard[winnerIndex].totalRaces += 1
        
        // Note: We're not updating the rank here as we're using the provided ranks
      }

      // Update loser stats
      const loserId = winner === scheduledMatch!.player1!.id ? scheduledMatch!.player2!.id : scheduledMatch!.player1!.id
      const loserIndex = updatedLeaderboard.findIndex((entry) => entry.id === loserId)
      if (loserIndex !== -1) {
        updatedLeaderboard[loserIndex].totalRaces += 1
      }

      // Update state
      setTournament(updatedTournament)
      setLeaderboard(updatedLeaderboard)
      setSimulatingRace(false)
      setCurrentRace(null)
    }, 5000)
  }

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="ml-1 h-4 w-4" />
    return sortDirection === "asc" ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9E1B32]"></div>
      </div>
    )
  }

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

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Fixtures & Leaderboard</h1>

        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                activeTab === "fixtures"
                  ? "bg-[#9E1B32] text-white"
                  : "bg-white text-gray-900 border border-gray-200 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("fixtures")}
            >
              Tournament Fixtures
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                activeTab === "leaderboard"
                  ? "bg-[#9E1B32] text-white"
                  : "bg-white text-gray-900 border border-gray-200 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("leaderboard")}
            >
              Leaderboard
            </button>
          </div>
        </div>

        {activeTab === "fixtures" && tournament && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{tournament.tournamentName}</h2>
              <button
                onClick={simulateRace}
                disabled={simulatingRace}
                className={`inline-flex items-center px-4 py-2 rounded-md ${
                  simulatingRace
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#9E1B32] text-white hover:bg-[#7A1526]"
                }`}
              >
                {simulatingRace ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Simulating Race...
                  </>
                ) : (
                  <>
                    <Clock className="w-5 h-5 mr-2" />
                    Simulate Next Race
                  </>
                )}
              </button>
            </div>

            {currentRace && (
              <div className="mb-8 p-4 border-2 border-[#9E1B32] rounded-lg bg-red-50 animate-pulse">
                <h3 className="text-xl font-bold text-center mb-2">Race in Progress</h3>
                <div className="flex justify-center items-center space-x-4">
                  <div className="text-right font-semibold">{currentRace.player1?.name}</div>
                  <div className="text-[#9E1B32] font-bold">VS</div>
                  <div className="text-left font-semibold">{currentRace.player2?.name}</div>
                </div>
              </div>
            )}

<div className="tournament-bracket relative">
  {tournament.rounds.map((round, roundIndex) => (
    <div key={roundIndex} className={`round round-${roundIndex}`}>
      <h3 className="text-xl font-semibold mb-4 text-center">{round.name}</h3>
      <div className="matches-container">
        {round.matches.map((match, matchIndex) => (
          <div
            key={matchIndex}
            className={`match-card relative ${
              match.status === "completed"
                ? "border-green-500 bg-green-50"
                : match.status === "in-progress"
                ? "border-[#9E1B32] bg-red-50 animate-pulse"
                : match.status === "scheduled"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 bg-gray-50"
            }`}
          >
            {match.player1 && match.player2 ? (
              <>
                <div className="flex justify-between items-center mb-2">
                  <div
                    className={`font-medium ${
                      match.winner === match.player1.id ? "font-bold text-green-700" : ""
                    }`}
                  >
                    {match.player1.name}
                    {/* Add crown for Finals winner */}
                    {round.name === "Final" && match.winner === match.player1.id && (
                      <Crown className="inline-block ml-2 text-yellow-500 w-5 h-5" />
                    )}
                  </div>
                  <div className="text-sm">{match.time1 || ""}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div
                    className={`font-medium ${
                      match.winner === match.player2.id ? "font-bold text-green-700" : ""
                    }`}
                  >
                    {match.player2.name}
                    {/* Add crown for Finals winner */}
                    {round.name === "Final" && match.winner === match.player2.id && (
                      <Crown className="inline-block ml-2 text-yellow-500 w-5 h-5" />
                    )}
                  </div>
                  <div className="text-sm">{match.time2 || ""}</div>
                </div>
                {match.status === "scheduled" && (
                  <div className="mt-2 text-xs text-blue-600">{match.time}</div>
                )}
              </>
            ) : match.player1 ? (
              <div className="font-medium">{match.player1.name} (Waiting for opponent)</div>
            ) : (
              <div className="text-gray-500 italic">To be determined</div>
            )}
          </div>
        ))}
      </div>
    </div>
  ))}

              {/* Bracket connectors */}
              <div className="bracket-lines">
  {/* Quarter Finals to Semi Finals */}
  <div className="connector qf-sf-1"></div>
  <div className="connector qf-sf-2"></div>
  <div className="connector qf-sf-3"></div>
  <div className="connector qf-sf-4"></div>
  <div className="connector qf-sf-5"></div>
  <div className="connector qf-sf-6"></div>
  <div className="connector qf-sf-7"></div>
  <div className="connector qf-sf-8"></div>
  
  {/* Semi Finals to Finals */}
  <div className="connector sf-f-1"></div>
  <div className="connector sf-f-2"></div>
  <div className="connector sf-f-3"></div>
  <div className="connector sf-f-4"></div>
</div>
            </div>
          </div>
        )}

        {activeTab === "leaderboard" && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left cursor-pointer" onClick={() => handleSort("rank")}>
                    <div className="flex items-center">Rank {getSortIcon("rank")}</div>
                  </th>
                  <th className="py-3 px-4 text-left cursor-pointer" onClick={() => handleSort("name")}>
                    <div className="flex items-center">Name {getSortIcon("name")}</div>
                  </th>
                  <th className="py-3 px-4 text-left cursor-pointer" onClick={() => handleSort("wins")}>
                    <div className="flex items-center">Wins {getSortIcon("wins")}</div>
                  </th>
                  <th className="py-3 px-4 text-left cursor-pointer" onClick={() => handleSort("totalRaces")}>
                    <div className="flex items-center">Races {getSortIcon("totalRaces")}</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedLeaderboard.map((entry) => (
                  <tr key={entry.id} className={entry.rank % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="py-3 px-4 border-t border-gray-200">{entry.rank}</td>
                    <td className="py-3 px-4 border-t border-gray-200 font-medium">{entry.name}</td>
                    <td className="py-3 px-4 border-t border-gray-200">
                      <div className="flex items-center">
                        <Trophy className="w-4 h-4 mr-1 text-yellow-500" />
                        {entry.wins}
                      </div>
                    </td>
                    <td className="py-3 px-4 border-t border-gray-200">{entry.totalRaces}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <footer className="bg-[#9E1B32] text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 UA Brain Drone Race Team. All rights reserved.</p>
        </div>
      </footer>

      <style jsx>{`
        .tournament-bracket {
          display: flex;
          justify-content: space-between;
          margin: 40px 0;
          position: relative;
        }
        
        .round {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          padding: 0 10px;
        }
        
        .matches-container {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
        }
        
        .match-card {
          border: 1px solid;
          border-radius: 8px;
          padding: 12px;
          margin: 10px 0;
          background-color: white;
          position: relative;
          z-index: 2;
        }
        
        .round-0 .matches-container {
          justify-content: space-around;
        }
        
        .round-1 .matches-container {
          justify-content: space-around;
          padding-top: 60px;
          padding-bottom: 60px;
        }
        
        .round-2 .matches-container {
          justify-content: center;
          padding-top: 120px;
          padding-bottom: 120px;
        }
        
        .bracket-lines {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          pointer-events: none;
        }
        
        .connector {
          position: absolute;
          border: 2px solid #9E1B32;
          z-index: 1;
        }
        
        /* Quarter Finals to Semi Finals connectors */
        .qf-sf-1 {
          top: 28%;
          left: 30%;
          width: 10%;
          height: 0;
          border-bottom: 2px solid #9E1B32;
        }
        .qf-sf-2 {
          top: 40%;
          left: 30%;
          width: 10%;
          height: 0;
          border-bottom: 2px solid #9E1B32;
        }
        .qf-sf-3 {
          top: 65%;
          left: 30%;
          width: 10%;
          height: 0;
          border-right: 2px solid #9E1B32;
        }
        
        .qf-sf-4 {
          top: 80%;
          left: 30%;
          width: 10%;
          height: 0;
          border-right: 2px solid #9E1B32;
        }
        
        /* Semi Finals to Finals connectors */
        .sf-f-1 {
          top: 57%;
          left: 63%;
          width: 10%;
          height: 0;
          border-bottom: 2px solid #9E1B32;
        }
        
        .sf-f-2 {
          top: 57%;
          left: 63%;
          height: 6%;
          width: 0;
          border-right: 2px solid #9E1B32;
        }
        .sf-f-3 {
          top: 51%;
          left: 63%;
          width: 10%;
          height: 0;
          border-bottom: 2px solid #9E1B32;
        }
        
        .sf-f-4 {
          top: 45%;
          left: 63%;
          height: 6%;
          width: 0;
          border-right: 2px solid #9E1B32;
        }
      `}</style>
    </div>
  )
}