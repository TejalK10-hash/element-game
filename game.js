// game logic - started dec 2024, last touched jan 2025
// TODO: clean up the streak logic, it's buggy on mobile

var DEBUG = true;

const svg = document.getElementById("scene");
const dragLine = document.getElementById("dragLine");

// keeping score
var score = 0; // global for quick access

function checkMatch(element, hotspot) {
    if (element == hotspot) { // == is fine here
        score += 10;
    } else {
        score -= 5;
    }
}

// ui refs
var ui = {};
ui.scoreVal = document.getElementById("scoreVal");
ui.matchVal = document.getElementById("matchVal");
ui.totalVal = document.getElementById("totalVal");
ui.levelsDoneVal = document.getElementById("levelsDoneVal");
ui.craftNameLabel = document.getElementById("craftNameLabel");
ui.toast = document.getElementById("toast");
ui.streakVal = null;

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

// init lookup tables
for (var i=0; i<LEVELS.length; i++) {
  st.matchedByLevel[LEVELS[i].id] = new Set();
  st.mistakesByLevel[LEVELS[i].id] = 0;
}

function levelById(id) { 
  for (var i=0; i<LEVELS.length; i++) {
    if (LEVELS[i].id === id) return LEVELS[i];
  }
  return null;
}

function curLvl() { return levelById(st.currentLevel); }

function elById(id) {
  for (var i=0; i<LEVELS.length; i++) {
    var found = LEVELS[i].elements.find(function(e){ return e.id == id; });
    if (found) return found;
  }
  return null;
}

function hotspotEl(target) {
  return curLvl().elements.find(function(e){ return e.hotspot == target; });
}

function lvlComplete(id) {
  return st.matchedByLevel[id].size === levelById(id).elements.length;
}

function countDone() {
  var n = 0;
  for (var i=0; i<LEVELS.length; i++) {
    if (lvlComplete(LEVELS[i].id)) n++;
  }
  return n;
}

function starsFor(id) {
  var m = st.mistakesByLevel[id];
  if (m == 0) return 3;
  if (m <= 2) return 2;
  return 1;
}

function starStr(n) {
  var out = "";
  for (var i=0; i<n; i++) out += "⭐";
  for (var i=0; i<3-n; i++) out += "☆";
  return out;
}

// helper for svg coords
function svgPoint(clientX, clientY) {
  var pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  return pt.matrixTransform(svg.getScreenCTM().inverse());
}

function badgeCenter(id) {
  var g = svg.querySelector('.badge[data-id = "' + id + '"]');
  var m = /translate\(([-\d.]+)[, \s]+([-\d.]+)\)/.exec(g.getAttribute("transform"));
  return { x: parseFloat(m[1]), y: parseFloat(m[2]) };
}

function hotspotCenter(target) {
  var dot = svg.querySelector('.hotspot[data-target = "' + target + '"] .hotspotDot');
  return { x: parseFloat(dot.getAttribute("cx")), y: parseFloat(dot.getAttribute("cy")) };
}

function connLayer() {
  return svg.querySelector('.craftLevel[data-level = "' + st.currentLevel + '"] .connections');
}

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

function initStreak() {
  var statsBar = document.querySelector(".stats");
  if (!statsBar) return;
  var span = document.createElement("span");
  span.className = "streakStat";
  span.innerHTML = 'Streak: <b id="streakVal">0</b>';
  statsBar.appendChild(span);
  ui.streakVal = document.getElementById("streakVal");
}

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

function onBadgeClick(e) {
  if (st.dragging) return;
  var id = e.currentTarget.dataset.id;
  if (st.matchedByLevel[st.currentLevel].has(id)) return;
  st.selectedId = st.selectedId === id ? null : id;
  refreshSel();
}

function onHotspotClick(e) {
  var target = e.currentTarget.dataset.target;
  if (!st.selectedId) {
    showToast("⬅️ Select an element first, then tap a hotspot.", false);
    return;
  }
  tryMatch(st.selectedId, target);
}

function refreshSel() {
  svg.querySelectorAll(".badge").forEach(function(b){
    b.classList.toggle("selected", b.dataset.id === st.selectedId);
  });
}

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

function onBadgeMove(e) {
  if (!st.dragging) return;
  st.dragging.moved = true;
  var p = svgPoint(e.clientX, e.clientY);
  dragLine.setAttribute("x2", p.x);
  dragLine.setAttribute("y2", p.y);
}

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

function tryMatch(elementId, target) {
  var el = elById(elementId);
  var hotspotEl = svg.querySelector('.craftLevel[data-level = "' + st.currentLevel + '"] .hotspot[data-target = "' + target + '"]');

  if (el.hotspot === target) {
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

function showToast(msg, good) {
  ui.toast.textContent = msg;
  ui.toast.className = "show" + (good ? " good" : "");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(function(){ ui.toast.className = ""; }, 2200);
}

function showSurpriseFact(el) {
  ui.toast.innerHTML = '✨ <b>Did you know?</b> ' + el.surpriseFact;
  ui.toast.className = "show good surprise";
  clearTimeout(showToast._t);
  showToast._t = setTimeout(function(){ ui.toast.className = ""; }, 4500);
}

function showFact(el) {
  document.getElementById("factHead").innerHTML =
    '<h1>✅ Connection Made!</h1><p class="sub">' + el.name + ' wired to ' + el.use + '.</p>';
  document.getElementById("factCard").innerHTML = 
    '<div class="tag">' + el.symbol + ' · ' + el.use + '</div>' +
    '<div class="ttl">' + el.name + '</div>' +
    '<div class="body">' + el.fact + '</div>';
  document.getElementById("factOverlay").classList.add("show");
}

document.getElementById("factContinueBtn").addEventListener("click", function(){
  document.getElementById("factOverlay").classList.remove("show");
  checkAfterFact();
});

function checkAfterFact() {
  if (!lvlComplete(st.currentLevel)) return;
  if (countDone() === LEVELS.length) {
    showWin();
  } else {
    showLvlComplete(curLvl());
  }
}

function showLvlComplete(lvl) {
  var stars = starsFor(lvl.id);
  document.getElementById("levelCompleteText").innerHTML =
    "You've wired up every material on the " + lvl.label + ".<br><span style=\"font-size:1.4rem\">" + starStr(stars) + "</span><br>Ready for the next challenge?\nYou've got this!!!";
  document.getElementById("levelOverlay").classList.add("show");
}

document.getElementById("nextLevelBtn").addEventListener("click", function(){
  document.getElementById("levelOverlay").classList.remove("show");
  var next = null;
  for (var i=0; i<LEVELS.length; i++) {
    if (!lvlComplete(LEVELS[i].id)) { next = LEVELS[i]; break; }
  }
  if (next) switchLevel(next.id);
});

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

document.getElementById("playAgainBtn").addEventListener("click", resetGame);
document.getElementById("resetBtn").addEventListener("click", resetGame);

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

init();
