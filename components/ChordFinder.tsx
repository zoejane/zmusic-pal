'use client'

import { useState, useMemo } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CardWrapper } from '@/components/ui/card-wrapper'

const rootNotes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']

const chordTypes = [
  { value: 'major', label: '大三和弦 / Major' },
  { value: 'minor', label: '小三和弦 / Minor' },
  { value: 'dim', label: '减三和弦 / Diminished' },
  { value: 'aug', label: '增三和弦 / Augmented' },
]

// 音符序列（包含重复的升降号形式，用于计算）
const noteSequence = {
  sharp: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
         'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
  flat: ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B',
         'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
}

// 特殊情况的音符映射（包含注释）
const specialNoteMap = {
  'E aug 3': 'B#（C）',      // E augmented: E - G# - B# -> C
  'F# aug 3': 'C##（D）',    // F# augmented: F# - A# - C## -> D
  'A aug 3': 'E#（F）',      // A augmented: A - C# - E# -> F
  'Bb dim 3': 'Fb（E）',     // Bb diminished: Bb - Db - Fb -> E
  'B aug 3': 'Fx（G）',      // B augmented: B - D# - Fx -> G
}

function getChordNotes(rootNote: string, chordType: string): string[] {
  const useFlats = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'].includes(rootNote)
  const sequence = useFlats ? noteSequence.flat : noteSequence.sharp
  const rootIndex = sequence.indexOf(rootNote)

  let intervals: number[]
  switch (chordType) {
    case 'major':
      intervals = [0, 4, 7]  // 大三度(4)和纯五度(7)
      break
    case 'minor':
      intervals = [0, 3, 7]  // 小三度(3)和纯五度(7)
      break
    case 'dim':
      intervals = [0, 3, 6]  // 小三度(3)和减五度(6)
      break
    case 'aug':
      intervals = [0, 4, 8]  // 大三度(4)和增五度(8)
      break
    default:
      return []
  }

  return intervals.map((interval, index) => {
    // 检查是否有特殊情况需要处理
    const specialKey = `${rootNote} ${chordType} ${index + 1}`
    if (specialNoteMap[specialKey as keyof typeof specialNoteMap]) {
      return specialNoteMap[specialKey as keyof typeof specialNoteMap]
    }
    return sequence[rootIndex + interval]
  })
}

export default function ChordFinder() {
  const [rootNote, setRootNote] = useState('C')
  const [chordType, setChordType] = useState('major')

  const chordNotes = useMemo(() => {
    return getChordNotes(rootNote, chordType)
  }, [rootNote, chordType])

  const chordName = useMemo(() => {
    const suffix = chordType === 'major' ? '' : chordType
    return `${rootNote}${suffix}`
  }, [rootNote, chordType])

  return (
    <CardWrapper title="查和弦 / Chord Finder">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Select value={rootNote} onValueChange={setRootNote}>
              <SelectTrigger>
                <SelectValue placeholder="选择根音" />
              </SelectTrigger>
              <SelectContent>
                {rootNotes.map((note) => (
                  <SelectItem key={note} value={note}>
                    {note}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Select value={chordType} onValueChange={setChordType}>
              <SelectTrigger>
                <SelectValue placeholder="选择和弦类型" />
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
        </div>
        <div className="bg-muted/30 rounded-md p-4">
          <h3 className="font-medium mb-2">和弦组成 / Chord Notes</h3>
          <div className="space-y-2">
            <p className="text-lg font-medium">{chordName}</p>
            <p className="text-sm text-muted-foreground">
              {chordNotes.join(' - ')}
            </p>
          </div>
        </div>
      </div>
    </CardWrapper>
  )
}

