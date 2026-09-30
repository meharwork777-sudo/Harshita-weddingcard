// ========== EDIT THESE ==========
const USE_MY_DESIGN = true;    // your own designs are on
const VENUE_NAME = "Royal Pepper Banquet Hall";
const VENUE_ADDRESS = "Sector 3, Rohini, New Delhi 110085";
const MAP_LINK = "";           // optional: paste your Google Maps share link here
// ================================

const $ = (id) => document.getElementById(id);
if (USE_MY_DESIGN) document.body.classList.add("custom");
$("venueName").textContent = VENUE_NAME + ", " + VENUE_ADDRESS;
$("mapBtn").href = MAP_LINK ||
  "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(VENUE_NAME + " " + VENUE_ADDRESS);

// fade in pages on scroll
const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add("in")), { threshold: 0.3 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

// petals
function startPetals() {
  const icons = ["🌸", "🌼", "🌺", "✨"];
  setInterval(() => {
    const s = document.createElement("span");
    s.textContent = icons[Math.floor(Math.random() * icons.length)];
    s.style.left = Math.random() * 100 + "vw";
    s.style.fontSize = 14 + Math.random() * 16 + "px";
    s.style.animationDuration = 6 + Math.random() * 6 + "s";
    $("petals").appendChild(s);
    setTimeout(() => s.remove(), 12000);
  }, 450);
}

// music on/off button
const music = $("music"), mb = $("musicBtn");
mb.addEventListener("click", () => {
  if (music.paused) { music.play(); mb.textContent = "🔊"; } else { music.pause(); mb.textContent = "🔇"; }
});
music.addEventListener("error", () => mb.remove());   // no music.mp3 found -> hide button

// tap to open the door
$("tapBtn").addEventListener("click", () => {
  $("door").classList.add("open");
  $("music").play().catch(() => {});
  document.body.classList.remove("locked");
  startPetals();
  setTimeout(() => $("door").remove(), 2000);
});

// confetti
function confetti() {
  const icons = ["🎉", "🌸", "✨", "💛", "🎊"];
  for (let i = 0; i < 40; i++) {
    const s = document.createElement("span");
    s.className = "burst";
    s.textContent = icons[i % icons.length];
    s.style.setProperty("--x", (Math.random() - .5) * 600 + "px");
    s.style.setProperty("--y", (Math.random() - .5) * 600 + "px");
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 1500);
  }
}

// scratch card
const cv = $("scratch"), ctx = cv.getContext("2d");
function gold(w, h) {
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, "#b8860b"); g.addColorStop(.5, "#ffe27a"); g.addColorStop(1, "#b8860b");
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#5a0f1f"; ctx.font = "600 16px Poppins"; ctx.textAlign = "center";
  ctx.fillText("Scratch here", w / 2, h / 2 + 5);
}
function drawCover() {
  const r = cv.getBoundingClientRect();
  cv.width = r.width; cv.height = r.height;
  const css = getComputedStyle(document.documentElement);
  const v = n => parseFloat(css.getPropertyValue(n)) / 100;
  const img = new Image();
  // draws the matching slice of your "scratch" version of page 2 on top
  img.onload = () => ctx.drawImage(img,
    v("--sx") * img.naturalWidth, v("--sy") * img.naturalHeight,
    v("--sw") * img.naturalWidth, v("--sh") * img.naturalHeight,
    0, 0, r.width, r.height);
  img.onerror = () => gold(r.width, r.height);
  img.src = "images/page2-scratch.jpg";
}
drawCover();

let drawing = false, finished = false, moves = 0;
function scratchAt(e) {
  const r = cv.getBoundingClientRect();
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath(); ctx.arc(e.clientX - r.left, e.clientY - r.top, 20, 0, Math.PI * 2); ctx.fill();
  if (++moves % 8 === 0) checkDone();
}
function checkDone() {
  if (finished) return;
  const d = ctx.getImageData(0, 0, cv.width, cv.height).data;
  let clear = 0;
  for (let i = 3; i < d.length; i += 16) if (d[i] === 0) clear++;
  if (clear / (d.length / 16) > 0.4) { finished = true; cv.classList.add("done"); confetti(); }
}
cv.addEventListener("pointerdown", e => { drawing = true; cv.setPointerCapture(e.pointerId); scratchAt(e); });
cv.addEventListener("pointermove", e => drawing && scratchAt(e));
cv.addEventListener("pointerup", () => drawing = false);
