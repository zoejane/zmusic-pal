"use client"

import { useState, useMemo } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CardWrapper } from "@/components/ui/card-wrapper"

const rootNotes = ["C", "Db", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"]
const sharpNotes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
const flatNotes = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"]
const scales = ["大调 / Major", "自然小调 / Natural Minor", "和声小调 / Harmonic Minor", "旋律小调 / Melodic Minor"]

const scalePatterns = {
  Major: [0, 2, 4, 5, 7, 9, 11],
  "Natural Minor": [0, 2, 3, 5, 7, 8, 10],
  "Harmonic Minor": [0, 2, 3, 5, 7, 8, 11],
  "Melodic Minor": {
    ascending: [0, 2, 3, 5, 7, 9, 11],
    descending: [0, 10, 8, 7, 5, 3, 2],
  },
}

function getProperNoteName(index: number, rootNote: string): string {
  const useFlats = ["F", "Bb", "Eb", "Ab", "Db", "Gb"].includes(rootNote)
  const noteArray = useFlats ? flatNotes : sharpNotes
  return noteArray[index % 12]
}

function generateScale(rootNote: string, scaleType: string): string[] | { ascending: string[]; descending: string[] } {
  const pattern = scalePatterns[scaleType.split(" / ")[1] as keyof typeof scalePatterns]
  let rootIndex = flatNotes.indexOf(rootNote)
  if (rootIndex === -1) rootIndex = sharpNotes.indexOf(rootNote)

  if (scaleType.includes("Melodic Minor")) {
    const p = pattern as { ascending: number[]; descending: number[] }
    const ascending = p.ascending.map((interval) => getProperNoteName((rootIndex + interval) % 12, rootNote))
    const descending = p.descending.map((interval) => getProperNoteName((rootIndex + interval) % 12, rootNote))
    return { ascending, descending }
  } else {
    return (pattern as number[]).map((interval) => getProperNoteName((rootIndex + interval) % 12, rootNote))
  }
}

function generateTriads(
  scale: string[] | { ascending: string[]; descending: string[] },
  scaleType: string,
): { degree: string; chord: string; notes: string }[] {
  let triadTypes
  let scaleNotes: string[]

  if (scaleType.includes("Major")) {
    triadTypes = ["", "m", "m", "", "", "m", "dim"]
    scaleNotes = scale as string[]
  } else if (scaleType.includes("Natural Minor")) {
    triadTypes = ["m", "dim", "", "m", "m", "", ""]
    scaleNotes = scale as string[]
  } else if (scaleType.includes("Harmonic Minor")) {
    triadTypes = ["m", "dim", "aug", "m", "", "", "dim"]
    scaleNotes = scale as string[]
  } else {
    // Melodic Minor
    triadTypes = ["m", "m", "aug", "", "", "dim", "dim"]
    scaleNotes = (scale as { ascending: string[] }).ascending
  }

  return scaleNotes.slice(0, 6).map((note, index) => {
    const triadType = triadTypes[index]
    const chordNotes = [scaleNotes[index], scaleNotes[(index + 2) % 7], scaleNotes[(index + 4) % 7]]
    return {
      degree: ["I", "ii", "iii", "IV", "V", "vi"][index],
      chord: `${note}${triadType}`,
      notes: chordNotes.join(" - "),
    }
  })
}

export function KeyFinder() {
  const [rootNote, setRootNote] = useState("C")
  const [scale, setScale] = useState("大调 / Major")

  const scaleNotes = useMemo(() => generateScale(rootNote, scale), [rootNote, scale])
  const commonTriads = useMemo(() => generateTriads(scaleNotes, scale), [scaleNotes, scale])

  return (
    <CardWrapper title="查调 / Key Finder" className="text-sm sm:text-base">
      <div className="space-y-1">
        <div className="grid grid-cols-2 gap-0.5">
          <Select value={rootNote} onValueChange={setRootNote}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="选择音名" />
            </SelectTrigger>
            <SelectContent>
              {rootNotes.map((note) => (
                <SelectItem key={note} value={note}>
                  {note}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={scale} onValueChange={setScale}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="选择调式" />
            </SelectTrigger>
            <SelectContent>
              {scales.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="bg-muted/30 rounded-md p-1 text-center">
          <h3 className="font-medium mb-1 text-sm">音阶 / Scale</h3>
          {scale.includes("Melodic Minor") ? (
            <>
              <p className="text-sm mb-0.5">上行: {(scaleNotes as { ascending: string[] }).ascending.join(" ")}</p>
              <p className="text-sm">下行: {(scaleNotes as { descending: string[] }).descending.join(" ")}</p>
            </>
          ) : (
            <p className="text-sm font-medium">{(scaleNotes as string[]).join(" ")}</p>
          )}
        </div>
        <div className="bg-muted/30 rounded-md p-1">
          <h3 className="font-medium mb-1 text-sm text-center">常用和弦 / Common Chords</h3>
          <div className="grid grid-cols-[0.5fr_1fr_1.5fr] gap-x-2 gap-y-1 text-sm">
            {commonTriads.map((triad, index) => (
              <React.Fragment key={index}>
                <span className="font-medium text-right">{triad.degree}</span>
                <span className="font-medium text-left">{triad.chord}</span>
                <span className="text-muted-foreground text-left">{triad.notes}</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </CardWrapper>
  )
}

