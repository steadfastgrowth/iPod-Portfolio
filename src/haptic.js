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

export function attachWheelHaptic(mount) {
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
  let extraFlips = 0;
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

  const layoutDrag = (underFinger) => {
    const height = 31 * 0.55;
    const width = 70 * 0.55;
    const anchorX = underFinger ? x : startX;
    const anchorY = underFinger ? y : startY;
    const top = anchorY - height / 2;
    const left = anchorX - width / 2;
    const angle = Math.atan2(y - startY, x - startX) * (180 / Math.PI);
    const angle360 = ((angle % 360) + 360) % 360;
    // Park the thumb on the finger and flip direction so the knob crosses it.
    // Offset the control when we are not ticking, or every move would buzz.
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
      `direction: ${flipped ? "rtl" : "ltr"}`,
      `transform: translate(${left}px, ${top}px) rotate(${angle360}deg) translateX(${underFinger ? 0 : 46}px)`,
      "-webkit-tap-highlight-color: transparent",
    ].join(";");
    if (underFinger) clip.getBoundingClientRect();
  };

  const point = (event) => {
    const box = mount.getBoundingClientRect();
    return [event.clientX - box.left, event.clientY - box.top];
  };

  const end = () => {
    if (!tracking) return;
    tracking = false;
    pointerId = null;
    extraFlips = 0;
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
    extraFlips = 0;
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
    if (extraFlips > 0) {
      extraFlips -= 1;
      flipped = !flipped;
      layoutDrag(true);
    } else {
      layoutDrag(false);
    }
  };

  const onTouchMove = (event) => {
    if (!tracking) return;
    const touch = event.touches[0];
    if (!touch) return;
    [x, y] = point(touch);
  };

  const onPointerUp = (event) => {
    if (event.pointerId !== pointerId) return;
    end();
  };

  layoutIdle();
  input.addEventListener("pointerdown", onPointerDown, true);
  input.addEventListener("touchmove", onTouchMove, { capture: true, passive: true });
  window.addEventListener("pointermove", onPointerMove, true);
  window.addEventListener("pointerup", onPointerUp, true);
  window.addEventListener("pointercancel", onPointerUp, true);

  const api = {
    isTracking() {
      return tracking;
    },
    armTick() {
      if (!tracking) return;
      flipped = !flipped;
      extraFlips = 1;
      layoutDrag(true);
    },
    destroy() {
      input.removeEventListener("pointerdown", onPointerDown, true);
      input.removeEventListener("touchmove", onTouchMove, true);
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
