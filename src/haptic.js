let switchEl;

function ensureIosSwitch() {
  if (typeof document === "undefined") return null;
  if (switchEl?.isConnected) return switchEl;
  const el = document.createElement("input");
  el.type = "checkbox";
  el.setAttribute("switch", "");
  el.setAttribute("aria-hidden", "true");
  el.tabIndex = -1;
  el.style.cssText = "position:fixed;left:-48px;top:-48px;width:36px;height:22px;margin:0;opacity:0;pointer-events:none;";
  document.body.appendChild(el);
  switchEl = el;
  return el;
}

export function haptic(ms = 10) {
  try {
    ensureIosSwitch()?.click();
  } catch {
    /* ignore */
  }
  try {
    navigator.vibrate?.(ms);
  } catch {
    /* ignore */
  }
}
