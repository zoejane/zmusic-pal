"use client"

import { useState, useMemo, Fragment } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CardWrapper } from "@/components/ui/card-wrapper"
import { rootNotes, scales, generateScale, generateTriads } from "@/lib/music"

export function KeyFinder() {
  const [rootNote, setRootNote] = useState("C")
  const [scale, setScale] = useState("Major | 大调")

  const scaleNotes = useMemo(() => generateScale(rootNote, scale), [rootNote, scale])
  const commonTriads = useMemo(() => generateTriads(scaleNotes, scale), [scaleNotes, scale])

  return (
    <CardWrapper title="Key Finder | 查调" className="text-sm sm:text-base">
      <div className="space-y-1">
        <div className="grid grid-cols-2 gap-0.5">
          <Select value={rootNote} onValueChange={setRootNote}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Root Note | 选择音名" />
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
              <SelectValue placeholder="Scale Type | 选择调式" />
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
          <h3 className="font-medium mb-1 text-sm">Scale | 音阶</h3>
          {scale.includes("Melodic Minor") ? (
            <>
              <p className="text-sm mb-0.5">Ascending | 上行: {(scaleNotes as { ascending: string[] }).ascending.join(" ")}</p>
              <p className="text-sm">Descending | 下行: {(scaleNotes as { descending: string[] }).descending.join(" ")}</p>
            </>
          ) : (
            <p className="text-sm font-medium">{(scaleNotes as string[]).join(" ")}</p>
          )}
        </div>
        <div className="bg-muted/30 rounded-md p-1">
          <h3 className="font-medium mb-1 text-sm text-center">Common Chords | 常用和弦</h3>
          <div className="grid grid-cols-[0.5fr_1fr_1.5fr] gap-x-2 gap-y-1 text-sm">
            {commonTriads.map((triad, index) => (
              <Fragment key={index}>
                <span className="font-medium text-right">{triad.degree}</span>
                <span className="font-medium text-left">{triad.chord}</span>
                <span className="text-muted-foreground text-left">{triad.notes}</span>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </CardWrapper>
  )
}
