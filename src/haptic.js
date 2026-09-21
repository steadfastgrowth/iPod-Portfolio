// iOS 26.5+ only runs the Taptic Engine when a finger crosses a real
// <input type="checkbox" switch> thumb. element.click() and setting
// .checked from script do nothing. The wheel keeps a switch under the
// active touch and flips its direction once per menu detent so WebKit
// treats the thumb as sliding under the finger (ios-vibrator-pro-max).

function isIos() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  if (/iP(hone|ad|od)/.test(ua)) return true;
  return navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
}

function buzz(ms) {
  try {
    navigator.vibrate?.(ms);
  } catch {
    /* Android only. iOS ignores the Vibration API. */
  }
}

let wheelApi = null;

function switchInput() {
  const input = document.createElement("input");
  input.type = "checkbox";
  input.setAttribute("switch", "");
  input.tabIndex = -1;
  input.setAttribute("aria-hidden", "true");
  input.style.cssText = [
    "all: revert",
    "position: absolute",
    "width: 100%",
    "height: 100%",
    "top: 50%",
    "left: 50%",
    "transform: translate(-50%, -50%)",
    "margin: 0",
    "touch-action: none",
  ].join(";");
  return input;
}

export function attachTapHaptic(mount) {
  if (!mount || typeof document === "undefined" || !isIos()) return () => {};

  const clip = document.createElement("div");
  clip.setAttribute("aria-hidden", "true");
  clip.style.cssText = [
    "all: unset",
    "position: absolute",
    "inset: 0",
    "overflow: hidden",
    "opacity: 0",
    "pointer-events: auto",
    "clip-path: inset(0 round 999px)",
    "-webkit-tap-highlight-color: transparent",
  ].join(";");
  clip.appendChild(switchInput());
  mount.appendChild(clip);

  return () => clip.remove();
}

export function attachWheelHaptic(mount, onMove) {
  if (!mount || typeof document === "undefined" || !isIos()) return () => {};

  const clip = document.createElement("div");
  clip.setAttribute("aria-hidden", "true");
  clip.setAttribute("data-wheel-haptic", "");
  const input = switchInput();
  input.setAttribute("data-wheel-haptic", "");
  clip.appendChild(input);
  mount.appendChild(clip);

  let tracking = false;
  let startX = 0;
  let startY = 0;
  let x = 0;
  let y = 0;
  let flipped = false;
  let vibrate = false;
  let pending = false;
  let pointerId = null;

  const layoutIdle = () => {
    clip.style.cssText = [
      "all: unset",
      "position: absolute",
      "inset: 0",
      "overflow: hidden",
      "opacity: 0",
      "pointer-events: auto",
      "clip-path: inset(0 round 999px)",
      "-webkit-tap-highlight-color: transparent",
    ].join(";");
  };

  const layoutDrag = () => {
    const scale = 0.4;
    const height = 31 * scale;
    const width = 70 * scale;
    const top = (vibrate ? startY : y) - height / 2;
    const left = (vibrate ? startX : x) - width / 2;
    const angle = Math.atan2(y - startY, x - startX) * (180 / Math.PI);
    const angle360 = ((angle % 360) + 360) % 360;

    clip.style.cssText = [
      "all: unset",
      "position: absolute",
      "overflow: hidden",
      `height: ${height}px`,
      `width: ${width}px`,
      "top: 0",
      "left: 0",
      "opacity: 0",
      "pointer-events: auto",
      `direction: ${!vibrate || flipped ? "rtl" : "ltr"}`,
      `transform: translate(${left}px, ${top}px) rotate(${angle360}deg) translateX(${vibrate ? 0 : 50}px)`,
      "-webkit-tap-highlight-color: transparent",
    ].join(";");
  };

  const point = (event) => {
    const box = mount.getBoundingClientRect();
    return [event.clientX - box.left, event.clientY - box.top];
  };

  const end = () => {
    if (!tracking) return;
    tracking = false;
    pointerId = null;
    vibrate = false;
    pending = false;
    input.checked = false;
    layoutIdle();
    requestAnimationFrame(() => {
      input.checked = false;
    });
  };

  const onPointerDown = (event) => {
    if (pointerId !== null) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pointerId = event.pointerId;
    [startX, startY] = point(event);
    x = startX;
    y = startY;
    tracking = true;
    vibrate = false;
    pending = false;
    layoutIdle();
    try {
      input.setPointerCapture(event.pointerId);
    } catch {
      /* capture is best-effort; implicit touch capture still covers iOS */
    }
  };

  const onPointerMove = (event) => {
    if (!tracking || event.pointerId !== pointerId) return;
    [x, y] = point(event);
    // Runs in the capture phase, before Safari acts on the switch, so a detent
    // can slide the thumb under the finger on this same move.
    onMove?.(event.clientX, event.clientY);
    if (pending) {
      pending = false;
      flipped = !flipped;
      vibrate = true;
    } else {
      vibrate = false;
    }
    layoutDrag();
  };

  const onPointerUp = (event) => {
    if (event.pointerId !== pointerId) return;
    end();
  };

  layoutIdle();
  input.addEventListener("pointerdown", onPointerDown, true);
  window.addEventListener("pointermove", onPointerMove, true);
  window.addEventListener("pointerup", onPointerUp, true);
  window.addEventListener("pointercancel", onPointerUp, true);

  const api = {
    isTracking() {
      return tracking;
    },
    armTick() {
      if (!tracking) return;
      pending = true;
    },
    destroy() {
      input.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("pointermove", onPointerMove, true);
      window.removeEventListener("pointerup", onPointerUp, true);
      window.removeEventListener("pointercancel", onPointerUp, true);
      clip.remove();
      if (wheelApi === api) wheelApi = null;
    },
  };

  wheelApi = api;
  return () => api.destroy();
}

export function wheelGestureActive() {
  return wheelApi?.isTracking() ?? false;
}

export function hapticTick() {
  buzz(12);
  wheelApi?.armTick();
}

export function haptic(ms = 12) {
  buzz(ms);
}
