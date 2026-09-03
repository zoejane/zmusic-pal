"use client"

import { useState, useMemo } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CardWrapper } from "@/components/ui/card-wrapper"

const rootNotes = ["C", "Db", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"]

const chordTypes = [
  { value: "major", label: "Major | 大三和弦" },
  { value: "minor", label: "Minor | 小三和弦" },
  { value: "dim", label: "Dim | 减三和弦" },
  { value: "aug", label: "Aug | 增三和弦" },
]

// Note sequence (including repeated sharp/flat forms, for calculation)
const noteSequence = {
  sharp: [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ],
  flat: [
    "C",
    "Db",
    "D",
    "Eb",
    "E",
    "F",
    "Gb",
    "G",
    "Ab",
    "A",
    "Bb",
    "B",
    "C",
    "Db",
    "D",
    "Eb",
    "E",
    "F",
    "Gb",
    "G",
    "Ab",
    "A",
    "Bb",
    "B",
  ],
}

// Special note mappings with comments
const specialNoteMap = {
  "E aug 3": "B#（C）", // E augmented: E - G# - B# -> C
  "F# aug 3": "C##（D）", // F# augmented: F# - A# - C## -> D
  "A aug 3": "E#（F）", // A augmented: A - C# - E# -> F
  "Bb dim 3": "Fb（E）", // Bb diminished: Bb - Db - Fb -> E
  "B aug 3": "Fx（G）", // B augmented: B - D# - Fx -> G
}

function getChordNotes(rootNote: string, chordType: string): string[] {
  const useFlats = ["F", "Bb", "Eb", "Ab", "Db", "Gb"].includes(rootNote)
  const sequence = useFlats ? noteSequence.flat : noteSequence.sharp
  const rootIndex = sequence.indexOf(rootNote)

  let intervals: number[]
  switch (chordType) {
    case "major":
      intervals = [0, 4, 7] // Major third (4) and perfect fifth (7)
      break
    case "minor":
      intervals = [0, 3, 7] // Minor third (3) and perfect fifth (7)
      break
    case "dim":
      intervals = [0, 3, 6] // Minor third (3) and diminished fifth (6)
      break
    case "aug":
      intervals = [0, 4, 8] // Major third (4) and augmented fifth (8)
      break
    default:
      return []
  }

  return intervals.map((interval, index) => {
    // Check if there's a special case to handle
    const specialKey = `${rootNote} ${chordType} ${index + 1}`
    if (specialNoteMap[specialKey as keyof typeof specialNoteMap]) {
      return specialNoteMap[specialKey as keyof typeof specialNoteMap]
    }
    return sequence[rootIndex + interval]
  })
}

export function ChordFinder() {
  const [rootNote, setRootNote] = useState("C")
  const [chordType, setChordType] = useState("major")

  const chordNotes = useMemo(() => {
    return getChordNotes(rootNote, chordType)
  }, [rootNote, chordType])

  return (
    <CardWrapper title="Chord Finder | 查和弦" className="text-sm">
      <div className="space-y-1">
        <div className="grid grid-cols-2 gap-0.5">
          <Select value={rootNote} onValueChange={setRootNote}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Root Note | 选择根音" />
            </SelectTrigger>
            <SelectContent>
              {rootNotes.map((note) => (
                <SelectItem key={note} value={note}>
                  {note}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={chordType} onValueChange={setChordType}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Chord Type | 选择和弦类型" />
            </SelectTrigger>
            <SelectContent>
              {chordTypes.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="bg-muted/30 rounded-md p-1 text-center">
          <p className="text-sm">
            Notes | 组成音：<span className="text-foreground font-medium">{chordNotes.join(" - ")}</span>
          </p>
        </div>
      </div>
    </CardWrapper>
  )
}

