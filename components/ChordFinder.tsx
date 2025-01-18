'use client'

import { useState, useMemo } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CardWrapper } from '@/components/ui/card-wrapper'

const rootNotes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']
const chordTypes = [
  '大三和弦 / Major',
  '小三和弦 / Minor',
  '减三和弦 / Diminished',
  '增三和弦 / Augmented'
]

const sharpNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const flatNotes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'Cb']

const chordIntervals = {
  'Major': [0, 4, 7],
  'Minor': [0, 3, 7],
  'Diminished': [0, 3, 6],
  'Augmented': [0, 4, 8]
}

function generateChord(rootNote: string, chordType: string): string[] {
  const intervals = chordIntervals[chordType.split(' / ')[1] as keyof typeof chordIntervals]
  const chord: string[] = []
  let rootIndex = rootNotes.indexOf(rootNote)

  const useFlats = ['F', 'Bb', 'Eb', 'Ab', 'Db'].includes(rootNote) || 
                   (chordType.includes('Minor') && !['B', 'E', 'A', 'D', 'G', 'C', 'F#'].includes(rootNote)) || 
                   (chordType.includes('Diminished') && !['B', 'E', 'A', 'D', 'G', 'C', 'F#'].includes(rootNote));

  for (let i = 0; i < intervals.length; i++) {
    const noteIndex = (rootIndex + intervals[i]) % 12
    if (chordType.includes('Diminished') && i === 2) {
      chord.push(getDiminishedFifth(rootNote));
    } else if (chordType.includes('Augmented') && i === 2) {
      chord.push(getAugmentedFifth(rootNote));
    } else {
      chord.push(getProperNoteName(noteIndex, useFlats))
    }
  }

  return chord
}

function getProperNoteName(index: number, useFlats: boolean): string {
  const noteArray = useFlats ? flatNotes : sharpNotes;
  return noteArray[index];
}

function getDiminishedFifth(rootNote: string): string {
  const diminishedFifths: { [key: string]: string } = {
    'C': 'Gb',
    'Db': 'G',
    'D': 'Ab',
    'Eb': 'B',
    'E': 'Bb',
    'F': 'B',
    'F#': 'C',
    'G': 'Db',
    'Ab': 'D',
    'A': 'Eb',
    'Bb': 'Fb (E)',
    'B': 'F'
  };
  return diminishedFifths[rootNote] || '';
}

function getAugmentedFifth(rootNote: string): string {
  const augmentedFifths: { [key: string]: string } = {
    'C': 'G#',
    'Db': 'A',
    'D': 'A#',
    'Eb': 'B',
    'E': 'B# (C)',
    'F': 'C#',
    'F#': 'C## (D)',
    'G': 'D#',
    'Ab': 'E',
    'A': 'E# (F)',
    'Bb': 'F#',
    'B': 'Fx (G)'
  };
  return augmentedFifths[rootNote] || '';
}

export default function ChordFinder() {
  const [rootNote, setRootNote] = useState('C')
  const [chordType, setChordType] = useState('大三和弦 / Major')

  const chordNotes = useMemo(() => generateChord(rootNote, chordType), [rootNote, chordType])

  return (
    <CardWrapper title={<span className="text-center block">查和弦 / Chord Finder</span>}>
      <div className="space-y-2">
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
          <Select onValueChange={setChordType} value={chordType}>
            <SelectTrigger className="w-[230px] h-8 bg-background border-input">
              <SelectValue placeholder="和弦类型 / Chord Type" />
            </SelectTrigger>
            <SelectContent>
              {chordTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="bg-accent bg-opacity-50 p-1 rounded-md text-center">
          <p className="text-foreground text-sm">
            组成音 / Notes: <span className="text-muted-foreground">{chordNotes.join(' - ')}</span>
          </p>
        </div>
      </div>
    </CardWrapper>
  )
}

