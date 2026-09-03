/**
 * Verify Key Finder / Chord Finder logic with no FastAPI process.
 * Run: npm run test:music
 */
import { generateScale, generateTriads, getChordNotes } from "../lib/music.ts"

function assertEqual(actual: unknown, expected: unknown, label: string) {
  const a = JSON.stringify(actual)
  const e = JSON.stringify(expected)
  if (a !== e) {
    console.error(`FAIL: ${label}\n  expected: ${e}\n  actual:   ${a}`)
    process.exitCode = 1
    return
  }
  console.log(`ok  ${label}`)
}

const fMajor = generateScale("F", "Major | 大调")
assertEqual(fMajor, ["F", "G", "A", "Bb", "C", "D", "E"], "F major scale")

const fTriads = generateTriads(fMajor, "Major | 大调")
assertEqual(
  fTriads.map((t) => `${t.degree} ${t.chord} ${t.notes}`),
  [
    "I F F - A - C",
    "ii Gm G - Bb - D",
    "iii Am A - C - E",
    "IV Bb Bb - D - F",
    "V C C - E - G",
    "vi Dm D - F - A",
  ],
  "F major common triads",
)

assertEqual(getChordNotes("A", "minor"), ["A", "C", "E"], "Am notes")
assertEqual(getChordNotes("C", "major"), ["C", "E", "G"], "C major notes")
assertEqual(getChordNotes("G", "major"), ["G", "B", "D"], "G major notes")
assertEqual(getChordNotes("B", "dim"), ["B", "D", "F"], "B dim notes")

const cMinor = generateScale("C", "Natural Minor | 自然小调")
assertEqual(cMinor, ["C", "D", "Eb", "F", "G", "Ab", "Bb"], "C natural minor scale")

if (process.exitCode) {
  console.error("Music theory checks failed.")
  process.exit(1)
}

console.log("All Key Finder / Chord Finder checks passed (no backend).")
