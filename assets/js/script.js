const CONFIG = {
  launchDate: "2026-06-01T00:00:00",
};

(function initFooterYear() {
  const el = document.getElementById("footer-year");
  if (el) el.textContent = String(new Date().getFullYear());
})();

(function initTheme() {
  const STORAGE_KEY = "utilivos-theme";
  const btn = document.getElementById("theme-toggle");

  function getStored() {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      if (s === "light" || s === "dark") return s;
    } catch (e) {}
    return null;
  }

  function systemPrefersLight() {
    return window.matchMedia("(prefers-color-scheme: light)").matches;
  }

  /** true = light appearance, false = dark */
  function isEffectiveLight() {
    const stored = getStored();
    if (stored === "light") return true;
    if (stored === "dark") return false;
    return systemPrefersLight();
  }

  function syncToggle() {
    const light = isEffectiveLight();
    if (!btn) return;
    btn.classList.toggle("theme-toggle--effective-light", light);
    btn.classList.toggle("theme-toggle--effective-dark", !light);
    btn.setAttribute(
      "aria-label",
      light ? "Switch to dark mode" : "Switch to light mode"
    );
  }

  function onToggleClick() {
    const next = isEffectiveLight() ? "dark" : "light";
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (e) {}
    document.documentElement.setAttribute("data-theme", next);
    syncToggle();
  }

  if (btn) {
    btn.addEventListener("click", onToggleClick);
  }
  syncToggle();

  const mql = window.matchMedia("(prefers-color-scheme: light)");
  function onSchemeChange() {
    if (getStored() === null) {
      syncToggle();
    }
  }
  if (typeof mql.addEventListener === "function") {
    mql.addEventListener("change", onSchemeChange);
  } else if (typeof mql.addListener === "function") {
    mql.addListener(onSchemeChange);
  }
})();

(function () {
  const launch = new Date(CONFIG.launchDate).getTime();
  const els = {
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds"),
    countdown: document.getElementById("countdown"),
    live: document.getElementById("countdown-live"),
  };

  let intervalId = null;

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function showLive() {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
    if (els.countdown) {
      els.countdown.classList.add("is-hidden");
      els.countdown.setAttribute("aria-hidden", "true");
    }
    if (els.live) {
      els.live.classList.remove("is-hidden");
      els.live.removeAttribute("aria-hidden");
    }
  }

  function tick() {
    const now = Date.now();
    let diff = launch - now;

    if (diff <= 0) {
      showLive();
      return;
    }

    const secondsTotal = Math.floor(diff / 1000);
    const days = Math.floor(secondsTotal / 86400);
    const hours = Math.floor((secondsTotal % 86400) / 3600);
    const minutes = Math.floor((secondsTotal % 3600) / 60);
    const seconds = secondsTotal % 60;

    if (els.days) els.days.textContent = String(days);
    if (els.hours) els.hours.textContent = pad(hours);
    if (els.minutes) els.minutes.textContent = pad(minutes);
    if (els.seconds) els.seconds.textContent = pad(seconds);
  }

  if (Number.isNaN(launch)) {
    showLive();
    if (els.live) els.live.textContent = "Launching now";
    return;
  }

  tick();
  if (els.countdown && !els.countdown.classList.contains("is-hidden")) {
    intervalId = setInterval(tick, 1000);
  }
})();
