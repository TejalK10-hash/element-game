// ============================================================
// GAME LOGIC — four levels (Rocket, Space Shuttle, Satellite,
// Space Probe).
// Drag (or tap) an element badge onto the matching hotspot on
// the current level's spacecraft photo.
// ============================================================

const svg = document.getElementById("scene");
const dragLine = document.getElementById("dragLine");

const els = {
  scoreVal: document.getElementById("scoreVal"),
  matchVal: document.getElementById("matchVal"),
  totalVal: document.getElementById("totalVal"),
  levelsDoneVal: document.getElementById("levelsDoneVal"),
  craftNameLabel: document.getElementById("craftNameLabel"),
  toast: document.getElementById("toast"),
  streakVal: null, // filled in by initStreakDisplay()
};

const state = {
  score: 0,
  currentLevel: LEVELS[0].id,
  matchedByLevel: Object.fromEntries(LEVELS.map((l) => [l.id, new Set()])),
  selectedId: null,
  dragging: null, // { id, pointerId, moved }
  streak: 0,
  bestStreak: 0,
  mistakesByLevel: Object.fromEntries(LEVELS.map((l) => [l.id, 0])),
};

// ---------- lookups ----------
function levelById(id) { return LEVELS.find((l) => l.id === id); }
function currentLevel() { return levelById(state.currentLevel); }
function elementById(id) {
  for (const lvl of LEVELS) {
    const found = lvl.elements.find((e) => e.id === id);
    if (found) return found;
  }
  return null;
}
function elementByHotspotInCurrentLevel(target) {
  return currentLevel().elements.find((e) => e.hotspot === target);
}
function isLevelComplete(id) {
  return state.matchedByLevel[id].size === levelById(id).elements.length;
}
function countLevelsDone() {
  return LEVELS.filter((l) => isLevelComplete(l.id)).length;
}
function starsForLevel(id) {
  const m = state.mistakesByLevel[id];
  if (m === 0) return 3;
  if (m <= 2) return 2;
  return 1;
}
function starString(n) {
  return "⭐".repeat(n) + "☆".repeat(3 - n);
}

// ---------- coordinate helpers ----------
function svgPoint(clientX, clientY) {
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  return pt.matrixTransform(svg.getScreenCTM().inverse());
}

function badgeCenter(id) {
  const g = svg.querySelector(`.badge[data-id="${id}"]`);
  const match = /translate\(([-\d.]+)[,\s]+([-\d.]+)\)/.exec(g.getAttribute("transform"));
  return { x: parseFloat(match[1]), y: parseFloat(match[2]) };
}

function hotspotCenter(target) {
  const dot = svg.querySelector(`.hotspot[data-target="${target}"] .hotspotDot`);
  return { x: parseFloat(dot.getAttribute("cx")), y: parseFloat(dot.getAttribute("cy")) };
}

function activeConnectionsLayer() {
  return svg.querySelector(`.craftLevel[data-level="${state.currentLevel}"] .connections`);
}

// ---------- init ----------
function init() {
  buildStars();
  initStreakDisplay();

  svg.querySelectorAll(".badge").forEach((badge) => {
    badge.addEventListener("pointerdown", onBadgePointerDown);
    badge.addEventListener("click", onBadgeClick);
  });
  svg.querySelectorAll(".hotspot").forEach((hotspot) => {
    hotspot.addEventListener("click", onHotspotClick);
  });
  document.querySelectorAll(".levelTab").forEach((tab) => {
    tab.addEventListener("click", () => switchLevel(tab.dataset.level));
  });

  const levelsTotalEl = document.getElementById("levelsTotalVal");
  if (levelsTotalEl) levelsTotalEl.textContent = LEVELS.length;

  preloadCraftPhotos();
  preloadBadgePhotos();
  switchLevel(state.currentLevel);
}

// adds a "Streak: N" stat into the existing .stats bar without
// requiring any changes to index.html
function initStreakDisplay() {
  const statsBar = document.querySelector(".stats");
  if (!statsBar) return;
  const span = document.createElement("span");
  span.className = "streakStat";
  span.innerHTML = `Streak: <b id="streakVal">0</b>`;
  statsBar.appendChild(span);
  els.streakVal = document.getElementById("streakVal");
}

// every level defines a `photo` filename and gets a placeholder
// frame; swap the real photo in only if the file actually loads,
// otherwise keep the dashed "add a photo here" frame visible.
function preloadCraftPhotos() {
  LEVELS.filter((l) => l.photo).forEach((l) => {
    const group = svg.querySelector(`.craftLevel[data-level="${l.id}"] .craftArt`);
    const img = new Image();
    img.onload = () => group.classList.add("hasPhoto");
    img.onerror = () => group.classList.remove("hasPhoto");
    img.src = l.photo;
  });
  svg.querySelectorAll(".craftArt image.craftPhoto").forEach((img) => {
    img.addEventListener("load", () => img.setAttribute("opacity", "1"));
  });
}

// each element badge can define an `image` filename (e.g. a photo
// or texture of the actual material). Same graceful fallback as
// the craft photos: try loading it, and only swap it in — hiding
// the symbol text — if it actually loads.
function preloadBadgePhotos() {
  LEVELS.forEach((lvl) => {
    lvl.elements.filter((e) => e.image).forEach((e) => {
      const badge = svg.querySelector(`.badge[data-id="${e.id}"]`);
      if (!badge) return;
      const img = new Image();
      img.onload = () => badge.classList.add("hasPhoto");
      img.onerror = () => badge.classList.remove("hasPhoto");
      img.src = e.image;
    });
  });
  svg.querySelectorAll(".badge image.badgePhoto").forEach((img) => {
    img.addEventListener("load", () => img.setAttribute("opacity", "1"));
  });
}

function buildStars() {
  const wrap = document.getElementById("stars");
  const n = 60;
  for (let i = 0; i < n; i++) {
    const s = document.createElement("div");
    s.className = "star";
    const size = Math.random() * 2 + 1;
    s.style.width = size + "px";
    s.style.height = size + "px";
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 100 + "%";
    s.style.animationDelay = Math.random() * 3 + "s";
    wrap.appendChild(s);
  }
}

// ---------- level switching ----------
function switchLevel(id) {
  state.currentLevel = id;
  state.selectedId = null;
  state.dragging = null;

  svg.querySelectorAll(".craftLevel").forEach((g) => {
    g.classList.toggle("activeLevel", g.dataset.level === id);
  });
  document.querySelectorAll(".levelTab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.level === id);
  });

  els.craftNameLabel.textContent = levelById(id).craftName;
  refreshSelection();
  updateHud();
}

// ---------- tap-to-select / tap-to-match ----------
function onBadgeClick(e) {
  if (state.dragging) return;
  const id = e.currentTarget.dataset.id;
  if (state.matchedByLevel[state.currentLevel].has(id)) return;
  state.selectedId = state.selectedId === id ? null : id;
  refreshSelection();
}

function onHotspotClick(e) {
  const target = e.currentTarget.dataset.target;
  if (!state.selectedId) {
    showToast("⬅️ Select an element first, then tap a hotspot.", false);
    return;
  }
  attemptMatch(state.selectedId, target);
}

function refreshSelection() {
  svg.querySelectorAll(".badge").forEach((b) => {
    b.classList.toggle("selected", b.dataset.id === state.selectedId);
  });
}

// ---------- drag-to-connect ----------
function onBadgePointerDown(e) {
  const badge = e.currentTarget;
  const id = badge.dataset.id;
  if (state.matchedByLevel[state.currentLevel].has(id)) return;

  badge.setPointerCapture(e.pointerId);
  const center = badgeCenter(id);
  state.dragging = { id, pointerId: e.pointerId, moved: false };

  dragLine.setAttribute("x1", center.x);
  dragLine.setAttribute("y1", center.y);
  dragLine.setAttribute("x2", center.x);
  dragLine.setAttribute("y2", center.y);
  dragLine.style.stroke = elementById(id).color;
  dragLine.removeAttribute("visibility");

  badge.addEventListener("pointermove", onBadgePointerMove);
  badge.addEventListener("pointerup", onBadgePointerUp);
  badge.addEventListener("pointercancel", onBadgePointerUp);
}

function onBadgePointerMove(e) {
  if (!state.dragging) return;
  state.dragging.moved = true;
  const p = svgPoint(e.clientX, e.clientY);
  dragLine.setAttribute("x2", p.x);
  dragLine.setAttribute("y2", p.y);
}

function onBadgePointerUp(e) {
  const badge = e.currentTarget;
  badge.removeEventListener("pointermove", onBadgePointerMove);
  badge.removeEventListener("pointerup", onBadgePointerUp);
  badge.removeEventListener("pointercancel", onBadgePointerUp);

  dragLine.setAttribute("visibility", "hidden");
  if (!state.dragging) return;
  const { id, moved } = state.dragging;
  state.dragging = null;
  if (!moved) return; // treat as a click, handled by onBadgeClick

  const p = svgPoint(e.clientX, e.clientY);
  let closestTarget = null;
  let closestDist = Infinity;
  svg.querySelectorAll(`.craftLevel[data-level="${state.currentLevel}"] .hotspot`).forEach((h) => {
    const c = hotspotCenter(h.dataset.target);
    const d = Math.hypot(c.x - p.x, c.y - p.y);
    if (d < closestDist) { closestDist = d; closestTarget = h.dataset.target; }
  });

  const targetEl = closestTarget ? elementByHotspotInCurrentLevel(closestTarget) : null;
  if (closestTarget && closestDist < 45 && !(targetEl && state.matchedByLevel[state.currentLevel].has(targetEl.id))) {
    attemptMatch(id, closestTarget);
  }
}

// ---------- matching ----------
function attemptMatch(elementId, target) {
  const el = elementById(elementId);
  const hotspotEl = svg.querySelector(`.craftLevel[data-level="${state.currentLevel}"] .hotspot[data-target="${target}"]`);

  if (el.hotspot === target) {
    state.matchedByLevel[state.currentLevel].add(el.id);

    state.streak += 1;
    state.bestStreak = Math.max(state.bestStreak, state.streak);
    const streakBonus = state.streak >= 2 ? (state.streak - 1) * 5 : 0;
    state.score += 20 + streakBonus;

    state.selectedId = null;
    updateHud();
    refreshSelection();

    svg.querySelector(`.badge[data-id="${el.id}"]`).classList.add("matched");
    hotspotEl.classList.add("matched");
    drawPermanentConnection(el.id, target);

    showFact(el);

    if (el.surpriseFact && Math.random() < 0.2) {
      showSurpriseFact(el);
    } else if (state.streak >= 3) {
      showToast(`🔥 ${state.streak} in a row! +${streakBonus} bonus`, true);
    } else {
      showToast(`✅ ${el.name} correctly wired to ${el.use}!`, true);
    }
  } else {
    state.score = Math.max(0, state.score - 5);
    state.streak = 0;
    state.mistakesByLevel[state.currentLevel] += 1;
    updateHud();
    state.selectedId = null;
    refreshSelection();

    hotspotEl.classList.add("wrong");
    setTimeout(() => hotspotEl.classList.remove("wrong"), 300);
    const correctEl = elementByHotspotInCurrentLevel(target);
    showToast(`🚫 Not quite -- that hotspot is for ${correctEl.name} (${correctEl.use}).`, false);
  }
}

function drawPermanentConnection(elementId, target) {
  const a = badgeCenter(elementId);
  const b = hotspotCenter(target);
  const midX = (a.x + b.x) / 2;
  const midY = Math.min(a.y, b.y) - 60;
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", `M ${a.x} ${a.y} Q ${midX} ${midY} ${b.x} ${b.y}`);
  path.setAttribute("class", "connectionLine");
  path.style.stroke = elementById(elementId).color;
  activeConnectionsLayer().appendChild(path);
}

// ---------- HUD / toast ----------
function updateHud() {
  const lvl = currentLevel();
  els.scoreVal.textContent = state.score;
  els.matchVal.textContent = state.matchedByLevel[state.currentLevel].size;
  els.totalVal.textContent = lvl.elements.length;
  els.levelsDoneVal.textContent = countLevelsDone();
  if (els.streakVal) els.streakVal.textContent = state.streak;

  document.querySelectorAll(".levelTab").forEach((tab) => {
    tab.classList.toggle("complete", isLevelComplete(tab.dataset.level));
  });
}

function showToast(msg, good) {
  els.toast.textContent = msg;
  els.toast.className = "show" + (good ? " good" : "");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => { els.toast.className = ""; }, 2200);
}

function showSurpriseFact(el) {
  els.toast.innerHTML = `✨ <b>Did you know?</b> ${el.surpriseFact}`;
  els.toast.className = "show good surprise";
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => { els.toast.className = ""; }, 4500);
}

// ---------- fact modal ----------
function showFact(el) {
  document.getElementById("factHead").innerHTML =
    `<h1>✅ Connection Made!</h1><p class="sub">${el.name} wired to ${el.use}.</p>`;
  document.getElementById("factCard").innerHTML = `
    <div class="tag">${el.symbol} · ${el.use}</div>
    <div class="ttl">${el.name}</div>
    <div class="body">${el.fact}</div>
  `;
  document.getElementById("factOverlay").classList.add("show");
}
document.getElementById("factContinueBtn").addEventListener("click", () => {
  document.getElementById("factOverlay").classList.remove("show");
  checkLevelCompletionAfterFact();
});

// ---------- level-complete / win flow ----------
function checkLevelCompletionAfterFact() {
  if (!isLevelComplete(state.currentLevel)) return;
  if (countLevelsDone() === LEVELS.length) {
    showWin();
  } else {
    showLevelComplete(currentLevel());
  }
}

function showLevelComplete(lvl) {
  const stars = starsForLevel(lvl.id);
  document.getElementById("levelCompleteText").innerHTML =
    `You've wired up every material on the ${lvl.label}.<br><span style="font-size:1.4rem">${starString(stars)}</span><br>Ready for the next challenge?` + "\n" + `You've got this!!!`;
  document.getElementById("levelOverlay").classList.add("show");
}
document.getElementById("nextLevelBtn").addEventListener("click", () => {
  document.getElementById("levelOverlay").classList.remove("show");
  const next = LEVELS.find((l) => !isLevelComplete(l.id));
  if (next) switchLevel(next.id);
});

function showWin() {
  document.getElementById("finalScore").textContent = state.score;
  const glossary = document.getElementById("winGlossary");
  glossary.innerHTML = `<div style="text-align:center;margin-bottom:10px">
    Best streak: 🔥${state.bestStreak} &nbsp;|&nbsp;
    ${LEVELS.map(l => `${l.icon} ${starString(starsForLevel(l.id))}`).join("  ")}
  </div>`;
  LEVELS.forEach((lvl) => {
    lvl.elements.forEach((el) => {
      const item = document.createElement("div");
      item.className = "glItem";
      item.innerHTML = `<div class="h">${lvl.icon} ${el.symbol} ${el.name} — ${el.use}</div><div class="b">${el.fact}</div>`;
      glossary.appendChild(item);
    });
  });
  document.getElementById("winOverlay").classList.add("show");
}
document.getElementById("playAgainBtn").addEventListener("click", resetGame);
document.getElementById("resetBtn").addEventListener("click", resetGame);

// ---------- reset ----------
function resetGame() {
  state.score = 0;
  state.matchedByLevel = Object.fromEntries(LEVELS.map((l) => [l.id, new Set()]));
  state.selectedId = null;
  state.dragging = null;
  state.streak = 0;
  state.bestStreak = 0;
  state.mistakesByLevel = Object.fromEntries(LEVELS.map((l) => [l.id, 0]));

  svg.querySelectorAll(".connections").forEach((g) => { g.innerHTML = ""; });
  svg.querySelectorAll(".badge").forEach((b) => b.classList.remove("matched", "selected"));
  svg.querySelectorAll(".hotspot").forEach((h) => h.classList.remove("matched", "wrong"));

  document.getElementById("winOverlay").classList.remove("show");
  document.getElementById("factOverlay").classList.remove("show");
  document.getElementById("levelOverlay").classList.remove("show");

  switchLevel(LEVELS[0].id);
}

init();
