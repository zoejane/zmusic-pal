#!/usr/bin/env node
/**
 * Verify key/chord lookup with no HTTP server and no FastAPI.
 * Run: node docs/verify.cjs
 */
var M = require("./music.js");

function assertEqual(actual, expected, label) {
  var a = JSON.stringify(actual);
  var e = JSON.stringify(expected);
  if (a !== e) {
    console.error("FAIL: " + label + "\n  expected: " + e + "\n  actual:   " + a);
    process.exitCode = 1;
    return;
  }
  console.log("ok  " + label);
}

var fMajor = M.generateScale("F", "major");
assertEqual(fMajor, ["F", "G", "A", "Bb", "C", "D", "E"], "F major scale");

var fTriads = M.generateTriads(fMajor, "major");
assertEqual(
  fTriads.map(function (t) {
    return t.degree + " " + t.chord + " " + t.notes;
  }),
  [
    "I F F - A - C",
    "ii Gm G - Bb - D",
    "iii Am A - C - E",
    "IV Bb Bb - D - F",
    "V C C - E - G",
    "vi Dm D - F - A",
  ],
  "F major common triads"
);

assertEqual(M.getChordNotes("A", "minor"), ["A", "C", "E"], "Am notes");
assertEqual(M.getChordNotes("C", "major"), ["C", "E", "G"], "C major notes");
assertEqual(M.getChordNotes("G", "major"), ["G", "B", "D"], "G major notes");
assertEqual(M.getChordNotes("B", "dim"), ["B", "D", "F"], "B dim notes");

var cMinor = M.generateScale("C", "natural-minor");
assertEqual(cMinor, ["C", "D", "D#", "F", "G", "G#", "A#"], "C natural minor (sharp spelling)");

var ebMajor = M.generateScale("Eb", "major");
assertEqual(ebMajor, ["Eb", "F", "G", "Ab", "Bb", "C", "D"], "Eb major scale");

if (process.exitCode) {
  console.error("Music theory checks failed.");
  process.exit(1);
}
console.log("All Key Finder / Chord Finder checks passed (no backend).");
