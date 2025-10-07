"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings } from "lucide-react"

const leagueData = [
  {
    name: "Premier League",
    enrolledTeams: 12,
    totalPlayers: 24,
    gamePlayed: 11,
    image: "/outdoor-tennis-court.png",
  },
  {
    name: "Championship",
    enrolledTeams: 12,
    totalPlayers: 24,
    gamePlayed: 11,
    image: "/tennis-net.jpg",
  },
  {
    name: "Division 1",
    enrolledTeams: 12,
    totalPlayers: 24,
    gamePlayed: 11,
    image: "/outdoor-basketball-court.png",
  },
  {
    name: "Division 2",
    enrolledTeams: 12,
    totalPlayers: 24,
    gamePlayed: 11,
    image: "/basketball-player-action.png",
  },
]

const chartData = [
  { month: "Jan", matches: 22 },
  { month: "Feb", matches: 14 },
  { month: "Mar", matches: 18 },
  { month: "April", matches: 17 },
  { month: "May", matches: 27 },
  { month: "June", matches: 23 },
  { month: "July", matches: 12 },
  { month: "Aug", matches: 17 },
  { month: "Sep", matches: 29 },
  { month: "Oct", matches: 22 },
  { month: "Nov", matches: 10 },
  { month: "Dec", matches: 33 },
]

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center">Dashboard</h1>

        {/* League Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {leagueData.map((league) => (
            <Card key={league.name} className="relative overflow-hidden">
              <div className="relative h-48">
                <img
                  src={league.image || "/placeholder.svg"}
                  alt={league.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-4 right-4">
                  <button className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors">
                    <Settings className="h-4 w-4" />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl font-bold text-white">{league.name}</h3>
                </div>
              </div>
              <div className="p-4 grid grid-cols-3 gap-4 bg-white">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Enrolled Teams</p>
                  <p className="text-2xl font-bold">{league.enrolledTeams}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total Players</p>
                  <p className="text-2xl font-bold">{league.totalPlayers}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Game Played</p>
                  <p className="text-2xl font-bold">{league.gamePlayed}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Chart */}
        <Card className="p-6 bg-[#e8f5f3]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Matches Completed per Month</h2>
            <Select defaultValue="this-year">
              <SelectTrigger className="w-32 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-year">This year</SelectItem>
                <SelectItem value="last-year">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ChartContainer
            config={{
              matches: {
                label: "Matches",
                color: "#4a9b8e",
              },
            }}
            className="h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="matches" fill="#4a9b8e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>
      </div>
    </DashboardLayout>
  )
}
