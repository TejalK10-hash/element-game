// ============================================================
// GAME LOGIC — drag (or tap) an element badge onto the matching
// hotspot on the spacecraft illustration.
// ============================================================

const svg = document.getElementById("scene");
const dragLine = document.getElementById("dragLine");
const connectionsLayer = document.getElementById("connections");

const els = {
  scoreVal: document.getElementById("scoreVal"),
  matchVal: document.getElementById("matchVal"),
  totalVal: document.getElementById("totalVal"),
  toast: document.getElementById("toast"),
};

const state = {
  score: 0,
  matched: new Set(),
  selectedId: null,
  dragging: null, // { id, startX, startY }
};

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

function elementById(id) { return ELEMENTS.find((e) => e.id === id); }
function elementByHotspot(target) { return ELEMENTS.find((e) => e.hotspot === target); }

// ---------- init ----------
function init() {
  els.totalVal.textContent = ELEMENTS.length;
  updateHud();

  svg.querySelectorAll(".badge").forEach((badge) => {
    badge.addEventListener("pointerdown", onBadgePointerDown);
    badge.addEventListener("click", onBadgeClick);
  });
  svg.querySelectorAll(".hotspot").forEach((hotspot) => {
    hotspot.addEventListener("click", onHotspotClick);
  });
}

// ---------- tap-to-select / tap-to-match (also fires after a non-drag click) ----------
function onBadgeClick(e) {
  if (state.dragging) return; // drag handled separately
  const id = e.currentTarget.dataset.id;
  if (state.matched.has(id)) return;
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
  if (state.matched.has(id)) return;

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

  // find hotspot under release point
  const p = svgPoint(e.clientX, e.clientY);
  let closestTarget = null;
  let closestDist = Infinity;
  svg.querySelectorAll(".hotspot").forEach((h) => {
    const c = hotspotCenter(h.dataset.target);
    const d = Math.hypot(c.x - p.x, c.y - p.y);
    if (d < closestDist) { closestDist = d; closestTarget = h.dataset.target; }
  });

  if (closestTarget && closestDist < 45 && !state.matched.has(elementByHotspot(closestTarget)?.id)) {
    attemptMatch(id, closestTarget);
  }
}

// ---------- matching ----------
function attemptMatch(elementId, target) {
  const el = elementById(elementId);
  const hotspotEl = svg.querySelector(`.hotspot[data-target="${target}"]`);

  if (el.hotspot === target) {
    state.matched.add(el.id);
    state.score += 20;
    state.selectedId = null;
    updateHud();
    refreshSelection();

    svg.querySelector(`.badge[data-id="${el.id}"]`).classList.add("matched");
    hotspotEl.classList.add("matched");
    drawPermanentConnection(el.id, target);

    showFact(el);
    showToast(`✅ ${el.name} correctly wired to ${el.use}!`, true);
  } else {
    state.score = Math.max(0, state.score - 5);
    updateHud();
    state.selectedId = null;
    refreshSelection();

    hotspotEl.classList.add("wrong");
    setTimeout(() => hotspotEl.classList.remove("wrong"), 300);
    const correctEl = elementByHotspot(target);
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
  connectionsLayer.appendChild(path);
}

// ---------- HUD / toast ----------
function updateHud() {
  els.scoreVal.textContent = state.score;
  els.matchVal.textContent = state.matched.size;
  if (state.matched.size === ELEMENTS.length) {
    setTimeout(showWin, 500);
  }
}

function showToast(msg, good) {
  els.toast.textContent = msg;
  els.toast.className = "show" + (good ? " good" : "");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => { els.toast.className = ""; }, 2200);
}

// ---------- modals ----------
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
});

function showWin() {
  document.getElementById("finalScore").textContent = state.score;
  const glossary = document.getElementById("winGlossary");
  glossary.innerHTML = "";
  ELEMENTS.forEach((el) => {
    const item = document.createElement("div");
    item.className = "glItem";
    item.innerHTML = `<div class="h">${el.symbol} ${el.name} — ${el.use}</div><div class="b">${el.fact}</div>`;
    glossary.appendChild(item);
  });
  document.getElementById("winOverlay").classList.add("show");
}
document.getElementById("playAgainBtn").addEventListener("click", resetGame);
document.getElementById("resetBtn").addEventListener("click", resetGame);

function resetGame() {
  state.score = 0;
  state.matched = new Set();
  state.selectedId = null;
  state.dragging = null;
  connectionsLayer.innerHTML = "";
  svg.querySelectorAll(".badge").forEach((b) => b.classList.remove("matched", "selected"));
  svg.querySelectorAll(".hotspot").forEach((h) => h.classList.remove("matched", "wrong"));
  document.getElementById("winOverlay").classList.remove("show");
  document.getElementById("factOverlay").classList.remove("show");
  updateHud();
}

init();