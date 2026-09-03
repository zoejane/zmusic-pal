"use client"

import { useState, useMemo } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CardWrapper } from "@/components/ui/card-wrapper"
import { rootNotes, chordTypes, getChordNotes } from "@/lib/music"

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
