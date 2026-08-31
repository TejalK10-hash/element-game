// Element Navigator - game logic

var DEBUG = true;

// SVG canvas element where all game graphics live
const svg = document.getElementById("scene");

// Dashed line element that follows the cursor during drag
const dragLine = document.getElementById("dragLine");

// Global score variable (also stored inside st.score)
var score = 0;

// Cache references to DOM elements that get updated frequently
var ui = {};
ui.scoreVal = document.getElementById("scoreVal");
ui.matchVal = document.getElementById("matchVal");
ui.totalVal = document.getElementById("totalVal");
ui.levelsDoneVal = document.getElementById("levelsDoneVal");
ui.craftNameLabel = document.getElementById("craftNameLabel");
ui.toast = document.getElementById("toast");
ui.streakVal = null;

// Main game state object holding all mutable data
var st = {
  score: 0,
  currentLevel: LEVELS[0].id,
  matchedByLevel: {},
  selectedId: null,
  dragging: null,
  streak: 0,
  bestStreak: 0,
  mistakesByLevel: {}
};

// Initialize matchedByLevel and mistakesByLevel Sets/numbers for each level
for (var i = 0; i < LEVELS.length; i++) {
  st.matchedByLevel[LEVELS[i].id] = new Set();
  st.mistakesByLevel[LEVELS[i].id] = 0;
}

// Look up a level object by its string id (e.g. "rocket", "shuttle")
function levelById(id) { 
  for (var i = 0; i < LEVELS.length; i++) {
    if (LEVELS[i].id === id) return LEVELS[i];
  }
  return null;
}

// Return the currently active level object
function curLvl() { return levelById(st.currentLevel); }

// Search all levels for an element with the given id string
function elById(id) {
  for (var i = 0; i < LEVELS.length; i++) {
    var found = LEVELS[i].elements.find(function(e){ return e.id == id; });
    if (found) return found;
  }
  return null;
}

// Find the element data that maps to a specific hotspot target string
function hotspotEl(target) {
  return curLvl().elements.find(function(e){ return e.hotspot == target; });
}

// Check if every element in a given level has been matched
function lvlComplete(id) {
  return st.matchedByLevel[id].size === levelById(id).elements.length;
}

// Count how many of the 4 levels are fully completed
function countDone() {
  var n = 0;
  for (var i = 0; i < LEVELS.length; i++) {
    if (lvlComplete(LEVELS[i].id)) n++;
  }
  return n;
}

// Calculate star rating (1-3) based on mistake count for a level
// 0 mistakes = 3 stars, 1-2 mistakes = 2 stars, 3+ = 1 star
function starsFor(id) {
  var m = st.mistakesByLevel[id];
  if (m == 0) return 3;
  if (m <= 2) return 2;
  return 1;
}

// Build a string of filled and empty stars for display (e.g. "⭐⭐☆")
function starStr(n) {
  var out = "";
  for (var i = 0; i < n; i++) out += "⭐";
  for (var i = 0; i < 3 - n; i++) out += "☆";
  return out;
}

// Convert a screen pixel coordinate to SVG coordinate space
function svgPoint(clientX, clientY) {
  var pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  return pt.matrixTransform(svg.getScreenCTM().inverse());
}

// Parse the translate(x,y) transform on a badge group to get its center position
function badgeCenter(id) {
  var g = svg.querySelector('.badge[data-id = "' + id + '"]');
  var m = /translate\(([-\d.]+)[, \s]+([-\d.]+)\)/.exec(g.getAttribute("transform"));
  return { x: parseFloat(m[1]), y: parseFloat(m[2]) };
}

// Read the cx/cy attributes of a hotspot dot circle element
function hotspotCenter(target) {
  var dot = svg.querySelector('.hotspot[data-target = "' + target + '"] .hotspotDot');
  return { x: parseFloat(dot.getAttribute("cx")), y: parseFloat(dot.getAttribute("cy")) };
}

// Return the SVG <g class="connections"> element for the current level
function connLayer() {
  return svg.querySelector('.craftLevel[data-level = "' + st.currentLevel + '"] .connections');
}

// Main initialization: set up UI, attach event listeners, preload images, start first level
function init() {
  buildStars();
  initStreak();

  if (DEBUG) console.log("game init, levels:", LEVELS.length);

  svg.querySelectorAll(".badge").forEach(function(badge){
    badge.addEventListener("pointerdown", onBadgeDown);
    badge.addEventListener("click", onBadgeClick);
  });

  svg.querySelectorAll(".hotspot").forEach(function(hotspot){
    hotspot.addEventListener("click", onHotspotClick);
  });

  document.querySelectorAll(".levelTab").forEach(function(tab){
    tab.addEventListener("click", function(){ switchLevel(tab.dataset.level); });
  });

  var levelsTotalEl = document.getElementById("levelsTotalVal");
  if (levelsTotalEl) levelsTotalEl.textContent = LEVELS.length;

  preloadCraftPhotos();
  preloadBadgePhotos();
  switchLevel(st.currentLevel);
}

// Dynamically inject a streak counter span into the header stats bar
function initStreak() {
  var statsBar = document.querySelector(".stats");
  if (!statsBar) return;
  var span = document.createElement("span");
  span.className = "streakStat";
  span.innerHTML = 'Streak: <b id="streakVal">0</b>';
  statsBar.appendChild(span);
  ui.streakVal = document.getElementById("streakVal");
}

// Preload each level's spacecraft PNG so it fades in smoothly instead of popping
function preloadCraftPhotos() {
  LEVELS.filter(function(l){ return l.photo; }).forEach(function(l){
    var group = svg.querySelector('.craftLevel[data-level = "' + l.id + '"] .craftArt');
    var img = new Image();
    img.onload = function(){ group.classList.add("hasPhoto"); };
    img.onerror = function(){ group.classList.remove("hasPhoto"); };
    img.src = l.photo;
  });

  svg.querySelectorAll(".craftArt image.craftPhoto").forEach(function(img){
    img.addEventListener("load", function(){ img.setAttribute("opacity", "1"); });
  });
}

// Preload any custom badge images (none currently defined, but keeps the door open)
function preloadBadgePhotos() {
  LEVELS.forEach(function(lvl){
    lvl.elements.filter(function(e){ return e.image; }).forEach(function(e){
      var badge = svg.querySelector('.badge[data-id = "' + e.id + '"]');
      if (!badge) return;
      var img = new Image();
      img.onload = function(){ badge.classList.add("hasPhoto"); };
      img.onerror = function(){ badge.classList.remove("hasPhoto"); };
      img.src = e.image;
    });
  });

  svg.querySelectorAll(".badge image.badgePhoto").forEach(function(img){
    img.addEventListener("load", function(){ img.setAttribute("opacity", "1"); });
  });
}

// Generate 60 random twinkling star divs inside #stars for the background
function buildStars() {
  var wrap = document.getElementById("stars");
  var n = 60;
  for (var i = 0; i < n; i++) {
    var s = document.createElement("div");
    s.className = "star";
    var size = Math.random() * 2 + 1;
    s.style.width = size + "px";
    s.style.height = size + "px";
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 100 + "%";
    s.style.animationDelay = Math.random() * 3 + "s";
    wrap.appendChild(s);
  }
}

// Switch to a different level: hide old SVG group, show new one, update HUD
function switchLevel(id) {
  st.currentLevel = id;
  st.selectedId = null;
  st.dragging = null;

  svg.querySelectorAll(".craftLevel").forEach(function(g){
    g.classList.toggle("activeLevel", g.dataset.level === id);
  });

  document.querySelectorAll(".levelTab").forEach(function(tab){
    tab.classList.toggle("active", tab.dataset.level === id);
  });

  ui.craftNameLabel.textContent = levelById(id).craftName;
  refreshSel();
  updateHud();
}

// Click handler for element badges: toggle selection state on/off
function onBadgeClick(e) {
  if (st.dragging) return;
  var id = e.currentTarget.dataset.id;
  if (st.matchedByLevel[st.currentLevel].has(id)) return;
  st.selectedId = st.selectedId === id ? null : id;
  refreshSel();
}

// Click handler for hotspot dots: if a badge is selected, attempt to match it
function onHotspotClick(e) {
  var target = e.currentTarget.dataset.target;
  if (!st.selectedId) {
    showToast("⬅️ Select an element first, then tap a hotspot.", false);
    return;
  }
  tryMatch(st.selectedId, target);
}

// Update the .selected CSS class on all badges based on st.selectedId
function refreshSel() {
  svg.querySelectorAll(".badge").forEach(function(b){
    b.classList.toggle("selected", b.dataset.id === st.selectedId);
  });
}

// Pointer-down handler: start dragging a line from a badge to the cursor position
function onBadgeDown(e) {
  var badge = e.currentTarget;
  var id = badge.dataset.id;
  if (st.matchedByLevel[st.currentLevel].has(id)) return;

  badge.setPointerCapture(e.pointerId);
  var center = badgeCenter(id);
  st.dragging = { id: id, pointerId: e.pointerId, moved: false };

  dragLine.setAttribute("x1", center.x);
  dragLine.setAttribute("y1", center.y);
  dragLine.setAttribute("x2", center.x);
  dragLine.setAttribute("y2", center.y);
  dragLine.style.stroke = elById(id).color;
  dragLine.removeAttribute("visibility");

  badge.addEventListener("pointermove", onBadgeMove);
  badge.addEventListener("pointerup", onBadgeUp);
  badge.addEventListener("pointercancel", onBadgeUp);
}

// Pointer-move handler: update the drag line endpoint to follow the cursor
function onBadgeMove(e) {
  if (!st.dragging) return;
  st.dragging.moved = true;
  var p = svgPoint(e.clientX, e.clientY);
  dragLine.setAttribute("x2", p.x);
  dragLine.setAttribute("y2", p.y);
}

// Pointer-up handler: hide drag line, find nearest hotspot, attempt match if close enough
function onBadgeUp(e) {
  var badge = e.currentTarget;
  badge.removeEventListener("pointermove", onBadgeMove);
  badge.removeEventListener("pointerup", onBadgeUp);
  badge.removeEventListener("pointercancel", onBadgeUp);

  dragLine.setAttribute("visibility", "hidden");
  if (!st.dragging) return;
  var id = st.dragging.id, moved = st.dragging.moved;
  st.dragging = null;
  if (!moved) return;

  var p = svgPoint(e.clientX, e.clientY);
  var closestTarget = null;
  var closestDist = Infinity;

  svg.querySelectorAll('.craftLevel[data-level = "' + st.currentLevel + '"] .hotspot').forEach(function(h){
    var c = hotspotCenter(h.dataset.target);
    var d = Math.hypot(c.x - p.x, c.y - p.y);
    if (d < closestDist) { closestDist = d; closestTarget = h.dataset.target; }
  });

  var targetEl = closestTarget ? hotspotEl(closestTarget) : null;
  if (closestTarget && closestDist < 45 && !(targetEl && st.matchedByLevel[st.currentLevel].has(targetEl.id))) {
    tryMatch(id, closestTarget);
  }
}

// Core matching logic: check if element's hotspot matches the dropped target
function tryMatch(elementId, target) {
  var el = elById(elementId);
  var hotspotEl = svg.querySelector('.craftLevel[data-level = "' + st.currentLevel + '"] .hotspot[data-target = "' + target + '"]');

  if (el.hotspot === target) {
    // Correct match: record it, update score with streak bonus, draw connection line
    st.matchedByLevel[st.currentLevel].add(el.id);

    st.streak += 1;
    st.bestStreak = Math.max(st.bestStreak, st.streak);
    var streakBonus = st.streak >= 2 ? (st.streak - 1) * 5 : 0;
    st.score += 20 + streakBonus;

    st.selectedId = null;
    updateHud();
    refreshSel();

    svg.querySelector('.badge[data-id = "' + el.id + '"]').classList.add("matched");
    hotspotEl.classList.add("matched");
    drawConn(el.id, target);

    showFact(el);

    if (el.surpriseFact && Math.random() < 0.2) {
      showSurpriseFact(el);
    } else if (st.streak >= 3) {
      showToast("🔥 " + st.streak + " in a row! +" + streakBonus + " bonus", true);
    } else {
      showToast("✅ " + el.name + " correctly wired to " + el.use + "!", true);
    }
  } else {
    // Wrong match: subtract 5 points, reset streak, increment mistake counter
    st.score = Math.max(0, st.score - 5);
    st.streak = 0;
    st.mistakesByLevel[st.currentLevel] += 1;
    updateHud();
    st.selectedId = null;
    refreshSel();

    hotspotEl.classList.add("wrong");
    setTimeout(function(){ hotspotEl.classList.remove("wrong"); }, 300);
    var correctEl = hotspotEl(target);
    showToast("🚫 Not quite -- that hotspot is for " + correctEl.name + " (" + correctEl.use + ").", false);
  }
}

// Draw a quadratic bezier curve connecting a matched badge to its hotspot
function drawConn(elementId, target) {
  var a = badgeCenter(elementId);
  var b = hotspotCenter(target);
  var midX = (a.x + b.x) / 2;
  var midY = Math.min(a.y, b.y) - 60;
  var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M " + a.x + " " + a.y + " Q " + midX + " " + midY + " " + b.x + " " + b.y);
  path.setAttribute("class", "connectionLine");
  path.style.stroke = elById(elementId).color;
  connLayer().appendChild(path);
}

// Refresh all HUD numbers: score, match count, total, levels done, streak
function updateHud() {
  var lvl = curLvl();
  ui.scoreVal.textContent = st.score;
  ui.matchVal.textContent = st.matchedByLevel[st.currentLevel].size;
  ui.totalVal.textContent = lvl.elements.length;
  ui.levelsDoneVal.textContent = countDone();
  if (ui.streakVal) ui.streakVal.textContent = st.streak;

  document.querySelectorAll(".levelTab").forEach(function(tab){
    tab.classList.toggle("complete", lvlComplete(tab.dataset.level));
  });
}

// Show a temporary toast message at the bottom of the screen
function showToast(msg, good) {
  ui.toast.textContent = msg;
  ui.toast.className = "show" + (good ? " good" : "");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(function(){ ui.toast.className = ""; }, 2200);
}

// Show a longer yellow-bordered toast with the element's surpriseFact
function showSurpriseFact(el) {
  ui.toast.innerHTML = '✨ <b>Did you know?</b> ' + el.surpriseFact;
  ui.toast.className = "show good surprise";
  clearTimeout(showToast._t);
  showToast._t = setTimeout(function(){ ui.toast.className = ""; }, 4500);
}

// Open the fact modal popup showing the matched element's name, symbol, and description
function showFact(el) {
  document.getElementById("factHead").innerHTML =
    '<h1>✅ Connection Made!</h1><p class="sub">' + el.name + ' wired to ' + el.use + '.</p>';
  document.getElementById("factCard").innerHTML = 
    '<div class="tag">' + el.symbol + ' · ' + el.use + '</div>' +
    '<div class="ttl">' + el.name + '</div>' +
    '<div class="body">' + el.fact + '</div>';
  document.getElementById("factOverlay").classList.add("show");
}

// Close the fact modal and check if the level or entire game is now complete
document.getElementById("factContinueBtn").addEventListener("click", function(){
  document.getElementById("factOverlay").classList.remove("show");
  checkAfterFact();
});

// After closing a fact modal: show level-complete modal or win screen if done
function checkAfterFact() {
  if (!lvlComplete(st.currentLevel)) return;
  if (countDone() === LEVELS.length) {
    showWin();
  } else {
    showLvlComplete(curLvl());
  }
}

// Show the "Level Complete!" modal with star rating and next-level button
function showLvlComplete(lvl) {
  var stars = starsFor(lvl.id);
  document.getElementById("levelCompleteText").innerHTML =
    "You've wired up every material on the " + lvl.label + ".<br><span style=\"font-size:1.4rem\">" + starStr(stars) + "</span><br>Ready for the next challenge?\nYou've got this!!!";
  document.getElementById("levelOverlay").classList.add("show");
}

// "Next Level" button: close modal and jump to the first unfinished level
document.getElementById("nextLevelBtn").addEventListener("click", function(){
  document.getElementById("levelOverlay").classList.remove("show");
  var next = null;
  for (var i=0; i<LEVELS.length; i++) {
    if (!lvlComplete(LEVELS[i].id)) { next = LEVELS[i]; break; }
  }
  if (next) switchLevel(next.id);
});

// Build and display the final win screen with score, stars, and full glossary
function showWin() {
  document.getElementById("finalScore").textContent = st.score;
  var glossary = document.getElementById("winGlossary");
  var html = '<div style="text-align:center;margin-bottom:10px">' +
    'Best streak: 🔥' + st.bestStreak + ' &nbsp;|&nbsp; ';
  for (var i=0; i<LEVELS.length; i++) {
    html += LEVELS[i].icon + ' ' + starStr(starsFor(LEVELS[i].id)) + '  ';
  }
  html += '</div>';
  glossary.innerHTML = html;

  LEVELS.forEach(function(lvl){
    lvl.elements.forEach(function(el){
      var item = document.createElement("div");
      item.className = "glItem";
      item.innerHTML = '<div class="h">' + lvl.icon + ' ' + el.symbol + ' ' + el.name + ' — ' + el.use + '</div><div class="b">' + el.fact + '</div>';
      glossary.appendChild(item);
    });
  });

  document.getElementById("winOverlay").classList.add("show");
}

// Attach reset handlers to both the header Reset button and Play Again button
document.getElementById("playAgainBtn").addEventListener("click", resetGame);
document.getElementById("resetBtn").addEventListener("click", resetGame);

// Reset all game state to zero, clear connection lines, and restart at level 1
function resetGame() {
  st.score = 0;
  st.matchedByLevel = {};
  st.selectedId = null;
  st.dragging = null;
  st.streak = 0;
  st.bestStreak = 0;
  st.mistakesByLevel = {};

  for (var i=0; i<LEVELS.length; i++) {
    st.matchedByLevel[LEVELS[i].id] = new Set();
    st.mistakesByLevel[LEVELS[i].id] = 0;
  }

  svg.querySelectorAll(".connections").forEach(function(g){ g.innerHTML = ""; });
  svg.querySelectorAll(".badge").forEach(function(b){ b.classList.remove("matched", "selected"); });
  svg.querySelectorAll(".hotspot").forEach(function(h){ h.classList.remove("matched", "wrong"); });

  document.getElementById("winOverlay").classList.remove("show");
  document.getElementById("factOverlay").classList.remove("show");
  document.getElementById("levelOverlay").classList.remove("show");

  switchLevel(LEVELS[0].id);
}

// Start the game
init();
