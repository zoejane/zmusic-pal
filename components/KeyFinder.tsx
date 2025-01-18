'use client'

import { useState, useMemo } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CardWrapper } from '@/components/ui/card-wrapper'

const rootNotes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']
const sharpNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const flatNotes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
const scales = [
  '大调 / Major',
  '自然小调 / Natural Minor',
  '和声小调 / Harmonic Minor',
  '旋律小调 / Melodic Minor'
]

const scalePatterns = {
  'Major': [0, 2, 4, 5, 7, 9, 11],
  'Natural Minor': [0, 2, 3, 5, 7, 8, 10],
  'Harmonic Minor': [0, 2, 3, 5, 7, 8, 11],
  'Melodic Minor': {
    ascending: [0, 2, 3, 5, 7, 9, 11],
    descending: [0, 10, 8, 7, 5, 3, 2]
  }
}

function getProperNoteName(index: number, rootNote: string): string {
  const useFlats = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'].includes(rootNote);
  const noteArray = useFlats ? flatNotes : sharpNotes;
  return noteArray[index % 12];
}

function generateScale(rootNote: string, scaleType: string): string[] | { ascending: string[], descending: string[] } {
  const pattern = scalePatterns[scaleType.split(' / ')[1] as keyof typeof scalePatterns]
  let rootIndex = flatNotes.indexOf(rootNote)
  if (rootIndex === -1) rootIndex = sharpNotes.indexOf(rootNote)

  if (scaleType.includes('Melodic Minor')) {
    const ascending = pattern.ascending.map(interval => getProperNoteName((rootIndex + interval) % 12, rootNote))
    const descending = pattern.descending.map(interval => getProperNoteName((rootIndex + interval) % 12, rootNote))
    return { ascending, descending }
  } else {
    return pattern.map(interval => getProperNoteName((rootIndex + interval) % 12, rootNote))
  }
}

function generateTriads(scale: string[] | { ascending: string[], descending: string[] }, scaleType: string): { degree: string; chord: string; notes: string }[] {
  let triadTypes;
  let scaleNotes: string[];

  if (scaleType.includes('Major')) {
    triadTypes = ['', 'm', 'm', '', '', 'm']
    scaleNotes = scale as string[]
  } else if (scaleType.includes('Natural Minor')) {
    triadTypes = ['m', '°', '', 'm', 'm', '']
    scaleNotes = scale as string[]
  } else if (scaleType.includes('Harmonic Minor')) {
    triadTypes = ['m', '°', '+', 'm', '', '']
    scaleNotes = scale as string[]
  } else { // Melodic Minor
    triadTypes = ['m', 'm', '+', '', '', '°']
    scaleNotes = (scale as { ascending: string[] }).ascending
  }

  return scaleNotes.slice(0, 6).map((note, index) => {
    const triadType = triadTypes[index]
    const chordNotes = [
      scaleNotes[index],
      scaleNotes[(index + 2) % 7],
      scaleNotes[(index + 4) % 7]
    ]
    return {
      degree: ['I', 'ii', 'iii', 'IV', 'V', 'vi'][index],
      chord: `${note}${triadType}`,
      notes: chordNotes.join(' - ')
    }
  })
}

export default function KeyFinder() {
  const [rootNote, setRootNote] = useState('C')
  const [scale, setScale] = useState('大调 / Major')

  const scaleNotes = useMemo(() => generateScale(rootNote, scale), [rootNote, scale])
  const commonTriads = useMemo(() => generateTriads(scaleNotes, scale), [scaleNotes, scale])

  return (
    <CardWrapper title={<span className="text-center block">查调 / Key Finder</span>}>
      <div className="space-y-4 p-2 sm:p-4">
        <div className="flex flex-row space-x-2 justify-center">
          <Select onValueChange={setRootNote} value={rootNote}>
            <SelectTrigger className="w-[80px] h-8 bg-background border-input">
              <SelectValue placeholder="根音" />
            </SelectTrigger>
            <SelectContent>
              {rootNotes.map((note) => (
                <SelectItem key={note} value={note}>{note}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={setScale} value={scale}>
            <SelectTrigger className="w-[220px] h-8 bg-background border-input">
              <SelectValue placeholder="调式 / Scale" />
            </SelectTrigger>
            <SelectContent>
              {scales.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="bg-accent bg-opacity-50 p-2 rounded-md text-center">
          <h3 className="font-semibold text-primary text-sm mb-1">音阶 / Scale</h3>
          {scale.includes('Melodic Minor') ? (
            <>
              <p className="text-foreground text-sm">
                上行 / Ascending: {(scaleNotes as { ascending: string[] }).ascending.join(' ')}
              </p>
              <p className="text-foreground text-sm">
                下行 / Descending: {(scaleNotes as { descending: string[] }).descending.join(' ')}
              </p>
            </>
          ) : (
            <p className="text-foreground text-sm">{(scaleNotes as string[]).join(' ')}</p>
          )}
        </div>
        <div className="bg-secondary bg-opacity-50 p-2 rounded-md text-center">
          <h3 className="font-semibold text-primary text-sm mb-2">常用三和弦 / Common Triads</h3>
          <div className="inline-block text-left overflow-x-auto max-w-full">
            <pre className="text-sm font-mono whitespace-pre">
              {commonTriads.map((triad, index) => (
                <div key={index} className="grid grid-cols-[30px_40px_1fr] gap-x-2">
                  <span className="font-semibold">{triad.degree.padEnd(3)}</span>
                  <span>{triad.chord.padEnd(4)}</span>
                  <span className="text-muted-foreground">{triad.notes}</span>
                </div>
              ))}
            </pre>
          </div>
        </div>
      </div>
    </CardWrapper>
  )
}

