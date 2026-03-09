'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { subDays, isWeekend, format, addDays, isBefore } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useSession } from '@/lib/auth-client'
import AppNavbar from '@/components/layout/AppNavbar'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts'

const MOOD_EMOJI: Record<number, string> = { 1: '😞', 2: '😐', 3: '😊' }

function getLastWorkingDays(count: number): string[] {
  const days: string[] = []
  let d = new Date()
  while (days.length < count) {
    if (!isWeekend(d)) {
      days.push(format(d, 'yyyy-MM-dd'))
    }
    d = subDays(d, 1)
  }
  return days.reverse()
}

function getWorkingDaysInRange(start: Date, end: Date): string[] {
  const days: string[] = []
  let d = new Date(start)
  while (d <= end) {
    if (!isWeekend(d)) days.push(format(d, 'yyyy-MM-dd'))
    d = addDays(d, 1)
  }
  return days
}

export default function NikoNikoPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const [team, setTeam] = useState<{ id: string; name: string; memberId: string; role: string } | null>(null)
  const [sprints, setSprints] = useState<{ id: string; number: number; start_date: string; end_date: string }[]>([])
  const [selectedSprintId, setSelectedSprintId] = useState<string | null>(null)
  const [members, setMembers] = useState<{ id: string; name: string; role: string }[]>([])
  const [days, setDays] = useState<string[]>([])
  const [moods, setMoods] = useState<Record<string, number>>({})
  const [hiData, setHiData] = useState<{ sprintNumber: number; hi: number }[]>([])
  const [loading, setLoading] = useState(true)
  const [popover, setPopover] = useState<{ memberId: string; date: string } | null>(null)

  const selectedSprint = sprints.find((s) => s.id === selectedSprintId)
  const workingDays = useMemo(() => {
    if (selectedSprint) {
      const start = new Date(selectedSprint.start_date)
      const end = new Date(selectedSprint.end_date)
      return getWorkingDaysInRange(start, end)
    }
    return getLastWorkingDays(10)
  }, [selectedSprint, selectedSprintId, sprints])
  const isPastSprint = selectedSprint ? isBefore(new Date(selectedSprint.end_date), new Date()) : false
  const isDevTeam = team?.role === 'dev_team'
  const myMemberId = team?.memberId

  const canEditRow = useCallback(
    (memberId: string) => {
      if (!team || isPastSprint) return false
      if (team.role === 'manager' || team.role === 'scrum_master') return true
      if (team.role === 'dev_team') return memberId === myMemberId
      return false
    },
    [team, myMemberId, isPastSprint]
  )

  useEffect(() => {
    if (!isPending && !session) {
      router.replace('/login')
      return
    }
    if (!session) return

    const init = async () => {
      try {
        const teamRes = await fetch('/api/niko-niko/team')
        if (!teamRes.ok) {
          router.replace('/login')
          return
        }
        const teamData = await teamRes.json()
        if (teamData.role === 'guest') {
          router.replace('/login')
          return
        }
        setTeam({
          id: teamData.team.id,
          name: teamData.team.name,
          memberId: teamData.memberId,
          role: teamData.role,
        })

        const sprintsRes = await fetch(`/api/niko-niko/sprints?teamId=${teamData.team.id}`)
        const sprintsData = await sprintsRes.json()
        setSprints(sprintsData.sprints || [])

        const hiRes = await fetch(`/api/niko-niko/hi?teamId=${teamData.team.id}`)
        const hiResData = await hiRes.json()
        setHiData(hiResData.data || [])
      } catch {
        router.replace('/login')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [session, isPending, router])

  useEffect(() => {
    if (!team) return

    const startDate = workingDays[0]
    const endDate = workingDays[workingDays.length - 1]

    const load = async () => {
      const params = new URLSearchParams({
        teamId: team.id,
        startDate,
        endDate,
      })
      if (selectedSprintId) params.set('sprintId', selectedSprintId)
      const res = await fetch(`/api/niko-niko/moods?${params}`)
      const data = await res.json()
      setMembers(data.members || [])
      setDays(data.days || [])
      setMoods(data.moods || {})
    }
    load()
  }, [team, selectedSprintId, workingDays])

  const saveMood = async (memberId: string, date: string, mood: number | null) => {
    if (!team) return
    if (mood === null) {
      await fetch(
        `/api/niko-niko/moods?teamId=${team.id}&memberId=${memberId}&date=${date}`,
        { method: 'DELETE' }
      )
    } else {
      await fetch('/api/niko-niko/moods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: team.id,
          memberId,
          date,
          mood,
          sprintId: selectedSprintId,
        }),
      })
    }
    setPopover(null)
    const params = new URLSearchParams({
      teamId: team.id,
      startDate: workingDays[0],
      endDate: workingDays[workingDays.length - 1],
    })
    if (selectedSprintId) params.set('sprintId', selectedSprintId)
    const res = await fetch(`/api/niko-niko/moods?${params}`)
    const data = await res.json()
    setMoods(data.moods || {})
  }

  const avgMoodByDay = workingDays.map((date) => {
    const vals = members
      .map((m) => moods[`${m.id}_${date}`])
      .filter((v): v is number => v != null && v > 0)
    const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0
    return { date, avg }
  })

  const consecutiveLow = (() => {
    let count = 0
    for (let i = avgMoodByDay.length - 1; i >= 0; i--) {
      if (avgMoodByDay[i].avg > 0 && avgMoodByDay[i].avg < 2.0) {
        count++
        if (count >= 3) {
          const slice = avgMoodByDay.slice(i, i + 3)
          const hi = (slice.reduce((s, x) => s + x.avg, 0) / 3).toFixed(1)
          return { show: true, hi }
        }
      } else {
        count = 0
      }
    }
    return { show: false, hi: '0' }
  })()

  if (isPending || loading || !session) {
    return (
      <div className="min-h-screen bg-[#0f2240] flex items-center justify-center">
        <div className="text-[#c9973a] animate-pulse">Chargement...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#0f2240]">
      <AppNavbar />
      <div className="pt-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-white">Niko-Niko Tracker</h1>
          <div className="flex items-center gap-2">
            <label className="text-white/80 text-sm">Sprint</label>
            <select
              value={selectedSprintId ?? ''}
              onChange={(e) => setSelectedSprintId(e.target.value || null)}
              className="rounded-lg border border-[#c9973a]/50 bg-[#0f2240] text-white px-3 py-2 text-sm focus:ring-2 focus:ring-[#c9973a]"
            >
              <option value="">Sprint actuel</option>
              {sprints.map((s) => (
                <option key={s.id} value={s.id}>
                  Sprint {s.number}
                </option>
              ))}
            </select>
          </div>
        </div>

        {consecutiveLow.show && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200">
            <span className="font-semibold">⚠️ Bien-être critique</span>
            <span className="ml-2">HI moyen: {consecutiveLow.hi}/3</span>
            <Link
              href="/retro"
              className="ml-4 text-[#c9973a] hover:underline font-medium"
            >
              Lancer une rétro →
            </Link>
          </div>
        )}

        <div className="rounded-xl border border-[#c9973a]/30 bg-[#0f2240]/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-[#c9973a]/30">
                  <th className="text-left py-3 px-4 text-white/80 font-medium w-40">Membre</th>
                  {workingDays.map((d) => (
                    <th key={d} className="text-center py-2 px-2 text-white/60 text-xs font-normal w-12">
                      {format(new Date(d), 'dd/MM', { locale: fr })}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id} className="border-b border-white/5">
                    <td className="py-2 px-4 text-white font-medium">{member.name}</td>
                    {workingDays.map((date) => {
                      const mood = moods[`${member.id}_${date}`]
                      const editable = canEditRow(member.id)
                      return (
                        <td key={date} className="py-1 px-1 text-center">
                          <div className="relative">
                            {editable ? (
                              <button
                                onClick={() => setPopover(popover?.memberId === member.id && popover?.date === date ? null : { memberId: member.id, date })}
                                className="w-10 h-10 rounded-lg hover:bg-[#c9973a]/20 transition-colors flex items-center justify-center text-xl"
                              >
                                {mood ? MOOD_EMOJI[mood] : '—'}
                              </button>
                            ) : (
                              <span className="inline-flex w-10 h-10 items-center justify-center text-xl">
                                {mood ? MOOD_EMOJI[mood] : '—'}
                              </span>
                            )}
                            {popover?.memberId === member.id && popover?.date === date && (
                              <>
                                <div
                                  className="fixed inset-0 z-40"
                                  onClick={() => setPopover(null)}
                                  aria-hidden="true"
                                />
                                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 z-50 p-2 rounded-lg bg-[#0f2240] border border-[#c9973a]/50 shadow-xl flex gap-1">
                                  {([3, 2, 1] as const).map((m) => (
                                    <button
                                      key={m}
                                      onClick={() => saveMood(member.id, date, m)}
                                      className="w-10 h-10 rounded-lg hover:bg-[#c9973a]/20 text-2xl flex items-center justify-center"
                                    >
                                      {MOOD_EMOJI[m]}
                                    </button>
                                  ))}
                                  <button
                                    onClick={() => saveMood(member.id, date, null)}
                                    className="px-2 py-1 text-xs text-white/70 hover:bg-red-500/20 rounded"
                                  >
                                    Effacer
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
                <tr className="bg-[#c9973a]/10">
                  <td className="py-2 px-4 text-[#c9973a] font-semibold">Moyenne équipe</td>
                  {workingDays.map((date) => {
                    const row = avgMoodByDay.find((r) => r.date === date)
                    const avg = row?.avg ?? 0
                    const color =
                      avg >= 2.5 ? 'text-green-400' : avg >= 2.0 ? 'text-amber-400' : avg > 0 ? 'text-red-400' : 'text-white/50'
                    return (
                      <td key={date} className={`py-2 px-2 text-center font-medium ${color}`}>
                        {avg > 0 ? avg.toFixed(1) : '—'}
                      </td>
                    )
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {hiData.length > 0 && (
          <div className="mt-8 p-4 rounded-xl border border-[#c9973a]/30 bg-[#0f2240]/80">
            <h2 className="text-lg font-semibold text-white mb-4">HI moyen par sprint</h2>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hiData.map((d) => ({ name: `S${d.sprintNumber}`, hi: d.hi }))}>
                  <XAxis dataKey="name" stroke="#c9973a" fontSize={12} />
                  <YAxis domain={[0, 3]} stroke="#c9973a" fontSize={12} />
                  <Line type="monotone" dataKey="hi" stroke="#c9973a" strokeWidth={2} dot={{ fill: '#c9973a' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
