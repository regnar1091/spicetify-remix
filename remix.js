// Remix Mode for Spicetify
// Reproduce solo un "highlight" de cada canción y las encadena con fades,
// como un mini DJ-set / medley.
(async function remixMode() {
  while (!(Spicetify?.Player && Spicetify?.Menu)) {
    await new Promise((r) => setTimeout(r, 300));
  }

  const cfg = {
    segmentSec: 30,  // cuánto suena cada canción
    startRatio: 0.3, // desde qué punto de la canción empieza (0.3 = 30%)
    fadeMs: 1200,    // duración del fade in / fade out
  };

  let enabled = false;
  let baseVolume = 1;
  let timer = null;
  let runId = 0; // invalida ciclos viejos si cambias de canción

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  async function fade(from, to, ms, id) {
    const steps = 20;
    for (let i = 1; i <= steps; i++) {
      if (id !== runId) return false;
      Spicetify.Player.setVolume(from + ((to - from) * i) / steps);
      await sleep(ms / steps);
    }
    return true;
  }

  async function playHighlight() {
    clearTimeout(timer);
    if (!enabled) return;
    const id = ++runId;

    const dur = Spicetify.Player.getDuration(); // ms
    if (!dur) return;

    Spicetify.Player.setVolume(0);
    if (dur > cfg.segmentSec * 1500) {
      Spicetify.Player.seek(Math.floor(dur * cfg.startRatio));
    }

    if (!(await fade(0, baseVolume, cfg.fadeMs, id))) return;

    const wait = cfg.segmentSec * 1000 - cfg.fadeMs * 2;
    timer = setTimeout(async () => {
      if (await fade(baseVolume, 0, cfg.fadeMs, id)) Spicetify.Player.next();
    }, Math.max(wait, 0));
  }

  function toggle(item) {
    enabled = !enabled;
    item.setState(enabled);
    runId++;
    clearTimeout(timer);
    if (enabled) {
      baseVolume = Spicetify.Player.getVolume() || 1;
      playHighlight();
    } else {
      Spicetify.Player.setVolume(baseVolume);
    }
  }

  const item = new Spicetify.Menu.Item("Remix mode", false, toggle);
  item.register();

  Spicetify.Player.addEventListener("songchange", playHighlight);
})();
