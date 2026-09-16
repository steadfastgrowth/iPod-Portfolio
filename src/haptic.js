function isIos() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  if (/iP(hone|ad|od)/.test(ua)) return true;
  return navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
}

export function attachIosHaptic(element, { touchAction = "manipulation", mark = "data-haptic-trigger" } = {}) {
  if (!element || typeof window === "undefined" || !isIos()) return () => {};
  if (element.querySelector(`[${mark}]`)) return () => {};

  const prevPosition = element.style.position;
  if (getComputedStyle(element).position === "static") {
    element.style.position = "relative";
  }

  const switchEl = document.createElement("input");
  switchEl.type = "checkbox";
  switchEl.setAttribute("switch", "");
  switchEl.setAttribute(mark, "");
  switchEl.setAttribute("aria-hidden", "true");
  switchEl.tabIndex = -1;
  Object.assign(switchEl.style, {
    position: "absolute",
    inset: "0",
    width: "100%",
    height: "100%",
    margin: "0",
    opacity: "0",
    clipPath: "inset(0 round 999px)",
    touchAction,
    zIndex: "1",
    cursor: "pointer",
  });
  switchEl.style.setProperty("-webkit-tap-highlight-color", "transparent");
  element.appendChild(switchEl);

  return () => {
    switchEl.remove();
    if (prevPosition === "") element.style.position = "";
  };
}

export function hapticTick(host) {
  try {
    navigator.vibrate?.(5);
  } catch {
    /* ignore */
  }
  if (!host) return;
  const sw = host.querySelector("[data-haptic-ring]");
  if (!sw) return;
  sw.checked = !sw.checked;
}

export function haptic(ms = 10) {
  try {
    navigator.vibrate?.(ms);
  } catch {
    /* ignore */
  }
}
