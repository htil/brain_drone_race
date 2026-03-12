"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Clock, RefreshCw, Crown } from "lucide-react"

interface Player {
  id: number
  name: string
  university?: string
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
  archive?: ArchivedTournament[]
}

interface ArchivedTournament {
  year: number
  tournamentName: string
  rounds: Round[]
}

export default function FixturesLeaderboard() {
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [activeTab, setActiveTab] = useState<"fixtures" | "archive">("fixtures")
  const [simulatingRace, setSimulatingRace] = useState<boolean>(false)
  const [currentRace, setCurrentRace] = useState<Match | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tournament fixtures from local JSON
        const fixturesResponse = await fetch("/data/fixtures.json")
        const fixturesData = await fixturesResponse.json()
        setTournament(fixturesData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

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
      setTournament(updatedTournament)
      setSimulatingRace(false)
      setCurrentRace(null)
    }, 5000)
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
        <h1 className="text-4xl font-bold mb-8 text-center">Tournament Fixtures</h1>

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
              2026 Fixtures
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                activeTab === "archive"
                  ? "bg-[#9E1B32] text-white"
                  : "bg-white text-gray-900 border border-gray-200 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("archive")}
            >
              2025 Archive
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

        {activeTab === "archive" && tournament?.archive && (
          <div className="space-y-8">
            {tournament.archive.map((archived, index) => (
              <div key={index} className="border rounded-lg p-6 bg-gray-50">
                <h2 className="text-2xl font-bold mb-4">
                  {archived.tournamentName} ({archived.year})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {archived.rounds.map((round, rIndex) => (
                    <div key={rIndex}>
                      <h3 className="text-lg font-semibold mb-2">{round.name}</h3>
                      <div className="space-y-3">
                        {round.matches.map((match) => (
                          <div
                            key={match.id}
                            className="border border-gray-200 rounded-md p-3 bg-white"
                          >
                            <div className="flex justify-between text-sm font-medium mb-1">
                              <span
                                className={
                                  match.winner === match.player1?.id
                                    ? "font-bold text-green-700"
                                    : ""
                                }
                              >
                                {match.player1?.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {match.time1 || ""}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm font-medium">
                              <span
                                className={
                                  match.winner === match.player2?.id
                                    ? "font-bold text-green-700"
                                    : ""
                                }
                              >
                                {match.player2?.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {match.time2 || ""}
                              </span>
                            </div>
                            {match.time && (
                              <div className="mt-1 text-xs text-gray-600">
                                {match.time}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-[#9E1B32] text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2026 UA Brain Drone Race Team. All rights reserved.</p>
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