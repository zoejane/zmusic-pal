/** Client-side music theory for Key Finder and Chord Finder. No backend required. */

export const rootNotes = ["C", "Db", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"]
export const sharpNotes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
export const flatNotes = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"]
export const scales = ["Major | 大调", "Natural Minor | 自然小调", "Harmonic Minor | 和声小调", "Melodic Minor | 旋律小调"]

export const chordTypes = [
  { value: "major", label: "Major | 大三和弦" },
  { value: "minor", label: "Minor | 小三和弦" },
  { value: "dim", label: "Dim | 减三和弦" },
  { value: "aug", label: "Aug | 增三和弦" },
]

const scalePatterns = {
  Major: [0, 2, 4, 5, 7, 9, 11],
  "Natural Minor": [0, 2, 3, 5, 7, 8, 10],
  "Harmonic Minor": [0, 2, 3, 5, 7, 8, 11],
  "Melodic Minor": {
    ascending: [0, 2, 3, 5, 7, 9, 11],
    descending: [0, 10, 8, 7, 5, 3, 2],
  },
}

export type ScaleNotes = string[] | { ascending: string[]; descending: string[] }

export type Triad = { degree: string; chord: string; notes: string }

function getProperNoteName(index: number, rootNote: string): string {
  const useFlats = ["F", "Bb", "Eb", "Ab", "Db", "Gb"].includes(rootNote)
  const noteArray = useFlats ? flatNotes : sharpNotes
  return noteArray[index % 12]
}

export function generateScale(rootNote: string, scaleType: string): ScaleNotes {
  const pattern = scalePatterns[scaleType.split(" | ")[0] as keyof typeof scalePatterns]
  let rootIndex = flatNotes.indexOf(rootNote)
  if (rootIndex === -1) rootIndex = sharpNotes.indexOf(rootNote)

  if (scaleType.includes("Melodic Minor")) {
    const p = pattern as { ascending: number[]; descending: number[] }
    const ascending = p.ascending.map((interval) => getProperNoteName((rootIndex + interval) % 12, rootNote))
    const descending = p.descending.map((interval) => getProperNoteName((rootIndex + interval) % 12, rootNote))
    return { ascending, descending }
  }
  return (pattern as number[]).map((interval) => getProperNoteName((rootIndex + interval) % 12, rootNote))
}

export function generateTriads(scale: ScaleNotes, scaleType: string): Triad[] {
  let triadTypes: string[]
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

const noteSequence = {
  sharp: [
    "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
    "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
  ],
  flat: [
    "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B",
    "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B",
  ],
}

const specialNoteMap: Record<string, string> = {
  "E aug 3": "B#（C）",
  "F# aug 3": "C##（D）",
  "A aug 3": "E#（F）",
  "Bb dim 3": "Fb（E）",
  "B aug 3": "Fx（G）",
}

export function getChordNotes(rootNote: string, chordType: string): string[] {
  const useFlats = ["F", "Bb", "Eb", "Ab", "Db", "Gb"].includes(rootNote)
  const sequence = useFlats ? noteSequence.flat : noteSequence.sharp
  const rootIndex = sequence.indexOf(rootNote)

  let intervals: number[]
  switch (chordType) {
    case "major":
      intervals = [0, 4, 7]
      break
    case "minor":
      intervals = [0, 3, 7]
      break
    case "dim":
      intervals = [0, 3, 6]
      break
    case "aug":
      intervals = [0, 4, 8]
      break
    default:
      return []
  }

  return intervals.map((interval, index) => {
    const specialKey = `${rootNote} ${chordType} ${index + 1}`
    if (specialNoteMap[specialKey]) {
      return specialNoteMap[specialKey]
    }
    return sequence[rootIndex + interval]
  })
}
