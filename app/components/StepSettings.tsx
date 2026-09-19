'use client'

import { useApp } from '../context/AppContext'
import {
  DIFFICULTY_LEVELS,
  formatDuration,
  SESSION_MINUTES_OPTIONS,
  SESSIONS_MAX,
  SESSIONS_MIN,
  WEEKS_MAX,
  WEEKS_MIN,
  type DifficultyLevel,
} from '../lib/workout'
import { NumberField } from './NumberField'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

export const StepSettings = () => {
  const {
    difficulty,
    setDifficulty,
    sessionsPerWeek,
    setSessionsPerWeek,
    weeks,
    setWeeks,
    sessionMinutes,
    setSessionMinutes,
  } = useApp()

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="level">Level</Label>
        <Select
          value={difficulty}
          onValueChange={(value) => setDifficulty(value as DifficultyLevel)}
        >
          <SelectTrigger id="level">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DIFFICULTY_LEVELS.map((level) => (
              <SelectItem key={level.value} value={level.value}>
                {level.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <NumberField
        label="Sesh per week"
        value={sessionsPerWeek}
        min={SESSIONS_MIN}
        max={SESSIONS_MAX}
        onChange={setSessionsPerWeek}
      />

      <NumberField
        label="Plan duration"
        value={weeks}
        min={WEEKS_MIN}
        max={WEEKS_MAX}
        onChange={setWeeks}
      />

      <div className="space-y-2">
        <Label htmlFor="session-duration">Session duration</Label>
        <Select
          value={String(sessionMinutes)}
          onValueChange={(value) => setSessionMinutes(Number(value))}
        >
          <SelectTrigger id="session-duration">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SESSION_MINUTES_OPTIONS.map((minutes) => (
              <SelectItem key={minutes} value={String(minutes)}>
                {formatDuration(minutes)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
