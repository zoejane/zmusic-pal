(function () {
  var M = window.ZMusic;
  var rootSelect = document.getElementById("key-root");
  var scaleSelect = document.getElementById("key-scale");
  var scaleEl = document.getElementById("scale-out");
  var chordsEl = document.getElementById("chords-out");
  var chordRoot = document.getElementById("chord-root");
  var chordType = document.getElementById("chord-type");
  var chordNotes = document.getElementById("chord-notes");
  var themeBtn = document.getElementById("theme-toggle");

  function fillSelect(el, items, getValue, getLabel) {
    items.forEach(function (item) {
      var opt = document.createElement("option");
      opt.value = getValue(item);
      opt.textContent = getLabel(item);
      el.appendChild(opt);
    });
  }

  fillSelect(rootSelect, M.ROOT_NOTES, function (n) { return n; }, function (n) { return n; });
  fillSelect(scaleSelect, M.SCALES, function (s) { return s.value; }, function (s) { return s.label; });
  fillSelect(chordRoot, M.ROOT_NOTES, function (n) { return n; }, function (n) { return n; });
  fillSelect(chordType, M.CHORD_TYPES, function (s) { return s.value; }, function (s) { return s.label; });

  rootSelect.value = "C";
  scaleSelect.value = "major";
  chordRoot.value = "C";
  chordType.value = "major";

  function renderKey() {
    var root = rootSelect.value;
    var type = scaleSelect.value;
    var scale = M.generateScale(root, type);
    if (type === "melodic-minor") {
      scaleEl.innerHTML =
        '<p class="scale-line">Ascending | 上行: ' + scale.ascending.join(" ") + "</p>" +
        '<p class="scale-line">Descending | 下行: ' + scale.descending.join(" ") + "</p>";
    } else {
      scaleEl.innerHTML = '<p class="scale">' + scale.join(" ") + "</p>";
    }
    var triads = M.generateTriads(scale, type);
    chordsEl.innerHTML = triads
      .map(function (t) {
        return (
          '<span class="deg">' + t.degree + "</span>" +
          '<span class="name">' + t.chord + "</span>" +
          '<span class="notes">' + t.notes + "</span>"
        );
      })
      .join("");
  }

  function renderChord() {
    chordNotes.textContent = M.getChordNotes(chordRoot.value, chordType.value).join(" - ");
  }

  rootSelect.addEventListener("change", renderKey);
  scaleSelect.addEventListener("change", renderKey);
  chordRoot.addEventListener("change", renderChord);
  chordType.addEventListener("change", renderChord);

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    themeBtn.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
    themeBtn.title = themeBtn.getAttribute("aria-label");
    themeBtn.innerHTML = theme === "dark"
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';
  }

  themeBtn.addEventListener("click", function () {
    var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
  });

  applyTheme(localStorage.getItem("theme") === "dark" ? "dark" : "light");
  renderKey();
  renderChord();
})();
