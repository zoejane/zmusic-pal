(function (global, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    global.ZMusic = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  var ROOT_NOTES = ["C", "Db", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];
  var SHARP_NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  var FLAT_NOTES = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
  var FLAT_ROOTS = { F: 1, Bb: 1, Eb: 1, Ab: 1, Db: 1, Gb: 1 };

  var SCALES = [
    { value: "major", label: "Major | 大调" },
    { value: "natural-minor", label: "Natural Minor | 自然小调" },
    { value: "harmonic-minor", label: "Harmonic Minor | 和声小调" },
    { value: "melodic-minor", label: "Melodic Minor | 旋律小调" },
  ];

  var CHORD_TYPES = [
    { value: "major", label: "Major | 大三和弦" },
    { value: "minor", label: "Minor | 小三和弦" },
    { value: "dim", label: "Dim | 减三和弦" },
    { value: "aug", label: "Aug | 增三和弦" },
  ];

  var SCALE_PATTERNS = {
    major: [0, 2, 4, 5, 7, 9, 11],
    "natural-minor": [0, 2, 3, 5, 7, 8, 10],
    "harmonic-minor": [0, 2, 3, 5, 7, 8, 11],
    "melodic-minor": {
      ascending: [0, 2, 3, 5, 7, 9, 11],
      descending: [0, 10, 8, 7, 5, 3, 2],
    },
  };

  var TRIAD_TYPES = {
    major: ["", "m", "m", "", "", "m", "dim"],
    "natural-minor": ["m", "dim", "", "m", "m", "", ""],
    "harmonic-minor": ["m", "dim", "aug", "m", "", "", "dim"],
    "melodic-minor": ["m", "m", "aug", "", "", "dim", "dim"],
  };

  var DEGREES = ["I", "ii", "iii", "IV", "V", "vi"];

  var NOTE_SEQUENCE = {
    sharp: SHARP_NOTES.concat(SHARP_NOTES),
    flat: FLAT_NOTES.concat(FLAT_NOTES),
  };

  var SPECIAL_NOTE_MAP = {
    "E aug 3": "B#（C）",
    "F# aug 3": "C##（D）",
    "A aug 3": "E#（F）",
    "Bb dim 3": "Fb（E）",
    "B aug 3": "Fx（G）",
  };

  function usesFlats(rootNote) {
    return Boolean(FLAT_ROOTS[rootNote]);
  }

  function noteName(index, rootNote) {
    var notes = usesFlats(rootNote) ? FLAT_NOTES : SHARP_NOTES;
    return notes[index % 12];
  }

  function rootIndex(rootNote) {
    var i = FLAT_NOTES.indexOf(rootNote);
    if (i === -1) i = SHARP_NOTES.indexOf(rootNote);
    return i;
  }

  function generateScale(rootNote, scaleType) {
    var pattern = SCALE_PATTERNS[scaleType];
    var i = rootIndex(rootNote);
    if (scaleType === "melodic-minor") {
      return {
        ascending: pattern.ascending.map(function (interval) {
          return noteName((i + interval) % 12, rootNote);
        }),
        descending: pattern.descending.map(function (interval) {
          return noteName((i + interval) % 12, rootNote);
        }),
      };
    }
    return pattern.map(function (interval) {
      return noteName((i + interval) % 12, rootNote);
    });
  }

  function generateTriads(scale, scaleType) {
    var types = TRIAD_TYPES[scaleType];
    var scaleNotes = scaleType === "melodic-minor" ? scale.ascending : scale;
    return scaleNotes.slice(0, 6).map(function (note, index) {
      var chordNotes = [
        scaleNotes[index],
        scaleNotes[(index + 2) % 7],
        scaleNotes[(index + 4) % 7],
      ];
      return {
        degree: DEGREES[index],
        chord: note + types[index],
        notes: chordNotes.join(" - "),
      };
    });
  }

  function getChordNotes(rootNote, chordType) {
    var sequence = usesFlats(rootNote) ? NOTE_SEQUENCE.flat : NOTE_SEQUENCE.sharp;
    var i = sequence.indexOf(rootNote);
    var intervals;
    if (chordType === "major") intervals = [0, 4, 7];
    else if (chordType === "minor") intervals = [0, 3, 7];
    else if (chordType === "dim") intervals = [0, 3, 6];
    else if (chordType === "aug") intervals = [0, 4, 8];
    else return [];
    return intervals.map(function (interval, index) {
      var special = SPECIAL_NOTE_MAP[rootNote + " " + chordType + " " + (index + 1)];
      return special || sequence[i + interval];
    });
  }

  return {
    ROOT_NOTES: ROOT_NOTES,
    SCALES: SCALES,
    CHORD_TYPES: CHORD_TYPES,
    generateScale: generateScale,
    generateTriads: generateTriads,
    getChordNotes: getChordNotes,
  };
});
